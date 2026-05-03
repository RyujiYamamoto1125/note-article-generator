import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const MAX_FIELD_LENGTHS: Record<string, number> = {
  topic: 500,
  targetReader: 500,
  readerProblem: 2000,
  mainMessage: 2000,
  purpose: 100,
  authorBackground: 1000,
  tone: 100,
  wordCountLabel: 50,
  keywords: 2000,
};

const REQUIRED_FIELDS = [
  "topic",
  "targetReader",
  "readerProblem",
  "mainMessage",
  "purpose",
  "authorBackground",
  "tone",
  "wordCountLabel",
];

function validateRequest(
  apiKey: unknown,
  answers: unknown
): string | null {
  if (typeof apiKey !== "string" || !apiKey.startsWith("sk-ant-")) {
    return "APIキーの形式が正しくありません";
  }
  if (apiKey.length > 500) {
    return "APIキーが長すぎます";
  }
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return "入力データが不正です";
  }
  const a = answers as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (!a[field] || typeof a[field] !== "string" || !(a[field] as string).trim()) {
      return `必須項目が入力されていません`;
    }
  }
  for (const [field, maxLen] of Object.entries(MAX_FIELD_LENGTHS)) {
    if (typeof a[field] === "string" && (a[field] as string).length > maxLen) {
      return `入力が長すぎます`;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > 50 * 1024) {
    return NextResponse.json(
      { error: "リクエストサイズが大きすぎます" },
      { status: 413 }
    );
  }

  let body: { apiKey?: unknown; answers?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が不正です" }, { status: 400 });
  }

  const { apiKey, answers } = body;
  const validationError = validateRequest(apiKey, answers);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const a = answers as Record<string, string>;
  const wordCountLabel = a.wordCountLabel || "2000字程度";
  const rawCount = parseInt(wordCountLabel.replace(/[^0-9]/g, "") || "3000", 10);
  // 日本語1字 ≈ 1.8トークン。2.7倍で余裕を持たせる。上限32000。
  const maxTokens = Math.min(Math.max(Math.ceil(rawCount * 2.7), 4096), 32000);

  const client = new Anthropic({ apiKey: apiKey as string });

  const systemPrompt = `あなたは日本最高峰のコピーライターです。読者の心を動かし、行動を促すnote記事を書く天才です。

【執筆原則】
1. 冒頭3行で読者の心を鷲掴みにする強力なフックを作る（問いかけ・衝撃事実・共感から始める）
2. 共感 → 問題提起 → 解決策 → 実証 → 行動促進 の黄金構成に従う
3. 具体的なエピソード・数字・固有名詞を使いリアリティを出す
4. 読者が「自分のことだ」と感じる言葉選びをする
5. 「〜です・ます」調で親しみやすく、しかし専門性も感じさせる
6. 見出し（## ###）を効果的に使い読みやすく構成する
7. 最後は読者に明確な行動を促すCTAで締める
8. note向けのマークダウン形式（# ## ### で見出し、**太字**活用）で出力する
9. 文字数は【${wordCountLabel}】に合わせて執筆する（この指示を最優先）

【重要】指定された文字数を必ず守り、高品質なnote記事として完成させてください。`;

  const userPrompt = `以下の情報をもとに、プロのコピーライターとしてnote記事を執筆してください。

■ 記事テーマ・タイトルイメージ: ${a.topic}
■ ターゲット読者: ${a.targetReader}
■ 読者の悩み・課題: ${a.readerProblem}
■ 記事で伝えたいこと・メッセージ: ${a.mainMessage}
■ 記事の目的: ${a.purpose}
■ 筆者の経験・実績・ポジション: ${a.authorBackground}
■ トーン・雰囲気: ${a.tone}
■ 含めたいキーワード・エピソード: ${a.keywords?.trim() || "特になし"}
■ 目標文字数: ${wordCountLabel}

読者が最後まで読み切り、シェアしたくなるような素晴らしいnote記事を書いてください。`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = message.content[0];
    if (content.type !== "text" || !content.text?.trim()) {
      return NextResponse.json(
        { error: "記事生成に失敗しました。もう一度お試しください" },
        { status: 500 }
      );
    }

    return NextResponse.json({ article: content.text });
  } catch (err: unknown) {
    if (err instanceof Anthropic.APIError) {
      if (err.status === 401) {
        return NextResponse.json(
          { error: "APIキーが無効です。Anthropic Consoleで有効なキーを確認してください" },
          { status: 401 }
        );
      }
      if (err.status === 429) {
        return NextResponse.json(
          { error: "APIの利用上限に達しています。しばらく待ってからお試しください" },
          { status: 429 }
        );
      }
      if (err.status && err.status >= 500) {
        return NextResponse.json(
          { error: "Anthropic APIが一時的に利用できません。しばらく後にお試しください" },
          { status: 502 }
        );
      }
    }
    console.error("[generate] unexpected error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json(
      { error: "記事生成中にエラーが発生しました。もう一度お試しください" },
      { status: 500 }
    );
  }
}

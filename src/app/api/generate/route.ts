import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { apiKey, answers } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: "APIキーが必要です" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const wordCountLabel = answers.wordCountLabel || "2000〜3000字程度";

  // max_tokens を文字量に応じて調整（日本語1字≒1.5〜2トークン）
  const rawCount = parseInt(answers.wordCountLabel?.replace(/[^0-9]/g, "") || "3000", 10);
  const maxTokens = Math.min(Math.max(Math.ceil(rawCount * 2.5), 2048), 8192);

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

■ 記事テーマ・タイトルイメージ: ${answers.topic}
■ ターゲット読者: ${answers.targetReader}
■ 読者の悩み・課題: ${answers.readerProblem}
■ 記事で伝えたいこと・メッセージ: ${answers.mainMessage}
■ 記事の目的: ${answers.purpose}
■ 筆者の経験・実績・ポジション: ${answers.authorBackground}
■ トーン・雰囲気: ${answers.tone}
■ 含めたいキーワード・エピソード: ${answers.keywords || "特になし"}
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
    if (content.type !== "text") {
      return NextResponse.json({ error: "記事生成に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ article: content.text });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    if (error.status === 401) {
      return NextResponse.json(
        { error: "APIキーが無効です。正しいキーを入力してください" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: error.message || "記事生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

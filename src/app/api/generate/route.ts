import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { apiKey, answers } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: "APIキーが必要です" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const systemPrompt = `あなたは日本最高峰のコピーライターです。読者の心を動かし、行動を促す記事を書く天才です。
以下の特徴を持つnote記事を執筆してください：

【執筆原則】
- 冒頭3行で読者の心を鷲掴みにする強力なフックを作る
- 共感→問題提起→解決策→行動促進の黄金構成に従う
- 具体的なエピソードや数字を使いリアリティを出す
- 読者が「自分のことだ」と感じる言葉選びをする
- 「〜です・ます」調で親しみやすく、しかし専門性も感じさせる
- 見出し（H2・H3）を効果的に使い読みやすく構成する
- 最後は読者に行動を促すCTAで締める
- note向けのマークダウン形式（# ## ### で見出し）で出力する
- 文字数は2000〜4000文字程度

【重要】高品質なnote記事として完成させてください。`;

  const userPrompt = `以下の情報をもとに、プロのコピーライターとしてnote記事を執筆してください。

■ 記事テーマ・タイトルイメージ: ${answers.topic}
■ ターゲット読者: ${answers.targetReader}
■ 読者の悩み・課題: ${answers.readerProblem}
■ 記事で伝えたいこと・メッセージ: ${answers.mainMessage}
■ 記事の目的（認知拡大・集客・販売など）: ${answers.purpose}
■ 筆者の経験・実績・ポジション: ${answers.authorBackground}
■ トーン・雰囲気: ${answers.tone}
■ 含めたいキーワード・エピソード: ${answers.keywords || "特になし"}

上記をもとに、読者が最後まで読み切り、シェアしたくなるような素晴らしいnote記事を書いてください。`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "記事生成に失敗しました" },
        { status: 500 }
      );
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

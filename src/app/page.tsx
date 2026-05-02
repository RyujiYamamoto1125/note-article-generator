"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    id: "topic",
    label: "記事のテーマ・タイトルイメージ",
    placeholder: "例：副業で月10万円稼ぐ方法、転職で年収200万円上げた体験談",
    type: "text" as const,
    required: true,
  },
  {
    id: "targetReader",
    label: "ターゲット読者はどんな人？",
    placeholder: "例：20〜30代の会社員で副業に興味があるが何から始めていいかわからない人",
    type: "text" as const,
    required: true,
  },
  {
    id: "readerProblem",
    label: "読者が抱えている悩み・課題は？",
    placeholder: "例：時間がない、スキルに自信がない、何を売ればいいかわからない",
    type: "textarea" as const,
    required: true,
  },
  {
    id: "mainMessage",
    label: "この記事で一番伝えたいメッセージは？",
    placeholder: "例：特別なスキルがなくても、スキマ時間3時間で月10万円は誰でも達成できる",
    type: "textarea" as const,
    required: true,
  },
  {
    id: "purpose",
    label: "記事の目的は何ですか？",
    placeholder: "例：フォロワー増加・メルマガ登録・有料コンテンツ販売・認知拡大",
    type: "text" as const,
    required: true,
  },
  {
    id: "authorBackground",
    label: "あなたの経験・実績・ポジションを教えてください",
    placeholder: "例：副業歴3年・累計売上500万円・元メーカー営業マン",
    type: "textarea" as const,
    required: true,
  },
  {
    id: "tone",
    label: "記事のトーン・雰囲気は？",
    placeholder: "例：親しみやすく温かい / 論理的でビジネスライク / 熱量高くモチベアップ系",
    type: "text" as const,
    required: true,
  },
  {
    id: "keywords",
    label: "含めたいキーワード・エピソードがあれば（任意）",
    placeholder: "例：「諦めかけた時の逆転劇」「○○メソッド」「会社にバレずに」",
    type: "textarea" as const,
    required: false,
  },
];

type Answers = Record<string, string>;

function parseMarkdown(text: string): string {
  return text
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-5 mb-2 text-gray-800">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-6 list-disc mb-1">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-6 list-decimal mb-1">$2</li>')
    .replace(/\n\n/g, '\n')
    .split('\n')
    .map(line => {
      if (line.match(/^<[h1-6|li]/)) return line;
      if (line.trim() === '') return '';
      return `<p class="mb-4">${line}</p>`;
    })
    .join('\n');
}

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [article, setArticle] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const totalSteps = QUESTIONS.length;
  const isLastQuestion = currentStep === totalSteps - 1;
  const currentQuestion = QUESTIONS[currentStep];

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) return;
    setApiKeySaved(true);
  };

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]?.trim()) return;
    if (isLastQuestion) {
      handleGenerate();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        setIsGenerating(false);
        return;
      }
      setArticle(data.article);
    } catch {
      setError("通信エラーが発生しました。もう一度お試しください。");
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setArticle("");
    setError("");
    setCurrentStep(0);
    setAnswers({});
  };

  if (article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">記事が完成しました!</h2>
                <p className="text-gray-500 text-sm mt-1">noteにコピペして公開しましょう</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                >
                  {copied ? "✓ コピー完了" : "コピー"}
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  もう一度作成
                </button>
              </div>
            </div>
            <div
              className="border-t pt-6 text-gray-800 leading-relaxed text-base"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(article) }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!apiKeySaved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
              <span className="text-3xl">✍️</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Note記事ジェネレーター</h1>
            <p className="text-gray-600 text-lg">
              質問に答えるだけで<br />
              <span className="font-semibold text-indigo-600">プロ級のnote記事</span>を自動生成
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Anthropic APIキーを入力
            </label>
            <p className="text-xs text-gray-500 mb-4">
              APIキーは{" "}
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline"
              >
                Anthropic Console
              </a>{" "}
              で取得できます。ブラウザには保存されません。
            </p>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-16 font-mono text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSaveApiKey()}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showApiKey ? "隠す" : "表示"}
              </button>
            </div>
            <button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
              className="w-full mt-4 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              開始する →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Note記事ジェネレーター</h1>
          <p className="text-gray-500 text-sm mt-1">
            質問 {currentStep + 1} / {totalSteps}
          </p>
        </div>

        <div className="mb-6 bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {isGenerating ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-2xl mb-6">
                <span className="text-4xl animate-pulse">✍️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">記事を執筆中...</h3>
              <p className="text-gray-500">日本一のコピーライターが魂を込めて書いています</p>
              <div className="mt-6 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <label className="block text-xl font-bold text-gray-900 mb-2">
                {currentQuestion.label}
                {currentQuestion.required && (
                  <span className="text-indigo-500 ml-1 text-base">*</span>
                )}
              </label>
              {!currentQuestion.required && (
                <p className="text-sm text-gray-400 mb-3">任意項目です</p>
              )}

              {currentQuestion.type === "textarea" ? (
                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-800 placeholder-gray-400"
                />
              ) : (
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                />
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="px-6 py-3 border border-gray-300 hover:bg-gray-50 disabled:invisible text-gray-700 rounded-xl font-medium transition-colors"
                >
                  ← 戻る
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    currentQuestion.required && !answers[currentQuestion.id]?.trim()
                  }
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLastQuestion ? "記事を生成する ✨" : "次へ →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

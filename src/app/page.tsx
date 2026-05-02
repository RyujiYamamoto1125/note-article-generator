"use client";

import { useState } from "react";

const WORD_COUNT_OPTIONS = [
  { value: "1000", label: "1,000字", desc: "SNS・ライト記事" },
  { value: "2000", label: "2,000字", desc: "標準記事" },
  { value: "3000", label: "3,000字", desc: "詳細解説" },
  { value: "5000", label: "5,000字", desc: "完全ガイド" },
  { value: "custom", label: "カスタム", desc: "自由入力" },
];

const TONE_OPTIONS = [
  { value: "親しみやすく温かい", label: "温かい", icon: "☀️" },
  { value: "論理的でビジネスライク", label: "ビジネス", icon: "💼" },
  { value: "熱量高くモチベアップ系", label: "情熱的", icon: "🔥" },
  { value: "落ち着いた知的な雰囲気", label: "知的", icon: "📚" },
  { value: "共感・寄り添い系", label: "共感系", icon: "🤝" },
  { value: "ユーモアを交えた軽い雰囲気", label: "ユーモア", icon: "😄" },
];

const PURPOSE_OPTIONS = [
  { value: "フォロワー・認知拡大", label: "認知拡大", icon: "📣" },
  { value: "メルマガ・LINE登録獲得", label: "リスト獲得", icon: "📧" },
  { value: "有料コンテンツ販売", label: "販売", icon: "💰" },
  { value: "コンサル・サービス集客", label: "集客", icon: "🎯" },
  { value: "ブランディング・権威確立", label: "ブランディング", icon: "👑" },
  { value: "情報提供・教育", label: "教育", icon: "🎓" },
];

const QUESTIONS = [
  {
    id: "topic",
    label: "記事のテーマ・タイトルイメージ",
    sublabel: "どんな内容の記事を書きたいですか？",
    placeholder: "例：副業で月10万円稼ぐ方法、転職で年収200万円上げた体験談",
    type: "text" as const,
    required: true,
  },
  {
    id: "targetReader",
    label: "ターゲット読者",
    sublabel: "誰に届けたい記事ですか？",
    placeholder: "例：20〜30代の会社員で副業に興味があるが何から始めていいかわからない人",
    type: "text" as const,
    required: true,
  },
  {
    id: "readerProblem",
    label: "読者の悩み・課題",
    sublabel: "読者はどんな問題を抱えていますか？",
    placeholder: "例：時間がない、スキルに自信がない、何を売ればいいかわからない",
    type: "textarea" as const,
    required: true,
  },
  {
    id: "mainMessage",
    label: "一番伝えたいメッセージ",
    sublabel: "読んだあとに残したい印象は？",
    placeholder: "例：特別なスキルがなくても、スキマ時間3時間で月10万円は誰でも達成できる",
    type: "textarea" as const,
    required: true,
  },
  {
    id: "purpose",
    label: "記事の目的",
    sublabel: "この記事で何を達成したいですか？",
    placeholder: "",
    type: "select-purpose" as const,
    required: true,
  },
  {
    id: "authorBackground",
    label: "あなたの経験・実績",
    sublabel: "筆者のポジション・信頼性を教えてください",
    placeholder: "例：副業歴3年・累計売上500万円・元メーカー営業マン",
    type: "textarea" as const,
    required: true,
  },
  {
    id: "tone",
    label: "トーン・雰囲気",
    sublabel: "どんな雰囲気で書きますか？",
    placeholder: "",
    type: "select-tone" as const,
    required: true,
  },
  {
    id: "wordCount",
    label: "記事の文字量",
    sublabel: "どのくらいの分量で書きますか？",
    placeholder: "",
    type: "select-wordcount" as const,
    required: true,
  },
  {
    id: "keywords",
    label: "キーワード・エピソード",
    sublabel: "含めたい言葉や体験があれば（任意）",
    placeholder: "例：「諦めかけた時の逆転劇」「○○メソッド」「会社にバレずに」",
    type: "textarea" as const,
    required: false,
  },
];

type Answers = Record<string, string>;

function parseMarkdown(text: string): string {
  return text
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-3 text-white">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-2 text-violet-300">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-slate-200">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc mb-1.5 text-slate-300">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-5 list-decimal mb-1.5 text-slate-300">$2</li>')
    .replace(/\n\n/g, "\n")
    .split("\n")
    .map((line) => {
      if (line.match(/^<[h1-6li]/)) return line;
      if (line.trim() === "") return '<div class="h-2"></div>';
      return `<p class="mb-3 text-slate-300 leading-relaxed">${line}</p>`;
    })
    .join("\n");
}

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [customWordCount, setCustomWordCount] = useState("");
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

  const currentAnswerValid = () => {
    if (!currentQuestion.required) return true;
    const val = answers[currentQuestion.id];
    if (!val?.trim()) return false;
    if (val === "custom" && !customWordCount.trim()) return false;
    return true;
  };

  const handleNext = () => {
    if (!currentAnswerValid()) return;
    if (isLastQuestion) {
      handleGenerate();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const getWordCountLabel = () => {
    const v = answers.wordCount;
    if (!v) return "";
    if (v === "custom") return customWordCount + "字";
    return v === "5000" ? "5000字以上" : v + "字程度";
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    const wordCountLabel = getWordCountLabel();
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, answers: { ...answers, wordCountLabel } }),
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
    setCustomWordCount("");
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  // ─── Result view ───────────────────────────────────────────────
  if (article) {
    return (
      <div className="min-h-screen bg-[#0a0a14] text-white">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-sm font-bold">N</div>
              <span className="font-semibold text-slate-200">Note記事ジェネレーター</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all bg-violet-600 hover:bg-violet-500 text-white"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    コピー完了
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    コピー
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl font-medium text-sm border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all"
              >
                もう一度作成
              </button>
            </div>
          </div>

          {/* Success banner */}
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-violet-700/50 p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-500/30 flex items-center justify-center text-violet-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="font-semibold text-violet-200 text-sm">記事が完成しました</p>
              <p className="text-slate-400 text-xs">noteにコピペして公開しましょう</p>
            </div>
          </div>

          {/* Article */}
          <div className="rounded-2xl bg-[#12121f] border border-slate-800 p-8">
            <div
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(article) }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ─── API key screen ─────────────────────────────────────────────
  if (!apiKeySaved) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-700/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[10%] w-[400px] h-[300px] bg-fuchsia-700/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 mb-5 shadow-lg shadow-violet-500/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              Note記事ジェネレーター
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              質問に答えるだけで、<br />
              <span className="text-violet-400 font-medium">プロ級のnote記事</span>を自動生成します
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-[#12121f] border border-slate-800 p-7 shadow-xl shadow-black/40">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Anthropic APIキー
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="w-full px-4 py-3 bg-[#0a0a14] border border-slate-700 focus:border-violet-500 rounded-xl text-slate-200 placeholder-slate-600 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all pr-16"
                onKeyDown={(e) => e.key === "Enter" && handleSaveApiKey()}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs transition-colors"
              >
                {showApiKey ? "隠す" : "表示"}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 hover:text-violet-400 underline underline-offset-2"
              >
                console.anthropic.com
              </a>{" "}
              で取得できます。サーバーには保存されません。
            </p>

            <button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
              className="w-full mt-5 py-3.5 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            >
              開始する
              <span className="ml-1.5 opacity-70">→</span>
            </button>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: "⚡", text: "30秒で生成" },
              { icon: "✍️", text: "プロ品質" },
              { icon: "🔒", text: "データ非保存" },
            ].map((f) => (
              <div key={f.text} className="text-center py-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-lg mb-1">{f.icon}</div>
                <div className="text-xs text-slate-500">{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Questionnaire ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-800/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white">N</div>
            <span className="text-sm font-medium text-slate-400">Note記事ジェネレーター</span>
          </div>
          <span className="text-xs text-slate-600 tabular-nums">
            {currentStep + 1} <span className="text-slate-700">/</span> {totalSteps}
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-7">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className="transition-all duration-300"
              style={{
                height: "3px",
                flex: 1,
                borderRadius: "9999px",
                background: i <= currentStep
                  ? "linear-gradient(to right, #7c3aed, #a855f7)"
                  : "#1e1e2e",
              }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-[#12121f] border border-slate-800 shadow-2xl shadow-black/50 p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          {isGenerating ? (
            <div className="text-center py-14">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-violet-600/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-violet-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/30 animate-ping" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">執筆中...</h3>
              <p className="text-sm text-slate-500">日本一のコピーライターが記事を書いています</p>
              <div className="mt-5 h-1 rounded-full bg-slate-800 overflow-hidden w-48 mx-auto">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 animate-[shimmer_1.5s_ease-in-out_infinite]"
                  style={{ animation: "moveRight 1.5s ease-in-out infinite", width: "60%" }} />
              </div>
            </div>
          ) : (
            <>
              {/* Question */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-1.5">
                  Q{currentStep + 1}
                </p>
                <h2 className="text-xl font-bold text-white mb-1">
                  {currentQuestion.label}
                  {currentQuestion.required && (
                    <span className="text-violet-500 ml-1 text-sm font-normal">必須</span>
                  )}
                </h2>
                <p className="text-sm text-slate-500">{currentQuestion.sublabel}</p>
              </div>

              {/* Input by type */}
              {currentQuestion.type === "select-purpose" && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {PURPOSE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleAnswer(opt.value)}
                      className={`flex flex-col items-center justify-center gap-1 py-4 px-3 rounded-xl border text-sm font-medium transition-all ${
                        answers[currentQuestion.id] === opt.value
                          ? "border-violet-500 bg-violet-500/15 text-violet-300"
                          : "border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === "select-tone" && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {TONE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleAnswer(opt.value)}
                      className={`flex flex-col items-center justify-center gap-1 py-4 px-3 rounded-xl border text-sm font-medium transition-all ${
                        answers[currentQuestion.id] === opt.value
                          ? "border-violet-500 bg-violet-500/15 text-violet-300"
                          : "border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === "select-wordcount" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {WORD_COUNT_OPTIONS.filter((o) => o.value !== "custom").map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleAnswer(opt.value)}
                        className={`flex flex-col items-center justify-center gap-0.5 py-4 px-3 rounded-xl border text-sm transition-all ${
                          answers[currentQuestion.id] === opt.value
                            ? "border-violet-500 bg-violet-500/15 text-violet-300"
                            : "border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                        }`}
                      >
                        <span className="font-bold text-base">{opt.label}</span>
                        <span className="text-xs opacity-70">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                  {/* Custom option */}
                  <button
                    type="button"
                    onClick={() => handleAnswer("custom")}
                    className={`w-full py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                      answers[currentQuestion.id] === "custom"
                        ? "border-violet-500 bg-violet-500/15 text-violet-300"
                        : "border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    カスタム（自由入力）
                  </button>
                  {answers[currentQuestion.id] === "custom" && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min={500}
                        max={20000}
                        value={customWordCount}
                        onChange={(e) => setCustomWordCount(e.target.value)}
                        placeholder="例：4000"
                        className="flex-1 px-4 py-2.5 bg-[#0a0a14] border border-slate-700 focus:border-violet-500 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
                      />
                      <span className="text-sm text-slate-500">字</span>
                    </div>
                  )}
                </div>
              )}

              {currentQuestion.type === "textarea" && (
                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0a0a14] border border-slate-700 focus:border-violet-500 rounded-xl text-slate-200 placeholder-slate-600 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
                />
              )}

              {currentQuestion.type === "text" && (
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full px-4 py-3 bg-[#0a0a14] border border-slate-700 focus:border-violet-500 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                />
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handleBack}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all ${currentStep === 0 ? "invisible" : ""}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  戻る
                </button>
                <button
                  onClick={handleNext}
                  disabled={!currentAnswerValid()}
                  className="flex items-center gap-1.5 px-7 py-2.5 rounded-xl text-sm font-semibold transition-all bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isLastQuestion ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      記事を生成する
                    </>
                  ) : (
                    <>
                      次へ
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Hint */}
        {!isGenerating && currentQuestion.type === "text" && (
          <p className="text-center text-xs text-slate-700 mt-3">
            Enterキーでも次へ進めます
          </p>
        )}
      </div>
    </div>
  );
}

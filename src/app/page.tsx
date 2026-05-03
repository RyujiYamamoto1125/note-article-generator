"use client";

import { useState } from "react";

// ─── Types & constants ──────────────────────────────────────────
type View = "landing" | "apikey" | "questionnaire" | "result";

const WORD_COUNT_OPTIONS = [
  { value: "1000", label: "1,000字", desc: "ショート" },
  { value: "2000", label: "2,000字", desc: "スタンダード" },
  { value: "3000", label: "3,000字", desc: "詳細" },
  { value: "5000", label: "5,000字", desc: "ロング" },
  { value: "custom", label: "カスタム", desc: "自由入力" },
];

const PURPOSE_OPTIONS = [
  { value: "フォロワー・認知拡大", label: "認知拡大", icon: "📣" },
  { value: "メルマガ・LINE登録獲得", label: "リスト獲得", icon: "📧" },
  { value: "有料コンテンツ販売", label: "販売", icon: "💰" },
  { value: "コンサル・サービス集客", label: "集客", icon: "🎯" },
  { value: "ブランディング・権威確立", label: "ブランディング", icon: "👑" },
  { value: "情報提供・教育", label: "教育", icon: "🎓" },
];

const TONE_OPTIONS = [
  { value: "親しみやすく温かい", label: "温かい", icon: "☀️" },
  { value: "論理的でビジネスライク", label: "ビジネス", icon: "💼" },
  { value: "熱量高くモチベアップ系", label: "情熱的", icon: "🔥" },
  { value: "落ち着いた知的な雰囲気", label: "知的", icon: "📚" },
  { value: "共感・寄り添い系", label: "共感系", icon: "🤝" },
  { value: "ユーモアを交えた軽い雰囲気", label: "ユーモア", icon: "😄" },
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
    label: "キーワード・エピソード（任意）",
    sublabel: "含めたい言葉や体験があれば",
    placeholder: "例：「諦めかけた時の逆転劇」「○○メソッド」「会社にバレずに」",
    type: "textarea" as const,
    required: false,
  },
];

type Answers = Record<string, string>;

function parseMarkdown(text: string): string {
  return text
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-3 text-gray-900">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-2 text-indigo-700">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-700">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc mb-1.5 text-gray-700">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-5 list-decimal mb-1.5 text-gray-700">$2</li>')
    .replace(/\n\n/g, "\n")
    .split("\n")
    .map((line) => {
      if (line.match(/^<[h1-6li]/)) return line;
      if (line.trim() === "") return '<div class="h-2"></div>';
      return `<p class="mb-3 text-gray-700 leading-relaxed">${line}</p>`;
    })
    .join("\n");
}

// ─── Landing Page ───────────────────────────────────────────────
function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">Note記事ジェネレーター</span>
          </div>
          <button
            onClick={onStart}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-indigo-200"
          >
            無料で使う
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
          Claude AI搭載 | プロ品質の記事を自動生成
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
          質問に答えるだけで<br />
          <span className="text-indigo-600">プロ級のnote記事</span>が完成
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          日本一のコピーライターが書くような高品質な記事を、<br className="hidden sm:block" />
          誰でも簡単に・たった数分で作成できます。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 text-base"
          >
            今すぐ無料で試す
            <span className="ml-2 opacity-70">→</span>
          </button>
          <p className="text-sm text-gray-400">APIキーのみ必要・完全無料</p>
        </div>

        {/* Mock UI preview */}
        <div className="mt-16 max-w-3xl mx-auto rounded-2xl border border-gray-200 shadow-2xl shadow-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 text-center">note-article-generator.vercel.app</div>
            </div>
          </div>
          <div className="bg-white p-8">
            <div className="max-w-sm mx-auto space-y-4">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Q3 / 9</div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: "33%" }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">一番伝えたいメッセージ</h3>
              <div className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl p-3">
                <p className="text-sm text-gray-400">特別なスキルがなくても、スキマ時間3時間で月10万円は誰でも達成できる</p>
              </div>
              <div className="flex justify-end">
                <div className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg">
                  次へ →
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">3つの特徴</h2>
            <p className="text-gray-500">誰でも簡単に、プロ品質の記事を</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "💬",
                title: "質問に答えるだけ",
                desc: "難しい操作は一切不要。テーマや読者像など9つの質問に答えるだけで、あとはAIが全て書き上げます。",
              },
              {
                icon: "✨",
                title: "日本一品質の文章",
                desc: "共感→問題提起→解決策→CTA の黄金構成で、読者が最後まで読み切る記事を自動生成します。",
              },
              {
                icon: "⚡",
                title: "30秒で完成",
                desc: "最新のClaude AIが高速で記事を生成。1,000字から5,000字以上まで、文字量も自由に指定できます。",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">使い方</h2>
            <p className="text-gray-500">たった3ステップで記事が完成</p>
          </div>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "APIキーを入力",
                desc: "Anthropic ConsoleでAPIキーを取得して入力するだけ。キーはサーバーに保存されません。",
                color: "bg-indigo-50 border-indigo-100",
                badge: "bg-indigo-600",
              },
              {
                step: "02",
                title: "9つの質問に回答",
                desc: "テーマ・読者・目的・文字量など、テンプレートに沿って回答。各質問に例文があるので迷いません。",
                color: "bg-violet-50 border-violet-100",
                badge: "bg-violet-600",
              },
              {
                step: "03",
                title: "記事をコピーして投稿",
                desc: "AIが自動生成した記事をワンクリックでコピー。そのままnoteに貼り付けて公開できます。",
                color: "bg-fuchsia-50 border-fuchsia-100",
                badge: "bg-fuchsia-600",
              },
            ].map((s) => (
              <div key={s.step} className={`flex items-start gap-5 p-6 rounded-2xl border ${s.color}`}>
                <div className={`w-10 h-10 rounded-xl ${s.badge} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}>
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            今すぐ記事を生成してみる
          </h2>
          <p className="text-indigo-200 mb-8 leading-relaxed">
            APIキーを用意するだけで、すぐに使えます。<br />
            月額費用・登録不要。完全無料でご利用いただけます。
          </p>
          <button
            onClick={onStart}
            className="px-10 py-4 bg-white hover:bg-gray-50 text-indigo-600 font-bold rounded-xl text-base transition-all shadow-lg shadow-indigo-800/20"
          >
            無料で試してみる →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="text-sm text-gray-500">Note記事ジェネレーター</span>
          </div>
          <p className="text-xs text-gray-400">Powered by Claude AI (Anthropic)</p>
        </div>
      </footer>
    </div>
  );
}

// ─── API Key Screen ─────────────────────────────────────────────
function ApiKeyScreen({
  apiKey,
  setApiKey,
  onNext,
}: {
  apiKey: string;
  setApiKey: (v: string) => void;
  onNext: () => void;
}) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">APIキーを入力</h2>
          <p className="text-sm text-gray-500">
            <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              Anthropic Console
            </a>{" "}
            で取得したAPIキーを入力してください
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Anthropic APIキー
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-xl text-gray-800 placeholder-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all pr-16"
              onKeyDown={(e) => e.key === "Enter" && apiKey.trim() && onNext()}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors"
            >
              {showKey ? "隠す" : "表示"}
            </button>
          </div>

          <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-blue-700 leading-relaxed">
              入力されたAPIキーはリクエスト時にのみ使用され、サーバーには保存されません。
            </p>
          </div>

          <button
            onClick={onNext}
            disabled={!apiKey.trim()}
            className="w-full mt-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-all shadow-sm shadow-indigo-200 disabled:shadow-none text-sm"
          >
            質問へ進む →
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          APIキーの取得方法がわからない方は{" "}
          <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline">
            こちら
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Questionnaire ──────────────────────────────────────────────
function Questionnaire({
  answers,
  setAnswers,
  customWordCount,
  setCustomWordCount,
  onGenerate,
  isGenerating,
  error,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  customWordCount: string;
  setCustomWordCount: (v: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = QUESTIONS.length;
  const isLast = currentStep === totalSteps - 1;
  const q = QUESTIONS[currentStep];

  const handleAnswer = (value: string) =>
    setAnswers((prev) => ({ ...prev, [q.id]: value }));

  const valid = () => {
    if (!q.required) return true;
    const v = answers[q.id];
    if (!v?.trim()) return false;
    if (v === "custom" && !customWordCount.trim()) return false;
    return true;
  };

  const handleNext = () => {
    if (!valid()) return;
    if (isLast) onGenerate();
    else setCurrentStep((p) => p + 1);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-indigo-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-indigo-300 animate-ping opacity-40" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">記事を執筆中...</h3>
          <p className="text-gray-500 text-sm mb-6">AIが高品質な記事を生成しています</p>
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Note記事ジェネレーター</span>
          </div>
          <span className="text-xs text-gray-400 tabular-nums">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-7">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i <= currentStep ? "#4f46e5" : "#e5e7eb" }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Q{currentStep + 1}</span>
              {q.required ? (
                <span className="text-xs bg-red-50 text-red-500 border border-red-100 px-1.5 py-0.5 rounded font-medium">必須</span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-medium">任意</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{q.label}</h2>
            <p className="text-sm text-gray-500">{q.sublabel}</p>
          </div>

          {/* Input */}
          {q.type === "select-purpose" && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PURPOSE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={`flex flex-col items-center gap-1 py-4 rounded-xl border text-sm font-medium transition-all ${
                    answers[q.id] === opt.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {q.type === "select-tone" && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TONE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={`flex flex-col items-center gap-1 py-4 rounded-xl border text-sm font-medium transition-all ${
                    answers[q.id] === opt.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {q.type === "select-wordcount" && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {WORD_COUNT_OPTIONS.filter((o) => o.value !== "custom").map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className={`flex flex-col items-center gap-0.5 py-4 rounded-xl border text-sm transition-all ${
                      answers[q.id] === opt.value
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-bold">{opt.label}</span>
                    <span className="text-xs opacity-70">{opt.desc}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleAnswer("custom")}
                className={`w-full py-3 rounded-xl border text-sm font-medium transition-all ${
                  answers[q.id] === "custom"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                カスタム（自由入力）
              </button>
              {answers[q.id] === "custom" && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={500}
                    max={20000}
                    value={customWordCount}
                    onChange={(e) => setCustomWordCount(e.target.value)}
                    placeholder="例：4000"
                    className="flex-1 px-4 py-2.5 border border-gray-300 focus:border-indigo-500 rounded-xl text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <span className="text-sm text-gray-500">字</span>
                </div>
              )}
            </div>
          )}

          {q.type === "textarea" && (
            <textarea
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={q.placeholder}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-xl text-gray-800 placeholder-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          )}

          {q.type === "text" && (
            <input
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={q.placeholder}
              className="w-full px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-xl text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
            />
          )}

          {/* Nav */}
          <div className="flex justify-between items-center mt-7">
            <button
              onClick={() => setCurrentStep((p) => p - 1)}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all ${currentStep === 0 ? "invisible" : ""}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              戻る
            </button>
            <button
              onClick={handleNext}
              disabled={!valid()}
              className="flex items-center gap-1.5 px-7 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-indigo-200 disabled:shadow-none"
            >
              {isLast ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  記事を生成する
                </>
              ) : (
                <>
                  次へ
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {q.type === "text" && (
          <p className="text-center text-xs text-gray-400 mt-3">Enterキーでも次へ進めます</p>
        )}
      </div>
    </div>
  );
}

// ─── Result Screen ──────────────────────────────────────────────
function ResultScreen({
  article,
  onReset,
}: {
  article: string;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-gray-700">記事が完成しました</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
            >
              もう一度作成
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  コピー完了
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  コピー
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Banner */}
        <div className="mb-6 rounded-xl bg-green-50 border border-green-100 p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">記事の生成が完了しました</p>
            <p className="text-xs text-green-600">右上の「コピー」ボタンでコピーして、noteに貼り付けてください</p>
          </div>
        </div>

        {/* Article */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-10">
          <div
            className="leading-relaxed max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(article) }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Root ───────────────────────────────────────────────────────
export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [apiKey, setApiKey] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [customWordCount, setCustomWordCount] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [article, setArticle] = useState("");
  const [error, setError] = useState("");

  const getWordCountLabel = () => {
    const v = answers.wordCount;
    if (!v) return "2000字程度";
    if (v === "custom") return customWordCount + "字";
    if (v === "5000") return "5000字以上";
    return v + "字程度";
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    setView("questionnaire");
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
      setView("result");
    } catch {
      setError("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setArticle("");
    setError("");
    setAnswers({});
    setCustomWordCount("");
    setView("landing");
  };

  if (view === "landing") {
    return <LandingPage onStart={() => setView("apikey")} />;
  }

  if (view === "apikey") {
    return (
      <ApiKeyScreen
        apiKey={apiKey}
        setApiKey={setApiKey}
        onNext={() => setView("questionnaire")}
      />
    );
  }

  if (view === "result" && article) {
    return <ResultScreen article={article} onReset={handleReset} />;
  }

  return (
    <Questionnaire
      answers={answers}
      setAnswers={setAnswers}
      customWordCount={customWordCount}
      setCustomWordCount={setCustomWordCount}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      error={error}
    />
  );
}

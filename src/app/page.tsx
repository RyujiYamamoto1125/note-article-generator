"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

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
    maxLength: 500,
  },
  {
    id: "targetReader",
    label: "ターゲット読者",
    sublabel: "誰に届けたい記事ですか？",
    placeholder: "例：20〜30代の会社員で副業に興味があるが何から始めていいかわからない人",
    type: "text" as const,
    required: true,
    maxLength: 500,
  },
  {
    id: "readerProblem",
    label: "読者の悩み・課題",
    sublabel: "読者はどんな問題を抱えていますか？",
    placeholder: "例：時間がない、スキルに自信がない、何を売ればいいかわからない",
    type: "textarea" as const,
    required: true,
    maxLength: 2000,
  },
  {
    id: "mainMessage",
    label: "一番伝えたいメッセージ",
    sublabel: "読んだあとに残したい印象は？",
    placeholder: "例：特別なスキルがなくても、スキマ時間3時間で月10万円は誰でも達成できる",
    type: "textarea" as const,
    required: true,
    maxLength: 2000,
  },
  {
    id: "purpose",
    label: "記事の目的",
    sublabel: "この記事で何を達成したいですか？",
    placeholder: "",
    type: "select-purpose" as const,
    required: true,
    maxLength: 100,
  },
  {
    id: "authorBackground",
    label: "あなたの経験・実績",
    sublabel: "筆者のポジション・信頼性を教えてください",
    placeholder: "例：副業歴3年・累計売上500万円・元メーカー営業マン",
    type: "textarea" as const,
    required: true,
    maxLength: 1000,
  },
  {
    id: "tone",
    label: "トーン・雰囲気",
    sublabel: "どんな雰囲気で書きますか？",
    placeholder: "",
    type: "select-tone" as const,
    required: true,
    maxLength: 100,
  },
  {
    id: "wordCount",
    label: "記事の文字量",
    sublabel: "どのくらいの分量で書きますか？",
    placeholder: "",
    type: "select-wordcount" as const,
    required: true,
    maxLength: 50,
  },
  {
    id: "keywords",
    label: "キーワード・エピソード（任意）",
    sublabel: "含めたい言葉や体験があれば",
    placeholder: "例：「諦めかけた時の逆転劇」「○○メソッド」「会社にバレずに」",
    type: "textarea" as const,
    required: false,
    maxLength: 2000,
  },
];

type Answers = Record<string, string>;

// ─── Markdown renderer (safe, no dangerouslySetInnerHTML) ───────
const mdComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mt-8 mb-3 text-gray-900">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mt-6 mb-2 text-indigo-700">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-gray-700 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
  ul: ({ children }) => (
    <ul className="list-disc ml-5 mb-4 space-y-1 text-gray-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ml-5 mb-4 space-y-1 text-gray-700">{children}</ol>
  ),
  li: ({ children }) => <li className="mb-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-200 pl-4 my-4 italic text-gray-600">
      {children}
    </blockquote>
  ),
};

// ─── Landing Page ───────────────────────────────────────────────
function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center" aria-hidden="true">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">Note記事ジェネレーター</span>
          </div>
          <button
            onClick={onStart}
            aria-label="Note記事ジェネレーターを無料で使う"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-indigo-200"
          >
            無料で使う
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" aria-hidden="true" />
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
            aria-label="今すぐ無料でNote記事ジェネレーターを試す"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 text-base"
          >
            今すぐ無料で試す
            <span className="ml-2 opacity-70" aria-hidden="true">→</span>
          </button>
          <p className="text-sm text-gray-400">APIキーのみ必要・完全無料</p>
        </div>

        {/* Mock UI preview */}
        <div className="mt-16 max-w-3xl mx-auto rounded-2xl border border-gray-200 shadow-2xl shadow-gray-100 overflow-hidden" aria-hidden="true">
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 text-center">
                note-article-generator.vercel.app
              </div>
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
                <p className="text-sm text-gray-400">
                  特別なスキルがなくても、スキマ時間3時間で月10万円は誰でも達成できる
                </p>
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
              <div
                key={f.title}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4" aria-hidden="true">{f.icon}</div>
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
                <div
                  className={`w-10 h-10 rounded-xl ${s.badge} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}
                  aria-label={`ステップ${s.step}`}
                >
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
          <h2 className="text-3xl font-bold text-white mb-4">今すぐ記事を生成してみる</h2>
          <p className="text-indigo-200 mb-8 leading-relaxed">
            APIキーを用意するだけで、すぐに使えます。<br />
            月額費用・登録不要。完全無料でご利用いただけます。
          </p>
          <button
            onClick={onStart}
            aria-label="無料でNote記事ジェネレーターを試す"
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
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center" aria-hidden="true">
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
  const isValid = apiKey.trim().startsWith("sk-ant-");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-200" aria-hidden="true">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">APIキーを入力</h2>
          <p className="text-sm text-gray-500">
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Anthropic Console
            </a>{" "}
            で取得したAPIキーを入力してください
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
          <label htmlFor="api-key-input" className="block text-sm font-semibold text-gray-700 mb-2">
            Anthropic APIキー
          </label>
          <div className="relative">
            <input
              id="api-key-input"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-xl text-gray-800 placeholder-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all pr-16"
              onKeyDown={(e) => e.key === "Enter" && isValid && onNext()}
              aria-describedby="api-key-hint"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? "APIキーを隠す" : "APIキーを表示する"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors px-1 py-1"
            >
              {showKey ? "隠す" : "表示"}
            </button>
          </div>

          <div id="api-key-hint" className="mt-3 flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-blue-700 leading-relaxed">
              入力されたAPIキーはリクエスト時にのみ使用され、サーバーには保存されません。
            </p>
          </div>

          <button
            onClick={onNext}
            disabled={!isValid}
            aria-label="質問ページへ進む"
            className="w-full mt-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-all shadow-sm shadow-indigo-200 disabled:shadow-none text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            質問へ進む →
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          APIキーの取得方法は{" "}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 underline"
          >
            Anthropic Console
          </a>{" "}
          から
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
  onRetry,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  customWordCount: string;
  setCustomWordCount: (v: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string;
  onRetry: () => void;
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
    if (v === "custom") {
      const num = parseInt(customWordCount, 10);
      return !isNaN(num) && num >= 500 && num <= 20000;
    }
    return true;
  };

  const handleNext = () => {
    if (!valid()) return;
    if (isLast) onGenerate();
    else setCurrentStep((p) => p + 1);
  };

  const handleCustomWordCount = (val: string) => {
    const num = parseInt(val, 10);
    if (val === "") {
      setCustomWordCount("");
      return;
    }
    if (!isNaN(num)) {
      setCustomWordCount(String(Math.min(Math.max(num, 1), 20000)));
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" role="status" aria-live="polite">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-indigo-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-indigo-300 animate-ping opacity-40" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">記事を執筆中...</h3>
          <p className="text-gray-500 text-sm mb-1">AIが高品質な記事を生成しています</p>
          <p className="text-gray-400 text-xs mb-6">約30〜90秒かかります</p>
          <div className="flex justify-center gap-1.5" aria-hidden="true">
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
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center" aria-hidden="true">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Note記事ジェネレーター</span>
          </div>
          <span className="text-xs text-gray-400 tabular-nums" aria-label={`質問${currentStep + 1}/${totalSteps}`}>
            {currentStep + 1} / {totalSteps}
          </span>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-7" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
          {QUESTIONS.map((qItem, i) => (
            <div
              key={qItem.id}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i <= currentStep ? "#4f46e5" : "#e5e7eb" }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm" role="alert">
              <div className="flex items-start gap-2 mb-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
              <button
                onClick={onRetry}
                className="text-xs font-semibold text-red-700 underline underline-offset-2 hover:text-red-800"
              >
                もう一度試す
              </button>
            </div>
          )}

          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest" aria-hidden="true">
                Q{currentStep + 1}
              </span>
              {q.required ? (
                <span className="text-xs bg-red-50 text-red-500 border border-red-100 px-1.5 py-0.5 rounded font-medium">
                  必須
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-medium">
                  任意
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{q.label}</h2>
            <p className="text-sm text-gray-500">{q.sublabel}</p>
          </div>

          {/* Input by type */}
          {q.type === "select-purpose" && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="記事の目的を選択">
              {PURPOSE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAnswer(opt.value)}
                  aria-pressed={answers[q.id] === opt.value}
                  aria-label={`${opt.label}を選択`}
                  className={`flex flex-col items-center gap-1 py-4 rounded-xl border text-sm font-medium transition-all ${
                    answers[q.id] === opt.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl" aria-hidden="true">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {q.type === "select-tone" && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="トーン・雰囲気を選択">
              {TONE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAnswer(opt.value)}
                  aria-pressed={answers[q.id] === opt.value}
                  aria-label={`${opt.label}を選択`}
                  className={`flex flex-col items-center gap-1 py-4 rounded-xl border text-sm font-medium transition-all ${
                    answers[q.id] === opt.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl" aria-hidden="true">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {q.type === "select-wordcount" && (
            <div className="space-y-2" role="group" aria-label="記事の文字量を選択">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {WORD_COUNT_OPTIONS.filter((o) => o.value !== "custom").map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAnswer(opt.value)}
                    aria-pressed={answers[q.id] === opt.value}
                    aria-label={`${opt.label}（${opt.desc}）を選択`}
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
                type="button"
                onClick={() => handleAnswer("custom")}
                aria-pressed={answers[q.id] === "custom"}
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
                  <label htmlFor="custom-word-count" className="sr-only">
                    文字数を入力（500〜20000）
                  </label>
                  <input
                    id="custom-word-count"
                    type="number"
                    min={500}
                    max={20000}
                    value={customWordCount}
                    onChange={(e) => handleCustomWordCount(e.target.value)}
                    placeholder="例：4000"
                    aria-describedby="word-count-range"
                    className="flex-1 px-4 py-2.5 border border-gray-300 focus:border-indigo-500 rounded-xl text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <span className="text-sm text-gray-500">字</span>
                </div>
              )}
              {answers[q.id] === "custom" && (
                <p id="word-count-range" className="text-xs text-gray-400">
                  500〜20,000字の範囲で入力してください
                </p>
              )}
            </div>
          )}

          {q.type === "textarea" && (
            <div>
              <label htmlFor={`question-${q.id}`} className="sr-only">{q.label}</label>
              <textarea
                id={`question-${q.id}`}
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={q.placeholder}
                rows={4}
                maxLength={q.maxLength}
                className="w-full px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-xl text-gray-800 placeholder-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                aria-required={q.required}
              />
              {q.maxLength && (
                <p className="text-xs text-gray-400 text-right mt-1">
                  {(answers[q.id] || "").length} / {q.maxLength}字
                </p>
              )}
            </div>
          )}

          {q.type === "text" && (
            <div>
              <label htmlFor={`question-${q.id}`} className="sr-only">{q.label}</label>
              <input
                id={`question-${q.id}`}
                type="text"
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={q.placeholder}
                maxLength={q.maxLength}
                className="w-full px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-xl text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleNext()}
                aria-required={q.required}
              />
            </div>
          )}

          {/* Nav */}
          <div className="flex justify-between items-center mt-7">
            <button
              type="button"
              onClick={() => setCurrentStep((p) => p - 1)}
              aria-label="前の質問に戻る"
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all ${currentStep === 0 ? "invisible" : ""}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              戻る
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!valid()}
              aria-label={isLast ? "記事を生成する" : "次の質問へ進む"}
              className="flex items-center gap-1.5 px-7 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-indigo-200 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
            >
              {isLast ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  記事を生成する
                </>
              ) : (
                <>
                  次へ
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {q.type === "text" && (
          <p className="text-center text-xs text-gray-400 mt-3" aria-hidden="true">
            Enterキーでも次へ進めます
          </p>
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
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
            <span className="text-sm font-semibold text-gray-700">記事が完成しました</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              aria-label="もう一度新しい記事を作成する"
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
            >
              もう一度作成
            </button>
            <button
              onClick={handleCopy}
              aria-label={copied ? "コピーしました" : "記事をクリップボードにコピー"}
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  コピー完了
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
        <div className="mb-6 rounded-xl bg-green-50 border border-green-100 p-4 flex items-center gap-3" role="status">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">記事の生成が完了しました</p>
            <p className="text-xs text-green-600">
              右上の「コピー」ボタンでコピーして、noteに貼り付けてください
            </p>
          </div>
        </div>

        {/* Article */}
        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-10">
          <ReactMarkdown components={mdComponents}>{article}</ReactMarkdown>
        </article>
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
    if (v === "custom") return `${customWordCount}字`;
    if (v === "5000") return "5000字以上";
    return `${v}字程度`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    setArticle("");
    const wordCountLabel = getWordCountLabel();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2分タイムアウト

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, answers: { ...answers, wordCountLabel } }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }
      setArticle(data.article);
      setView("result");
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("タイムアウトしました。もう一度お試しください");
      } else if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("ネットワーク接続を確認してください");
      } else {
        setError("通信エラーが発生しました。もう一度お試しください");
      }
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

  const handleRetry = () => {
    setError("");
    handleGenerate();
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
      onRetry={handleRetry}
    />
  );
}

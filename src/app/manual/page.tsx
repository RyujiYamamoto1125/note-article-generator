import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "セットアップマニュアル | Note記事ジェネレーター",
  description:
    "Note記事ジェネレーターの使い方。Anthropic APIキーとPexels APIキーの取得・設定方法を画像付きで解説します。",
};

function StepBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex-shrink-0">
      {n}
    </span>
  );
}

function SectionAnchor({ id }: { id: string }) {
  return <span id={id} className="block -mt-20 pt-20" aria-hidden="true" />;
}

function Tag({ children, color = "indigo" }: { children: React.ReactNode; color?: "indigo" | "green" | "gray" }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    green: "bg-green-50 text-green-700 border-green-100",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
}

export default function ManualPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800">Note記事ジェネレーター</span>
          </div>
          <Link
            href="/"
            className="px-4 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            ツールを使う
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <Tag>セットアップマニュアル</Tag>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 tracking-tight">
            はじめてのセットアップ
          </h1>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto leading-relaxed">
            Note記事ジェネレーターを使うために必要な2つのAPIキーの取得・設定方法を説明します。
          </p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          <a href="#anthropic" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Anthropic APIキー</p>
                <Tag color="indigo">必須</Tag>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              記事の文章生成に使用します。Claude AIを動かすために必要です。
            </p>
            <p className="mt-3 text-xs text-indigo-500 font-medium group-hover:underline">
              取得方法を見る →
            </p>
          </a>

          <a href="#pexels" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Pexels APIキー</p>
                <Tag color="gray">任意・画像挿入</Tag>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              記事内に挿絵（写真）を自動挿入する機能です。設定しなくても記事は生成できます。
            </p>
            <p className="mt-3 text-xs text-indigo-500 font-medium group-hover:underline">
              取得方法を見る →
            </p>
          </a>
        </div>

        {/* ── Section 1: Anthropic ── */}
        <section className="mb-16">
          <SectionAnchor id="anthropic" />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Anthropic APIキーの取得</h2>
              <p className="text-sm text-gray-500">記事生成に必要です（必須）</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Anthropic Consoleにアクセス",
                desc: (
                  <>
                    ブラウザで{" "}
                    <a
                      href="https://console.anthropic.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline font-medium"
                    >
                      console.anthropic.com
                    </a>{" "}
                    を開きます。
                  </>
                ),
                note: null,
              },
              {
                title: "アカウントを作成またはログイン",
                desc: "「Sign Up」から無料アカウントを作成します。すでにアカウントをお持ちの方はそのままログインしてください。",
                note: "メールアドレスとパスワードで登録できます。クレジットカードの登録は後でOKです。",
              },
              {
                title: "「API Keys」ページを開く",
                desc: "ログイン後、左サイドバーの「API Keys」をクリックします。または画面上部のナビゲーションから「Settings → API Keys」を選択してください。",
                note: null,
              },
              {
                title: "新しいAPIキーを作成",
                desc: "「Create Key」ボタンをクリックします。名前（例：note-generator）を入力して「Create Key」を押してください。",
                note: "キー名は何でも構いません。管理しやすい名前をつけましょう。",
              },
              {
                title: "APIキーをコピー",
                desc: "「sk-ant-api03-...」で始まるキーが表示されます。必ずこの画面でコピーしてください。",
                note: "⚠️ このキーは一度しか表示されません。必ずコピーしてメモ帳等に保存してください。",
                isWarning: true,
              },
              {
                title: "ツールに貼り付け",
                desc: "Note記事ジェネレーターのAPIキー入力画面で「Anthropic APIキー」欄にペーストして「質問へ進む」をクリックします。",
                note: null,
              },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4">
                <StepBadge n={i + 1} />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">{step.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  {step.note && (
                    <div className={`mt-2.5 p-2.5 rounded-lg text-xs leading-relaxed ${
                      (step as { isWarning?: boolean }).isWarning
                        ? "bg-amber-50 border border-amber-100 text-amber-700"
                        : "bg-gray-50 border border-gray-100 text-gray-500"
                    }`}>
                      {step.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing info */}
          <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
            <h3 className="font-bold text-indigo-900 mb-2 text-sm">💡 料金について</h3>
            <p className="text-xs text-indigo-700 leading-relaxed mb-2">
              新規登録時に無料クレジットが付与されます（$5分程度）。
              記事1本あたりの生成コストは文字量によりますが、目安は以下の通りです：
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "1,000字", cost: "約 $0.01" },
                { label: "2,000字", cost: "約 $0.02" },
                { label: "3,000字", cost: "約 $0.03" },
                { label: "5,000字", cost: "約 $0.06" },
              ].map((p) => (
                <div key={p.label} className="bg-white rounded-xl px-3 py-2 text-center border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-semibold">{p.label}</p>
                  <p className="text-xs text-gray-500">{p.cost}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 2: Pexels ── */}
        <section className="mb-16">
          <SectionAnchor id="pexels" />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pexels APIキーの取得</h2>
              <p className="text-sm text-gray-500">記事内に画像を自動挿入する機能（任意・完全無料）</p>
            </div>
          </div>

          {/* What is Pexels */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-6">
            <h3 className="font-bold text-green-900 mb-2 text-sm">🖼️ Pexelsとは？</h3>
            <p className="text-xs text-green-800 leading-relaxed">
              Pexelsは商用利用可能な高品質フリー写真を提供するサービスです。
              APIキーを設定すると、生成された記事の各セクションに合った写真が自動で挿入されます。
              完全無料で利用でき、1ヶ月に20,000リクエストまで使えます。
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Pexelsの公式サイトにアクセス",
                desc: (
                  <>
                    ブラウザで{" "}
                    <a
                      href="https://www.pexels.com/ja-jp/api/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline font-medium"
                    >
                      pexels.com/ja-jp/api
                    </a>{" "}
                    を開きます。
                  </>
                ),
                note: null,
              },
              {
                title: "「APIキーを取得」をクリック",
                desc: "ページ中央または右上にある「Your API Key」または「APIキーを取得」ボタンをクリックします。",
                note: null,
              },
              {
                title: "無料アカウントを作成",
                desc: "メールアドレス・氏名・パスワードを入力して登録します。Googleアカウントでのログインも可能です。",
                note: "クレジットカードは不要です。完全無料でアカウント作成できます。",
              },
              {
                title: "アプリ情報を入力",
                desc: "「アプリ名」に任意の名前（例：note-generator）、「アプリの説明」にツールの用途を簡単に入力します。",
                note: "「個人ブログ・note記事生成用のツール」など、数十文字程度でOKです。",
              },
              {
                title: "利用規約に同意してAPIキーを発行",
                desc: "「I agree to the API Terms of Service」にチェックを入れて送信するとAPIキーが発行されます。",
                note: null,
              },
              {
                title: "APIキーをコピー",
                desc: "発行されたAPIキーが表示されます（英数字の文字列）。コピーボタンでクリップボードにコピーしてください。",
                note: "後からダッシュボードで確認することもできます。",
              },
              {
                title: "ツールに貼り付け",
                desc: "Note記事ジェネレーターのAPIキー入力画面で「Pexels APIキー」欄にペーストします。「質問へ進む」をクリックすれば設定完了です。",
                note: null,
              },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4">
                <StepBadge n={i + 1} />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">{step.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  {step.note && (
                    <div className="mt-2.5 p-2.5 rounded-lg text-xs bg-gray-50 border border-gray-100 text-gray-500 leading-relaxed">
                      {step.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pexels limits */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "✅", title: "完全無料", desc: "全機能が無料で使えます" },
              { icon: "📸", title: "月20,000リクエスト", desc: "記事約5,000本分の画像取得が可能" },
              { icon: "🔓", title: "商用利用OK", desc: "記事やビジネス利用も可能" },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">よくある質問</h2>
          <div className="space-y-3">
            {[
              {
                q: "Pexels APIキーなしでも使えますか？",
                a: "はい、Anthropic APIキーのみで記事生成は完全に使えます。Pexels APIキーはあくまでも画像挿入のオプション機能です。",
              },
              {
                q: "APIキーはどこに保存されますか？",
                a: "APIキーはお使いのブラウザのメモリ（JavaScript変数）にのみ保存されます。サーバーには一切保存されず、ページを閉じると消去されます。",
              },
              {
                q: "毎回APIキーを入力する必要がありますか？",
                a: "現在のバージョンでは毎回入力が必要です。ブラウザのパスワードマネージャーに保存しておくと便利です。",
              },
              {
                q: "Anthropic APIの料金はいくらかかりますか？",
                a: "使った分だけ請求される従量課金制です。新規登録時に$5分の無料クレジットが付与されます。記事1本あたりの目安は$0.01〜$0.06程度です。",
              },
              {
                q: "生成した記事の著作権はどうなりますか？",
                a: "生成された文章の著作権はご自身に帰属します。Pexelsの画像はPexelsのライセンス（商用利用可）に従います。",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-2xl border border-gray-200 group"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 text-sm select-none">
                  <span>Q. {faq.q}</span>
                  <svg
                    className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">準備ができたら記事を生成しよう</h2>
          <p className="text-indigo-200 text-sm mb-6">
            APIキーの準備ができたらツールに戻って記事を生成できます
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-white hover:bg-gray-50 text-indigo-600 font-bold rounded-xl transition-all shadow-lg shadow-indigo-800/20"
          >
            ツールに戻る →
          </Link>
        </div>
      </div>
    </div>
  );
}

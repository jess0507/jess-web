import { useStorageFile } from '@/hooks/useStorageFile';

function Home() {
  // 範例:從 Firebase Storage 取一張圖片(請改成你 Storage 內真實存在的路徑)
  const { url, loading, error } = useStorageFile('images/hero.jpg');

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">嗨,我是 Jess 👋</h1>
        <p className="mt-2 text-gray-600">
          這是我的個人網站,使用 Vite + React + TypeScript,後端串接 Firebase。
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Firebase Storage 連線測試</h2>
        {loading && <p className="text-gray-500">載入中…</p>}
        {error && (
          <p className="text-sm text-red-600">
            讀取失敗:{error.message}
            <br />
            (請確認 .env 已填、Storage 已啟用,且 images/hero.jpg 存在)
          </p>
        )}
        {url && (
          <img
            src={url}
            alt="Hero"
            className="max-h-64 w-full rounded-md object-cover"
          />
        )}
      </div>
    </section>
  );
}

export default Home;

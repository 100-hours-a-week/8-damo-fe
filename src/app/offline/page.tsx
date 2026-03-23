export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-4 px-6 text-center">
      <div className="text-5xl">📡</div>
      <h1 className="text-xl font-semibold text-gray-800">인터넷 연결이 없어요</h1>
      <p className="text-sm text-gray-500">
        네트워크 연결을 확인하고 다시 시도해 주세요.
      </p>
    </div>
  )
}

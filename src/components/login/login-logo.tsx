export function LoginLogo(){
    return <div className="flex flex-col items-center gap-10 text-primary sm:gap-16">
      {/* Logo / Title */}
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Damo
      </h1>

      {/* Tagline */}
      <div className="text-center text-xl font-bold leading-relaxed tracking-tight sm:text-2xl">
        <p>인원 · 예산 · 취향</p>
        <p>한 번에 고려해서 바로 추천</p>
      </div>
    </div>
}
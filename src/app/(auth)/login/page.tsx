import { LoginLogo } from "@/src/components/login/login-logo";
import { LoginButton } from "@/src/components/login/login-button";
import { LoginTutorialGate } from "@/src/components/login/login-tutorial-gate";

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

function normalizeRedirectPath(path?: string): string | undefined {
  if (!path) {
    return undefined;
  }

  return path.startsWith("/") ? path : undefined;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = normalizeRedirectPath(params.redirect);

  return (
    <div className="mx-auto flex h-screen w-full max-w-[430px] flex-col items-center justify-center gap-16 bg-white px-6">
      <LoginTutorialGate />
      <LoginLogo />
      <LoginButton className="h-auto w-full max-w-xs gap-2 px-6 py-3" redirectTo={redirectTo} />
    </div>
  );
}

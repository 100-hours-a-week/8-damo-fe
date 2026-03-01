import { KakaoCallbackContent } from "./kakao-callback-content";
import { KakaoCallbackError } from "./kakao-callback-error";

interface KakaoCallbackPageProps {
  searchParams: Promise<{
    code?: string;
    error?: string;
    error_description?: string;
    state?: string;
  }>;
}

export default async function KakaoCallbackPage({
  searchParams,
}: KakaoCallbackPageProps) {
  const params = await searchParams;
  const { code, error, error_description, state } = params;

  if (error) {
    const message = error_description
      ? `${error}: ${error_description}`
      : `오류: ${error}`;
    return <KakaoCallbackError message={message} />;
  }

  if (!code) {
    return <KakaoCallbackError message="인가코드가 전달되지 않았습니다." />;
  }

  return <KakaoCallbackContent code={code} redirectPath={state} />;
}
import { Suspense } from "react";
import { KakaoCallbackContent } from "./kakao-callback-content";
import { KakaoCallbackError } from "./kakao-callback-error";

interface KakaoCallbackPageProps {
  searchParams: {
    code?: string;
    error?: string;
    error_description?: string;
    state?: string;
  };
}

export default async function KakaoCallbackPage({
  searchParams,
}: KakaoCallbackPageProps) {
  const { code, error, error_description, state } = searchParams;

  if (error) {
    const message = error_description
      ? `${error}: ${error_description}`
      : `오류: ${error}`;
    return <KakaoCallbackError message={message} />;
  }

  if (!code) {
    return <KakaoCallbackError message="인가코드가 전달되지 않았습니다." />;
  }

  return (
    <Suspense fallback={<div>로그인 처리 중...</div>}>
      <KakaoCallbackContent code={code} redirectPath={state} />
    </Suspense>
  );
}

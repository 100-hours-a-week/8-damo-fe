import { notFound } from "next/navigation";
import { LoginTestUserIdContent } from "./login-test-user-id-content";

export default function LoginTextUserIdPage() {
  if (process.env.APP_ENV === "prod") {
    notFound();
  }

  return <LoginTestUserIdContent />;
}

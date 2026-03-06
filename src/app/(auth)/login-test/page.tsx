import { notFound } from "next/navigation";
import { LoginTestContent } from "./login-test-content";

export default function LoginTestPage() {
  if (process.env.APP_ENV === "prod") {
    notFound();
  }

  return <LoginTestContent />;
}

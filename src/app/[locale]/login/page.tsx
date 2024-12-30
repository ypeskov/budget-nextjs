import LoginPage from "@/components/login/page";

interface FormData {
  email: string;
  password: string;
}

export default async function LoginServerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return <LoginPage locale={locale} />;
}
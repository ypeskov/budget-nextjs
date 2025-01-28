import LoginPage from "@/components/login/page";

type LoginPageParams = {
  params: Promise<{ locale: string }>
}

export default async function LoginServerPage({ params }: LoginPageParams) {
  const { locale } = await params;

  return <LoginPage locale={locale} />;
}
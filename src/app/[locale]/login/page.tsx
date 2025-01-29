import Login from "@/components/login/Login";

type LoginPageParams = {
  params: Promise<{ locale: string }>
}

export default async function LoginServerPage({ params }: LoginPageParams) {
  const { locale } = await params;

  return <Login locale={locale} />;
}
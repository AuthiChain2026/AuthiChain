import type { Metadata } from 'next';

type Props = { params: Promise<{ truemark_id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { truemark_id } = await params;
  return { title: `AuthiChain - Verify ${truemark_id}`, description: 'Blockchain-verified product authentication' };
}

export default async function VerifyPage({ params }: Props) {
  const { truemark_id } = await params;
  const url = `https://nhdnkzhtadfkkluiulhs.supabase.co/functions/v1/authichain-verify-page/${truemark_id}`;
  return (
    <iframe src={url} style={{ width: '100%', height: '100vh', border: 'none' }} title="AuthiChain Verify" />
  );
}
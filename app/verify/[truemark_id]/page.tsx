import type { Metadata } from 'next';

type Props = { params: { truemark_id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `AuthiChain - Verify ${params.truemark_id}`, description: 'Blockchain-verified product authentication' };
}

export default function VerifyPage({ params }: Props) {
  const url = `https://nhdnkzhtadfkkluiulhs.supabase.co/functions/v1/authichain-verify-page/${params.truemark_id}`;
  return (
    <iframe src={url} style={{ width: '100%', height: '100vh', border: 'none' }} title="AuthiChain Verify" />
  );
}
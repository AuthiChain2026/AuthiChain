import { Metadata } from 'next';
export const metadata: Metadata = { title: 'AuthiChain EU DPP Compliance v2', description: 'AuthiChain EU Digital Product Passport compliance v2 - Battery, Textile, Construction Product Regulation' };
export default function EUDPPPageV2() {
  return (
    <div>
      <h1>EU DPP Compliance v2</h1>
      <p>AuthiChain powers EU Digital Product Passport compliance for</p>
      <ul>
        <li>Battery Regulation (EC 2023/1542)</li>
        <li>Textile and Fashion Regulation</li>
        <li>Construction Product Regulation</li>
        <li>Luxury Goods (Hermès, LVMH, Rolex)</li>
      </ul>
    </div>
  );
}
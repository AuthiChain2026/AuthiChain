/**
 * Bag ie.z Genesis Collection — NFT Gallery Page
 * 
 * Renders the full Bag ie.z / Voyage Bloom × Myles High collection.
 * SVG artwork is served from /public/nfts/ directory.
 * 
 * All pieces are marked INSPIRATIONAL & PRICELESS — not for sale.
 * These are the founding artifacts of the Authentic Economy.
 * 
 * Integration: Add to app/nfts/page.tsx or pages/nfts.tsx
 */

import Image from "next/image";

const GENESIS_COLLECTION = [
  {
    id: "MH-001",
    name: "Myles High #001",
    src: "/nfts/myles-high-001.svg",
    quote: "PREZZURE MAKES DIAMONDS",
    attributes: "Skittles and Gas | Origin: Fiya Farmer",
    series: "Voyage Bloom × Myles High",
    desc: "The genesis piece. A hot air balloon voyager soaring through cannabis culture — goggles on, diamond below, pressure forging authenticity.",
  },
  {
    id: "BLING-001",
    name: "Bling Blaow",
    src: "/nfts/blueberry-diesel-diamond.svg",
    quote: "PUFF, PUFF, FACET",
    attributes: "Diesel · Blueberries · Candy",
    series: "Voyage Bloom × Myles High",
    desc: "Blueberry Diesel Diamond — a crystalline character born from compound genetics. Where ice meets earth meets fire.",
  },
  {
    id: "JARED-001",
    name: "Jared #001",
    src: "/nfts/jared.svg",
    quote: "ROLL WITH THE BEST — YOU CAN'T SQUASH THIS VIBE.",
    attributes: "Grape Jello, Kiwi, and Tires",
    series: "Voyage Bloom × Myles High",
    desc: "Jared — the jelly jar character. Grape and kiwi trapped in glass, animated and alive. From Humboldt Seed Company.",
  },
  {
    id: "WZ-001",
    name: "Watermelon Zmartini",
    src: "/nfts/watermelon-zmartini.svg",
    quote: "IN THE END, WE'RE ALL JUST LOOKING FOR A SPARK.",
    attributes: "Smarties, Sour Patch, Watermelon, Irish Spring",
    series: "Voyage Bloom × Dr. Dankenstein",
    desc: "Watermelon Mimosa × Zoap. A cocktail of genetics served with cartoon characters and lab-grade precision.",
  },
  {
    id: "CC-042",
    name: "Cosmic Cookie #042",
    src: "/nfts/qron-space-cosmic.svg",
    quote: "BEYOND THE ATMOSPHERE",
    attributes: "UFO Beam · Cookies · Mint",
    series: "QRON Space Collection",
    desc: "Where the Authentic Economy meets the cosmos. A UFO beaming cookies through starfields — the intersection of cannabis culture and blockchain space.",
  },
  {
    id: "BAG-EZ",
    name: "Bag Ez — Collection Logo",
    src: "/nfts/bag-ez-logo.svg",
    quote: "SECURE THE BAG",
    attributes: "Genesis Identity",
    series: "Bag ie.z Brand",
    desc: "The origin logo. A golden money bag character with blue shades — the mascot that started it all. The face of the Authentic Economy's NFT layer.",
  },
];

export default function NFTGalleryPage() {
  return (
    <main className="min-h-screen bg-[#050508]">
      {/* Hero */}
      <section className="text-center py-16 px-4">
        <h1 className="font-bold text-4xl md:text-5xl bg-gradient-to-r from-[#D4A017] via-[#FFD700] to-[#D4A017] bg-clip-text text-transparent">
          The Genesis Collection
        </h1>
        <p className="text-[#555] text-sm mt-3 max-w-xl mx-auto">
          Bag ie.z · Voyage Bloom × Myles High · QRON Space
        </p>
        <p className="text-[#D4A017] text-xs mt-2 tracking-[0.2em] uppercase font-semibold">
          Inspirational & Priceless — Not for Sale
        </p>
        <p className="text-[#333] text-xs mt-6 italic max-w-lg mx-auto leading-relaxed">
          "These pieces represent the origin of the Authentic Economy.
          They are not commodities. They are statements of vision."
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GENESIS_COLLECTION.map((nft) => (
            <article
              key={nft.id}
              className="group relative bg-white/[0.015] border border-white/[0.05] rounded-2xl overflow-hidden hover:border-[#D4A017]/30 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Artwork */}
              <div className="aspect-square relative overflow-hidden bg-black/20">
                <Image
                  src={nft.src}
                  alt={nft.name}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
                {/* Priceless Badge */}
                <div className="absolute top-3 right-3 bg-[#D4A017]/90 text-black text-[9px] font-extrabold tracking-[1.5px] px-3 py-1 rounded">
                  PRICELESS
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#D4A017] font-mono font-semibold">{nft.id}</span>
                  <span className="text-[9px] text-[#555] tracking-wider uppercase">{nft.series}</span>
                </div>
                <h2 className="text-lg font-bold text-white/90">{nft.name}</h2>
                <p className="text-xs text-[#666] mt-2 leading-relaxed italic">"{nft.desc}"</p>
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <p className="text-[10px] text-[#444] mb-1">ATTRIBUTES</p>
                  <p className="text-xs text-[#888]">{nft.attributes}</p>
                </div>
                <p className="text-[10px] text-[#333] mt-3 italic">"{nft.quote}"</p>
              </div>

              {/* Blockchain badge */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 text-[9px] text-[#444]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8247e5]" />
                  Polygon · ERC-721 · Verified on AuthiChain
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Closing Statement */}
      <section className="text-center py-12 border-t border-white/[0.03]">
        <p className="text-xs text-[#333] italic max-w-md mx-auto leading-relaxed">
          The value of these pieces is not measured in currency. They represent the
          founding moment of a protocol that will authenticate billions of products
          across the global supply chain.
        </p>
        <div className="flex justify-center gap-8 mt-6 text-[10px] text-[#444]">
          <span>Contract: 0x4da4...72BE</span>
          <span>Chain: Polygon</span>
          <span>$QRON: 0xAebf...E437</span>
        </div>
      </section>
    </main>
  );
}

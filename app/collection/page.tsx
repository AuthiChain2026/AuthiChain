import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "StrainChain Cannabis NFT Collection — Authenticated Cannabis Art",
  description: "StrainChain cannabis NFT collection. Five blockchain-authenticated cannabis art pieces — each seed-to-sale verified on Polygon and anchored to Bitcoin via Ordinal.",
  alternates: { canonical: "https://authichain.com/collection" },
};

type NFT = {
  id: string;
  name: string;
  sub: string;
  origin: string;
  attrs: string;
  slogan: string;
  rarity: "LEGENDARY" | "EPIC" | "RARE";
  score: number;
  floor: number;
  svg: string;
  stripe: string;
  justify: string;
};

const NFTS: NFT[] = [
  {
    id: "nft-design",
    name: "COSMIC COOKIE",
    sub: "Collector #042",
    origin: "Exotic Genetix",
    attrs: "Cookies · Mint · Chocolate",
    slogan: "Out of this world.",
    rarity: "LEGENDARY",
    score: 94,
    floor: 1200,
    svg: "/nft/nft-design.svg",
    stripe: "https://buy.stripe.com/14A4gzfzPf7MfWO8rq1Nu1u",
    justify:
      "LEGENDARY rarity. 1 of 1 in the StrainChain series. Exotic Genetix is one of the most sought-after cannabis genetics houses. Animated star field + UFO beam — the most technically sophisticated piece in the collection. ArtGuard 94/100.",
  },
  {
    id: "jared-nft",
    name: "JARED",
    sub: "#001 of Series",
    origin: "Humboldt Seed Company",
    attrs: "Grape Jello · Kiwi · Tires",
    slogan: "Roll with the best — you can't squash this vibe.",
    rarity: "EPIC",
    score: 91,
    floor: 840,
    svg: "/nft/jared-nft.svg",
    stripe: "https://buy.stripe.com/8x2bJ173j7FkfWOazy1Nu1v",
    justify:
      "EPIC rarity. Fully animated — blinking eyes, breathing jello, and floating inclusions. Humboldt Seed Company provenance commands a premium. First edition #001.",
  },
  {
    id: "diamond-nft",
    name: "BLING BLAOW",
    sub: "Diamond Edition",
    origin: "Compound Genetics",
    attrs: "Diesel · Blueberries · Candy",
    slogan: "Puff, puff, facet.",
    rarity: "EPIC",
    score: 89,
    floor: 720,
    svg: "/nft/diamond-nft.svg",
    stripe: "https://buy.stripe.com/28E28rdrHcZEeSK9vu1Nu1w",
    justify:
      "EPIC rarity. Compound Genetics is a top-tier genetics house. Diamond character concept is culturally resonant with collectors. Premium navy-on-blue aesthetic is the most refined dark composition in the collection.",
  },
  {
    id: "watermelon-zmartini",
    name: "WATERMELON ZMARTINI",
    sub: "#000665",
    origin: "Dr. Dankenstein",
    attrs: "Smarties · Sour Patch Watermelon · Irish Spring",
    slogan: "In the end, we're all just looking for a spark.",
    rarity: "RARE",
    score: 87,
    floor: 580,
    svg: "/nft/watermelon-zmartini.svg",
    stripe: "https://buy.stripe.com/00w5kDevL6Bgh0SdLK1Nu1x",
    justify:
      "RARE. A Dr. Dankenstein × StrainChain collab — a named artist collaboration adds collectability. Dual-character composition (watermelon + flask) is the most narrative piece. Low edition number #000665 signals early-series rarity.",
  },
  {
    id: "myles-high-nft",
    name: "MYLES HIGH",
    sub: "#001",
    origin: "Fiya Farmer",
    attrs: "Skittles · Gas",
    slogan: "Prezzure makes diamonds.",
    rarity: "RARE",
    score: 85,
    floor: 480,
    svg: "/nft/myles-high-nft.svg",
    stripe: "https://buy.stripe.com/dRmcN53R7e3I4e67nm1Nu1y",
    justify:
      "RARE. Hot air balloon aviator with animated sparkle diamond — a visually distinct silhouette unlike anything else in the collection. Fiya Farmer origin. Great entry point for new collectors. Strong floor appreciation potential.",
  },
];

const rarityColors: Record<NFT["rarity"], string> = {
  LEGENDARY: "#FFD700",
  EPIC: "#a78bfa",
  RARE: "#22c55e",
};

export default function CollectionPage() {
  const totalFloor = NFTS.reduce((sum, n) => sum + n.floor, 0);
  const avgScore = Math.round(NFTS.reduce((sum, n) => sum + n.score, 0) / NFTS.length);

  return (
    <main
      style={{
        background: "#080808",
        color: "#e5e5e5",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "48px 24px 36px",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,.07)",
          position: "relative",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 220,
            background:
              "radial-gradient(ellipse, rgba(34,197,94,.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: ".18em",
            color: "rgba(255,255,255,.28)",
            marginBottom: 10,
          }}
        >
          🌿 StrainChain · Cannabis NFT Collection
        </div>
        <h1
          style={{
            fontSize: "clamp(24px, 6vw, 52px)",
            fontWeight: 900,
            color: "#22c55e",
            letterSpacing: ".06em",
            textShadow: "0 0 50px rgba(34,197,94,.25)",
            marginBottom: 6,
          }}
        >
          CANNABIS NFT ART
        </h1>
        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,.38)",
            marginBottom: 28,
          }}
        >
          5 personal pieces · StrainChain verified · Polygon mainnet · BTC Ordinal anchored
        </div>
        <div
          style={{
            display: "flex",
            gap: 32,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { v: NFTS.length.toString(), l: "Unique Pieces" },
            { v: `$${totalFloor.toLocaleString()}`, l: "Total Floor" },
            { v: `${avgScore}/100`, l: "Avg ArtGuard" },
            { v: "1 of 1", l: "Each Edition" },
          ].map((s) => (
            <div key={s.l}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e" }}>{s.v}</div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,.3)",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  marginTop: 3,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 22,
          padding: 28,
          maxWidth: 1380,
          margin: "0 auto",
        }}
      >
        {NFTS.map((nft) => {
          const color = rarityColors[nft.rarity];
          return (
            <article
              key={nft.id}
              style={{
                background: "#0d0d0d",
                border: `1px solid ${color}20`,
                borderRadius: 18,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Art */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  background: "#000",
                }}
              >
                <Image
                  src={nft.svg}
                  alt={`${nft.name} — ${nft.sub} · StrainChain cannabis NFT`}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
                <div
                  style={{
                    position: "absolute",
                    top: 11,
                    left: 11,
                    border: `1px solid ${color}40`,
                    color,
                    background: `${color}14`,
                    fontSize: 8.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".1em",
                    padding: "3px 10px",
                    borderRadius: 4,
                  }}
                >
                  {nft.rarity}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 11,
                    right: 11,
                    background: "rgba(0,0,0,.72)",
                    color: "#ec4899",
                    fontSize: 8.5,
                    fontWeight: 700,
                    letterSpacing: ".06em",
                    padding: "3px 9px",
                    borderRadius: 4,
                    border: "1px solid rgba(236,72,153,.3)",
                  }}
                >
                  ArtGuard {nft.score}/100
                </div>
              </div>

              {/* Info */}
              <div
                style={{
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#e5e5e5",
                    letterSpacing: ".04em",
                  }}
                >
                  {nft.name}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 10,
                    color: "rgba(255,255,255,.32)",
                  }}
                >
                  {nft.sub}
                </div>
                <div style={{ fontSize: 10.5, color, fontWeight: 600 }}>{nft.origin}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.38)" }}>{nft.attrs}</div>
                <div
                  style={{
                    fontSize: 10,
                    fontStyle: "italic",
                    color: "rgba(255,255,255,.28)",
                    lineHeight: 1.55,
                  }}
                >
                  &quot;{nft.slogan}&quot;
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,.42)",
                    lineHeight: 1.65,
                    padding: "8px 10px",
                    background: "rgba(255,255,255,.03)",
                    borderRadius: 7,
                    borderLeft: `2px solid ${color}`,
                    marginTop: 4,
                  }}
                >
                  {nft.justify}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "rgba(255,255,255,.3)",
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                      }}
                    >
                      Floor Price
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#22c55e" }}>
                      ${nft.floor.toLocaleString()}
                    </div>
                  </div>
                  <a
                    href={nft.stripe}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      background: "#22c55e",
                      color: "#000",
                      fontWeight: 800,
                      fontSize: 12,
                      padding: "10px 18px",
                      borderRadius: 10,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      letterSpacing: ".02em",
                    }}
                  >
                    Buy Now — ${nft.floor.toLocaleString()}
                  </a>
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(34,197,94,.5)",
                    fontWeight: 600,
                    paddingTop: 4,
                  }}
                >
                  🌿 StrainChain Verified · Polygon Mainnet · BTC Ordinal Anchored
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "24px",
          color: "rgba(255,255,255,.3)",
          fontSize: 11,
          borderTop: "1px solid rgba(255,255,255,.07)",
        }}
      >
        All pieces deliver: original SVG file · Polygon ERC-721 certificate · BTC Ordinal
        inscription · StrainChain TRUmark · StoryMode origin narrative
        <br />
        <a href="https://strainchain.io" style={{ color: "rgba(34,197,94,.6)", textDecoration: "none" }}>
          strainchain.io
        </a>{" "}
        ·{" "}
        <a href="https://authichain.com" style={{ color: "rgba(34,197,94,.6)", textDecoration: "none" }}>
          authichain.com
        </a>{" "}
        · Powered by Stripe
      </footer>
    </main>
  );
}

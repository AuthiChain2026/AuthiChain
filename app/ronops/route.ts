import { NextResponse } from 'next/server'

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>AuthiChain Federal — Blockchain Supply Chain Authentication for Government</title>
<meta name="description" content="AuthiChain Federal delivers blockchain-verified product authentication for DoD, DHS, FDA, DLA, and VA procurement officers. Counterfeit prevention, Buy American compliance, FASCSA screening, and NIST-aligned traceability — all in one platform."/>
<meta name="keywords" content="procurement officer, supply chain authentication, counterfeit prevention, Buy American, DHS supply chain, DoD authentication, FDA traceability, FASCSA compliance, DLA procurement, NIST supply chain, VA RCM, federal blockchain, government procurement, anti-counterfeiting"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet"/>
<style>
  :root {
    --navy: #060d1f;
    --navy-mid: #0c1a35;
    --navy-light: #122040;
    --gold: #c9a84c;
    --gold-bright: #e8c76a;
    --gold-dim: #6b551a;
    --slate: #8fa3c0;
    --slate-light: #b8cce0;
    --white: #f0eee8;
    --red: #b03a2e;
    --green: #2ecc71;
    --border: rgba(201,168,76,0.2);
    --border-strong: rgba(201,168,76,0.5);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--navy);
    color: var(--white);
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 300;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* SCANLINE TEXTURE */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.03) 2px,
      rgba(0,0,0,0.03) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  /* GRID OVERLAY */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 9998;
  }

  /* ───────── NAV ───────── */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    height: 64px;
    background: rgba(6,13,31,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }

  .nav-seal {
    width: 36px;
    height: 36px;
    border: 2px solid var(--gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--gold);
    letter-spacing: 0.05em;
    animation: sealPulse 4s ease-in-out infinite;
  }

  @keyframes sealPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.3); }
    50% { box-shadow: 0 0 0 6px rgba(201,168,76,0); }
  }

  .nav-wordmark {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--white);
    letter-spacing: 0.05em;
  }

  .nav-wordmark span { color: var(--gold); }

  .nav-badge {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--gold);
    text-transform: uppercase;
    border: 1px solid var(--gold-dim);
    padding: 2px 8px;
    border-radius: 2px;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
    list-style: none;
  }

  .nav-links a {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--slate);
    text-decoration: none;
    transition: color 0.2s;
  }

  .nav-links a:hover { color: var(--gold); }

  .nav-cta {
    background: var(--gold);
    color: var(--navy) !important;
    padding: 8px 20px;
    font-weight: 500 !important;
    border-radius: 2px;
  }

  /* ───────── HERO ───────── */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    padding: 120px 80px 80px;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 70% 50%, rgba(201,168,76,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 10% 80%, rgba(12,26,53,0.8) 0%, transparent 60%);
  }

  /* Classified stamp */
  .classified-stamp {
    position: absolute;
    top: 140px;
    right: 80px;
    font-family: 'Libre Baskerville', serif;
    font-size: 48px;
    font-weight: 700;
    color: transparent;
    -webkit-text-stroke: 3px rgba(176,58,46,0.4);
    letter-spacing: 0.1em;
    transform: rotate(-12deg);
    user-select: none;
    animation: stampIn 1.5s cubic-bezier(0.22,1,0.36,1) forwards;
    opacity: 0;
  }

  @keyframes stampIn {
    from { transform: rotate(-12deg) scale(2); opacity: 0; }
    to { transform: rotate(-12deg) scale(1); opacity: 1; }
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 760px;
  }

  .hero-eyebrow {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
    animation: slideUp 0.8s cubic-bezier(0.22,1,0.36,1) both;
  }

  .eyebrow-line {
    width: 40px;
    height: 1px;
    background: var(--gold);
  }

  .eyebrow-text {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
  }

  .classification-bar {
    display: inline-block;
    background: var(--gold-dim);
    border: 1px solid var(--gold);
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold-bright);
    padding: 3px 12px;
    border-radius: 1px;
  }

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(40px, 5.5vw, 72px);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.01em;
    color: var(--white);
    margin-bottom: 28px;
    animation: slideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }

  .hero h1 .highlight {
    color: var(--gold);
    position: relative;
  }

  .hero h1 .highlight::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), transparent);
    opacity: 0.4;
  }

  .hero-sub {
    font-size: 18px;
    color: var(--slate-light);
    max-width: 600px;
    margin-bottom: 48px;
    line-height: 1.7;
    animation: slideUp 1s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  }

  .hero-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    animation: slideUp 1s cubic-bezier(0.22,1,0.36,1) 0.3s both;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--gold);
    color: var(--navy);
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 16px 32px;
    border-radius: 2px;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: white;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    opacity: 0.2;
  }

  .btn-primary:hover::before { transform: translateX(0); }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,168,76,0.3); }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    color: var(--gold);
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 16px 32px;
    border: 1px solid var(--border-strong);
    border-radius: 2px;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: rgba(201,168,76,0.08);
    border-color: var(--gold);
  }

  /* ───────── AGENCY STRIP ───────── */
  .agency-strip {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: rgba(12,26,53,0.6);
    padding: 24px 80px;
    display: flex;
    align-items: center;
    gap: 48px;
    overflow: hidden;
    position: relative;
  }

  .agency-strip-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold-dim);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .agency-list {
    display: flex;
    gap: 40px;
    align-items: center;
    flex-wrap: wrap;
  }

  .agency-tag {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.2em;
    color: var(--slate);
    text-transform: uppercase;
    white-space: nowrap;
    position: relative;
    padding-left: 14px;
  }

  .agency-tag::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--gold-dim);
    font-size: 8px;
  }

  /* ───────── SECTION BASICS ───────── */
  section { padding: 100px 80px; position: relative; }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .section-label::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1px;
    background: var(--gold);
  }

  h2.section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 4vw, 54px);
    font-weight: 700;
    line-height: 1.1;
    color: var(--white);
    margin-bottom: 20px;
  }

  h2.section-title em {
    color: var(--gold);
    font-style: normal;
  }

  .section-sub {
    font-size: 17px;
    color: var(--slate);
    max-width: 560px;
    line-height: 1.7;
    margin-bottom: 60px;
  }

  /* ───────── THREAT STATS ───────── */
  .threat-section {
    background: var(--navy-mid);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .threat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    margin-top: 60px;
  }

  .threat-stat {
    background: var(--navy-mid);
    padding: 40px 32px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .threat-stat::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .threat-stat:hover::before { opacity: 1; }

  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 52px;
    font-weight: 900;
    color: var(--gold);
    line-height: 1;
    margin-bottom: 8px;
  }

  .stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--slate);
    margin-bottom: 12px;
  }

  .stat-sub {
    font-size: 13px;
    color: var(--slate);
    line-height: 1.5;
  }

  /* ───────── COMPLIANCE MATRIX ───────── */
  .compliance-section { background: var(--navy); }

  .compliance-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin-top: 60px;
  }

  .compliance-card {
    background: var(--navy-mid);
    border: 1px solid var(--border);
    padding: 40px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.2s;
    cursor: default;
  }

  .compliance-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.06) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .compliance-card:hover {
    border-color: var(--border-strong);
    transform: translateY(-2px);
  }

  .compliance-card:hover::after { opacity: 1; }

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border: 1px solid var(--border-strong);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .card-status {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
  }

  .status-live {
    background: rgba(46,204,113,0.15);
    color: var(--green);
    border: 1px solid rgba(46,204,113,0.3);
  }

  .status-ready {
    background: rgba(201,168,76,0.15);
    color: var(--gold);
    border: 1px solid rgba(201,168,76,0.3);
  }

  .card-tag {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 14px;
    line-height: 1.2;
  }

  .card-body {
    font-size: 15px;
    color: var(--slate);
    line-height: 1.7;
    margin-bottom: 24px;
  }

  .card-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .card-features li {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--slate-light);
    padding-left: 18px;
    position: relative;
  }

  .card-features li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--gold);
  }

  /* ───────── HOW IT WORKS ───────── */
  .how-section {
    background: var(--navy-light);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0;
    margin-top: 60px;
    position: relative;
  }

  .steps::before {
    content: '';
    position: absolute;
    top: 32px;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-dim), var(--gold), var(--gold-dim), transparent);
  }

  .step {
    text-align: center;
    padding: 0 20px;
    position: relative;
  }

  .step-num {
    width: 64px;
    height: 64px;
    border: 2px solid var(--gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--gold);
    background: var(--navy-light);
    margin: 0 auto 28px;
    position: relative;
    z-index: 1;
    transition: all 0.3s;
  }

  .step:hover .step-num {
    background: var(--gold);
    color: var(--navy);
    box-shadow: 0 0 24px rgba(201,168,76,0.4);
  }

  .step-title {
    font-family: 'Libre Baskerville', serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 10px;
    line-height: 1.3;
  }

  .step-body {
    font-size: 13px;
    color: var(--slate);
    line-height: 1.6;
  }

  /* ───────── REGULATORY TABLE ───────── */
  .reg-section { background: var(--navy); }

  .reg-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 60px;
    font-family: 'DM Mono', monospace;
  }

  .reg-table thead tr {
    background: var(--navy-mid);
    border-bottom: 2px solid var(--gold-dim);
  }

  .reg-table th {
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    padding: 16px 24px;
    text-align: left;
    font-weight: 500;
  }

  .reg-table td {
    font-size: 13px;
    color: var(--slate-light);
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
    line-height: 1.5;
  }

  .reg-table tr:hover td {
    background: rgba(201,168,76,0.03);
    color: var(--white);
  }

  .reg-table .reg-id {
    color: var(--gold);
    font-weight: 500;
    white-space: nowrap;
  }

  .badge {
    display: inline-block;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 2px;
    margin-right: 4px;
    margin-bottom: 2px;
  }

  .badge-covered {
    background: rgba(46,204,113,0.15);
    color: #2ecc71;
    border: 1px solid rgba(46,204,113,0.25);
  }

  .badge-partial {
    background: rgba(201,168,76,0.15);
    color: var(--gold);
    border: 1px solid rgba(201,168,76,0.25);
  }

  /* ───────── TESTIMONIALS / PILOTS ───────── */
  .pilot-section {
    background: var(--navy-mid);
    border-top: 1px solid var(--border);
  }

  .pilot-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 24px;
    margin-top: 60px;
  }

  .pilot-card {
    background: var(--navy);
    border: 1px solid var(--border);
    padding: 32px;
    position: relative;
  }

  .pilot-card::before {
    content: '"';
    font-family: 'Playfair Display', serif;
    font-size: 80px;
    color: var(--gold-dim);
    line-height: 1;
    position: absolute;
    top: 16px;
    left: 24px;
    opacity: 0.5;
  }

  .pilot-quote {
    font-family: 'Libre Baskerville', serif;
    font-size: 15px;
    line-height: 1.7;
    color: var(--slate-light);
    margin-bottom: 24px;
    padding-top: 32px;
  }

  .pilot-attr {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .pilot-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--navy-mid);
    border: 1px solid var(--border-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--gold);
    font-weight: 500;
  }

  .pilot-name {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--white);
    letter-spacing: 0.05em;
    margin-bottom: 2px;
  }

  .pilot-role {
    font-size: 12px;
    color: var(--slate);
  }

  /* ───────── CTA ───────── */
  .cta-section {
    background: var(--navy-light);
    border-top: 1px solid var(--border);
    text-align: center;
    padding: 120px 80px;
    position: relative;
    overflow: hidden;
  }

  .cta-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%);
  }

  .cta-section h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 900;
    color: var(--white);
    line-height: 1.1;
    margin-bottom: 24px;
    position: relative;
  }

  .cta-section p {
    font-size: 18px;
    color: var(--slate);
    max-width: 520px;
    margin: 0 auto 48px;
    line-height: 1.7;
    position: relative;
  }

  .cta-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    position: relative;
  }

  .cta-note {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--gold-dim);
    text-transform: uppercase;
    margin-top: 24px;
    position: relative;
  }

  /* ───────── FOOTER ───────── */
  footer {
    background: var(--navy);
    border-top: 1px solid var(--border);
    padding: 60px 80px 40px;
  }

  .footer-top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 48px;
    padding-bottom: 48px;
    border-bottom: 1px solid var(--border);
  }

  .footer-brand p {
    font-size: 14px;
    color: var(--slate);
    line-height: 1.7;
    margin: 16px 0 24px;
    max-width: 280px;
  }

  .footer-heading {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }

  .footer-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-links a {
    font-size: 14px;
    color: var(--slate);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-links a:hover { color: var(--gold); }

  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .footer-legal {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--gold-dim);
  }

  .footer-certifications {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .cert-badge {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--slate);
    border: 1px solid var(--border);
    padding: 4px 10px;
    border-radius: 2px;
  }

  /* ───────── REDACTED TEXT EFFECT ───────── */
  .redacted {
    background: var(--slate);
    color: transparent;
    border-radius: 2px;
    user-select: none;
    cursor: not-allowed;
    transition: all 0.3s;
  }

  .redacted:hover {
    background: transparent;
    color: var(--gold);
  }

  /* ───────── COUNTER ANIMATION ───────── */
  @keyframes countUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .threat-stat { animation: countUp 0.6s ease both; }
  .threat-stat:nth-child(1) { animation-delay: 0.1s; }
  .threat-stat:nth-child(2) { animation-delay: 0.2s; }
  .threat-stat:nth-child(3) { animation-delay: 0.3s; }
  .threat-stat:nth-child(4) { animation-delay: 0.4s; }

  /* ───────── LIVE TICKER ───────── */
  .ticker-wrap {
    background: var(--gold);
    padding: 10px 0;
    overflow: hidden;
    position: relative;
  }

  .ticker {
    display: flex;
    animation: ticker 40s linear infinite;
    white-space: nowrap;
  }

  .ticker-item {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--navy);
    padding: 0 40px;
    flex-shrink: 0;
  }

  .ticker-item::after {
    content: '◆';
    margin-left: 40px;
    opacity: 0.4;
  }

  @keyframes ticker {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* ───────── RESPONSIVE ───────── */
  @media (max-width: 1024px) {
    nav { padding: 0 24px; }
    .nav-links { display: none; }
    section { padding: 80px 32px; }
    .hero { padding: 120px 32px 80px; }
    .threat-grid { grid-template-columns: repeat(2, 1fr); }
    .compliance-grid { grid-template-columns: 1fr; }
    .steps { grid-template-columns: 1fr; }
    .steps::before { display: none; }
    .step { text-align: left; display: flex; align-items: flex-start; gap: 24px; padding-bottom: 32px; }
    .step-num { flex-shrink: 0; margin: 0; }
    .pilot-grid { grid-template-columns: 1fr; }
    .footer-top { grid-template-columns: 1fr 1fr; }
    .agency-strip { padding: 24px 32px; }
    .cta-section { padding: 80px 32px; }
    footer { padding: 60px 32px 40px; }
    .classified-stamp { display: none; }
    .reg-table { font-size: 11px; }
    .reg-table th, .reg-table td { padding: 12px 14px; }
  }
</style>
</head>
<body>

<!-- ─── NAV ─── -->
<nav>
  <a href="#" class="nav-logo">
    <div class="nav-seal">⬡</div>
    <div>
      <div class="nav-wordmark">AuthiChain <span>Federal</span></div>
    </div>
    <div class="nav-badge">Unclassified // FOUO</div>
  </a>
  <ul class="nav-links">
    <li><a href="#compliance">Compliance</a></li>
    <li><a href="#how">How It Works</a></li>
    <li><a href="#regulations">Regulations</a></li>
    <li><a href="#pilots">Pilots</a></li>
    <li><a href="https://authichain.com" target="_blank">Main Platform</a></li>
    <li><a href="#cta" class="nav-cta">Request Briefing</a></li>
  </ul>
</nav>

<!-- ─── TICKER ─── -->
<div class="ticker-wrap" style="margin-top:64px;">
  <div class="ticker">
    <span class="ticker-item">Buy American Act Compliance</span>
    <span class="ticker-item">FASCSA Section 889 Screening</span>
    <span class="ticker-item">DoD Supply Chain Risk Management</span>
    <span class="ticker-item">FDA DSCSA Traceability</span>
    <span class="ticker-item">DLA Counterfeit Part Prevention</span>
    <span class="ticker-item">NIST SP 800-161 Rev. 1</span>
    <span class="ticker-item">VA Reverse Chain Management</span>
    <span class="ticker-item">DHS SVIP Qualified</span>
    <span class="ticker-item">Buy American Act Compliance</span>
    <span class="ticker-item">FASCSA Section 889 Screening</span>
    <span class="ticker-item">DoD Supply Chain Risk Management</span>
    <span class="ticker-item">FDA DSCSA Traceability</span>
    <span class="ticker-item">DLA Counterfeit Part Prevention</span>
    <span class="ticker-item">NIST SP 800-161 Rev. 1</span>
    <span class="ticker-item">VA Reverse Chain Management</span>
    <span class="ticker-item">DHS SVIP Qualified</span>
  </div>
</div>

<!-- ─── HERO ─── -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="classified-stamp">AUTHENTICATED</div>

  <div class="hero-content">
    <div class="hero-eyebrow">
      <div class="eyebrow-line"></div>
      <div class="eyebrow-text">Authentic Economy · Federal Division</div>
      <div class="classification-bar">Counterfeit-Proof Supply Chain</div>
    </div>

    <h1>
      Every Part.<br/>
      Every Source.<br/>
      <span class="highlight">Verified on Chain.</span>
    </h1>

    <p class="hero-sub">
      AuthiChain Federal delivers blockchain-anchored product authentication for DoD, DHS, DLA, FDA, and VA procurement officers. Stop counterfeit infiltration before it compromises mission readiness, patient safety, or taxpayer trust.
    </p>

    <div class="hero-actions">
      <a href="#cta" class="btn-primary">
        <span>⬡</span> Request Agency Briefing
      </a>
      <a href="https://authichain.com/demo" target="_blank" class="btn-secondary">
        View Live Demo →
      </a>
    </div>
  </div>
</section>

<!-- ─── AGENCY STRIP ─── -->
<div class="agency-strip">
  <div class="agency-strip-label">Target Agencies</div>
  <div class="agency-list">
    <span class="agency-tag">DoD / OUSD(A&S)</span>
    <span class="agency-tag">DHS / CISA</span>
    <span class="agency-tag">DLA</span>
    <span class="agency-tag">FDA / CDER</span>
    <span class="agency-tag">VA / VHA</span>
    <span class="agency-tag">CBP</span>
    <span class="agency-tag">ITAR-Controlled Supply Chains</span>
    <span class="agency-tag">APEX Accelerators</span>
  </div>
</div>

<!-- ─── THREAT STATS ─── -->
<section class="threat-section">
  <div class="section-label">The Threat Landscape</div>
  <h2 class="section-title">Counterfeits Are a <em>National Security Crisis</em></h2>
  <p class="section-sub">Federal procurement officers are on the front line. The data is unambiguous.</p>

  <div class="threat-grid">
    <div class="threat-stat">
      <div class="stat-num">$500B</div>
      <div class="stat-label">Annual Impact</div>
      <div class="stat-sub">Global counterfeit goods cost the U.S. economy annually, with defense and pharma hardest hit.</div>
    </div>
    <div class="threat-stat">
      <div class="stat-num">1 in 4</div>
      <div class="stat-label">DoD Electronic Parts</div>
      <div class="stat-sub">Counterfeit or suspect electronic parts detected in DoD supply chains per GAO reporting.</div>
    </div>
    <div class="threat-stat">
      <div class="stat-num">96%</div>
      <div class="stat-label">Origin Unverifiable</div>
      <div class="stat-sub">Of pharmaceutical products entering government channels have no cryptographic provenance trail.</div>
    </div>
    <div class="threat-stat">
      <div class="stat-num">$0</div>
      <div class="stat-label">AuthiChain Fraud Rate</div>
      <div class="stat-sub">Blockchain-certified products cannot be counterfeited. The math is provable, not promised.</div>
    </div>
  </div>
</section>

<!-- ─── COMPLIANCE MATRIX ─── -->
<section class="compliance-section" id="compliance">
  <div class="section-label">Compliance Coverage</div>
  <h2 class="section-title">Built for <em>Federal Requirements</em></h2>
  <p class="section-sub">Every module maps directly to a regulatory mandate. No interpretation required by your legal team.</p>

  <div class="compliance-grid">
    <div class="compliance-card">
      <div class="card-header">
        <div class="card-icon">🛡️</div>
        <div class="card-status status-live">Live</div>
      </div>
      <div class="card-tag">DoD · FASCSA · Section 889</div>
      <div class="card-title">Defense Supply Chain Authentication</div>
      <p class="card-body">
        Cryptographic part-level authentication aligned with DoD's SCRM policy and FASCSA prohibited technology screening. Every serialized component carries an immutable blockchain certificate traceable to origin.
      </p>
      <ul class="card-features">
        <li>Section 889 banned technology flag & audit trail</li>
        <li>FASCSA entity screening at time of scan</li>
        <li>ITAR-aware provenance logging</li>
        <li>DLA catalog cross-reference validation</li>
        <li>Counterfeit Electronic Parts (CEP) detection per SAE AS6081</li>
      </ul>
    </div>

    <div class="compliance-card">
      <div class="card-header">
        <div class="card-icon">💊</div>
        <div class="card-status status-live">Live</div>
      </div>
      <div class="card-tag">FDA · DSCSA · Drug Supply Chain</div>
      <div class="card-title">Pharmaceutical Traceability Engine</div>
      <p class="card-body">
        Full Drug Supply Chain Security Act (DSCSA) compliance layer. Track-and-trace from manufacturer to dispensary with interoperable EPCIS event records anchored to Polygon blockchain for tamper-evidence.
      </p>
      <ul class="card-features">
        <li>DSCSA Lot-level and serialized item traceability</li>
        <li>EPCIS 2.0 event record generation</li>
        <li>Suspect product quarantine workflow</li>
        <li>Authorized Trading Partner (ATP) verification</li>
        <li>VA formulary integration ready</li>
      </ul>
    </div>

    <div class="compliance-card">
      <div class="card-header">
        <div class="card-icon">🏛️</div>
        <div class="card-status status-live">Live</div>
      </div>
      <div class="card-tag">Buy American Act · TAA · Berry Amendment</div>
      <div class="card-title">Domestic Origin Certification</div>
      <p class="card-body">
        Blockchain-backed country-of-origin attestation for Buy American Act compliance. Provides auditable proof that components meet domestic content thresholds — verified at the part level, not the contract level.
      </p>
      <ul class="card-features">
        <li>Country-of-origin NFT attestation per SKU</li>
        <li>TAA compliance country whitelist enforcement</li>
        <li>Berry Amendment textile & specialty metal tracking</li>
        <li>Manufacturer affidavit anchoring on-chain</li>
        <li>FAR/DFARS audit-ready export</li>
      </ul>
    </div>

    <div class="compliance-card">
      <div class="card-header">
        <div class="card-icon">🔄</div>
        <div class="card-status status-ready">Pilot Ready</div>
      </div>
      <div class="card-tag">VA RCM · DHS · Reverse Logistics</div>
      <div class="card-title">VA Reverse Chain Management</div>
      <p class="card-body">
        Authenticated reverse logistics for VA medical equipment and pharmaceutical returns. Closes the chain of custody gap that enables re-entry of counterfeit or adulterated goods into federal healthcare supply chains.
      </p>
      <ul class="card-features">
        <li>VA RCM disposition event recording</li>
        <li>DEA controlled substance return audit trail</li>
        <li>Re-entry authentication gate (scan-to-verify)</li>
        <li>DHS border interception data integration</li>
        <li>Inspector General-ready reporting dashboard</li>
      </ul>
    </div>
  </div>
</section>

<!-- ─── HOW IT WORKS ─── -->
<section class="how-section" id="how">
  <div class="section-label">Technical Architecture</div>
  <h2 class="section-title">How <em>AuthiChain Federal</em> Works</h2>
  <p class="section-sub">Five steps from physical product to blockchain proof. No proprietary hardware. No legacy integration required.</p>

  <div class="steps">
    <div class="step">
      <div class="step-num">01</div>
      <div>
        <div class="step-title">Register & Mint</div>
        <p class="step-body">Supplier registers product details. AuthiChain mints an ERC-721 NFT on Polygon with origin, spec, and compliance attestations embedded in metadata.</p>
      </div>
    </div>
    <div class="step">
      <div class="step-num">02</div>
      <div>
        <div class="step-title">Encode & Label</div>
        <p class="step-body">A cryptographically signed QR or RFID tag is generated and affixed to the physical item, binding the digital certificate to the object permanently.</p>
      </div>
    </div>
    <div class="step">
      <div class="step-num">03</div>
      <div>
        <div class="step-title">Track in Transit</div>
        <p class="step-body">Each custody transfer — manufacturer → DLA → depot → end unit — logs an immutable event to the blockchain. No data can be altered retroactively.</p>
      </div>
    </div>
    <div class="step">
      <div class="step-num">04</div>
      <div>
        <div class="step-title">Scan & Verify</div>
        <p class="step-body">Procurement officers, inspectors, and warfighters scan any item to instantly retrieve full provenance, compliance status, and origin certification in under 2 seconds.</p>
      </div>
    </div>
    <div class="step">
      <div class="step-num">05</div>
      <div>
        <div class="step-title">Audit & Report</div>
        <p class="step-body">Immutable audit logs export directly to your ERP, DCSA reporting portal, or IG office dashboard. Zero manual reconciliation.</p>
      </div>
    </div>
  </div>
</section>

<!-- ─── REGULATORY TABLE ─── -->
<section class="reg-section" id="regulations">
  <div class="section-label">Regulatory Alignment</div>
  <h2 class="section-title"><em>Mandate-by-Mandate</em> Coverage Map</h2>
  <p class="section-sub">AuthiChain Federal maps to 14 active federal requirements out of the box. Your procurement office ships pre-compliant.</p>

  <table class="reg-table">
    <thead>
      <tr>
        <th>Regulation / Framework</th>
        <th>Agency</th>
        <th>Requirement</th>
        <th>Coverage</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="reg-id">FASCSA / NDAA §889</td>
        <td>DoD / OUSD</td>
        <td>Prohibited technology screening, supply chain risk</td>
        <td><span class="badge badge-covered">✓ Covered</span></td>
        <td>Real-time entity screening at scan</td>
      </tr>
      <tr>
        <td class="reg-id">FDA DSCSA</td>
        <td>FDA / HHS</td>
        <td>Serialized drug traceability, EPCIS events, ATP verification</td>
        <td><span class="badge badge-covered">✓ Covered</span></td>
        <td>EPCIS 2.0 native export</td>
      </tr>
      <tr>
        <td class="reg-id">Buy American Act / FAR 25</td>
        <td>GSA / All Agencies</td>
        <td>Domestic content attestation, country-of-origin</td>
        <td><span class="badge badge-covered">✓ Covered</span></td>
        <td>NFT-anchored COO per SKU</td>
      </tr>
      <tr>
        <td class="reg-id">DFARS 252.246-7007</td>
        <td>DoD / DLA</td>
        <td>Counterfeit Electronic Part Detection & Avoidance</td>
        <td><span class="badge badge-covered">✓ Covered</span></td>
        <td>SAE AS6081 / AS5553 aligned</td>
      </tr>
      <tr>
        <td class="reg-id">NIST SP 800-161 Rev.1</td>
        <td>NIST / CISA</td>
        <td>C-SCRM practices, provenance documentation</td>
        <td><span class="badge badge-covered">✓ Covered</span></td>
        <td>Task maps to all 4 tiers</td>
      </tr>
      <tr>
        <td class="reg-id">Berry Amendment / 10 U.S.C. §4862</td>
        <td>DoD</td>
        <td>Domestic specialty metals & textiles</td>
        <td><span class="badge badge-covered">✓ Covered</span></td>
        <td>Material-level attestation</td>
      </tr>
      <tr>
        <td class="reg-id">TAA / Trade Agreements Act</td>
        <td>GSA</td>
        <td>Compliant country-of-origin for IT products</td>
        <td><span class="badge badge-covered">✓ Covered</span></td>
        <td>Whitelist enforcement on-chain</td>
      </tr>
      <tr>
        <td class="reg-id">VA RCM Policy / VHA Directive</td>
        <td>VA / VHA</td>
        <td>Reverse supply chain disposition, re-entry control</td>
        <td><span class="badge badge-partial">⬡ Pilot</span></td>
        <td>Pilot program Q3 2026</td>
      </tr>
      <tr>
        <td class="reg-id">DHS SVIP Requirements</td>
        <td>DHS S&T</td>
        <td>Silicon Valley Innovation Program tech standards</td>
        <td><span class="badge badge-covered">✓ Covered</span></td>
        <td>DHS SVIP application filed</td>
      </tr>
      <tr>
        <td class="reg-id">Executive Order 14017</td>
        <td>White House / USTR</td>
        <td>America's Supply Chain resilience review</td>
        <td><span class="badge badge-covered">✓ Covered</span></td>
        <td>Aligned to 6 critical sectors</td>
      </tr>
      <tr>
        <td class="reg-id">CBP Forced Labor / UFLPA</td>
        <td>CBP / DHS</td>
        <td>Uyghur Forced Labor Prevention Act origin tracing</td>
        <td><span class="badge badge-partial">⬡ Pilot</span></td>
        <td>Integration roadmap Q4 2026</td>
      </tr>
      <tr>
        <td class="reg-id">CMMC 2.0 / NIST 800-171</td>
        <td>DoD</td>
        <td>Cybersecurity Maturity Model Certification</td>
        <td><span class="badge badge-partial">⬡ Partner</span></td>
        <td>Via certified CMMC-AB partner</td>
      </tr>
      <tr>
        <td class="reg-id">ISO 28000 / C-TPAT</td>
        <td>CBP / International</td>
        <td>Supply chain security management systems</td>
        <td><span class="badge badge-covered">✓ Covered</span></td>
        <td>Audit trail satisfies C-TPAT criteria</td>
      </tr>
      <tr>
        <td class="reg-id">ITAR / EAR Part 734</td>
        <td>State / Commerce</td>
        <td>Export-controlled item custody logging</td>
        <td><span class="badge badge-partial">⬡ Pilot</span></td>
        <td>Restricted metadata mode available</td>
      </tr>
    </tbody>
  </table>
</section>

<!-- ─── PILOT TESTIMONIALS ─── -->
<section class="pilot-section" id="pilots">
  <div class="section-label">Pilot Feedback</div>
  <h2 class="section-title">What <em>Procurement Officers</em> Are Saying</h2>
  <p class="section-sub">AuthiChain Federal is currently in structured pilot across three federal verticals.</p>

  <div class="pilot-grid">
    <div class="pilot-card">
      <p class="pilot-quote">
        "Finally a platform where I can hand the IG office a blockchain receipt instead of a spreadsheet. The counterfeit part detection alone justified the pilot in week one."
      </p>
      <div class="pilot-attr">
        <div class="pilot-avatar">GS</div>
        <div>
          <div class="pilot-name">GS-14 Contracting Officer</div>
          <div class="pilot-role">Defense Logistics Agency · Pilot Participant</div>
        </div>
      </div>
    </div>
    <div class="pilot-card">
      <p class="pilot-quote">
        "DSCSA compliance used to mean a three-person team reconciling records quarterly. AuthiChain closes the loop automatically. The EPCIS export is exactly what FDA wants to see."
      </p>
      <div class="pilot-attr">
        <div class="pilot-avatar">RX</div>
        <div>
          <div class="pilot-name">Director of Pharmacy Operations</div>
          <div class="pilot-role">VA Medical Center · DSCSA Pilot</div>
        </div>
      </div>
    </div>
    <div class="pilot-card">
      <p class="pilot-quote">
        "Section 889 screening used to be a checkbox exercise. Now every scan runs against the FASCSA entity list in real-time. That's a different product category entirely."
      </p>
      <div class="pilot-attr">
        <div class="pilot-avatar">SC</div>
        <div>
          <div class="pilot-name">Supply Chain Risk Manager</div>
          <div class="pilot-role">DoD Program Office · SCRM Pilot</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ─── CTA ─── -->
<section class="cta-section" id="cta">
  <h2>Your Supply Chain<br/>Deserves <em style="color:var(--gold)">Proof</em>, Not Promise.</h2>
  <p>Schedule a classified-environment briefing with our Federal Solutions team. We'll map AuthiChain to your specific agency mandate and standing pilot budget in one session.</p>
  <div class="cta-actions">
    <a href="mailto:federal@authichain.com?subject=AuthiChain%20Federal%20Briefing%20Request" class="btn-primary">
      ⬡ Request Agency Briefing
    </a>
    <a href="https://authichain.com/demo" target="_blank" class="btn-secondary">
      View Live Demo →
    </a>
  </div>
  <div class="cta-note">
    GSA Schedule · SAM.gov Registered · UEI Active · DHS SVIP Applicant
  </div>
</section>

<!-- ─── FOOTER ─── -->
<footer>
  <div class="footer-top">
    <div class="footer-brand">
      <div class="nav-wordmark" style="font-size:18px;">AuthiChain <span style="color:var(--gold)">Federal</span></div>
      <p>A division of the Authentic Economy. Blockchain supply chain authentication for federal procurement officers, defense logistics, pharmaceutical traceability, and government SCRM programs.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <span class="cert-badge">SAM.gov ✓</span>
        <span class="cert-badge">UEI Active</span>
        <span class="cert-badge">SVIP Applicant</span>
        <span class="cert-badge">APEX Partner</span>
      </div>
    </div>
    <div>
      <div class="footer-heading">Solutions</div>
      <ul class="footer-links">
        <li><a href="#compliance">Defense / DoD</a></li>
        <li><a href="#compliance">Pharmaceutical / FDA</a></li>
        <li><a href="#compliance">Buy American Compliance</a></li>
        <li><a href="#compliance">VA Supply Chain</a></li>
        <li><a href="#compliance">DHS / CISA</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-heading">Regulations</div>
      <ul class="footer-links">
        <li><a href="#regulations">FASCSA / §889</a></li>
        <li><a href="#regulations">FDA DSCSA</a></li>
        <li><a href="#regulations">NIST SP 800-161</a></li>
        <li><a href="#regulations">DFARS 252.246-7007</a></li>
        <li><a href="#regulations">VA RCM Policy</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-heading">Authentic Economy</div>
      <ul class="footer-links">
        <li><a href="https://authichain.com" target="_blank">AuthiChain</a></li>
        <li><a href="https://strainchain.io" target="_blank">StrainChain</a></li>
        <li><a href="https://qron.space" target="_blank">QRON Space</a></li>
        <li><a href="mailto:federal@authichain.com">federal@authichain.com</a></li>
        <li><a href="https://authichain.com/demo" target="_blank">Live Demo</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-legal">© 2026 AuthiChain Federal · Authentic Economy Protocol · All rights reserved · Polygon Blockchain · UEI Active</div>
    <div class="footer-certifications">
      <span class="cert-badge">UNCLASSIFIED // FOUO</span>
      <span class="cert-badge">Section 508 Compliant</span>
    </div>
  </div>
</footer>

</body>
</html>
`

export async function GET() {
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

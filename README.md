# VECTOR — Text to PDF

A fully client-side text→PDF converter. Type or paste text, press one button, and a clean, paginated PDF is generated entirely in the browser and downloaded to your device. No upload, no server, no tracking.

## Features

- **100% client-side**: conversion runs in-browser via jsPDF; text never leaves the device
- **Automatic pagination**: long text flows across pages with page numbers and a footer
- **Draft memory**: last input is persisted in `localStorage` (this device only)
- **No account, no watermark, no limits**: free to use
- **Resilient**: decorative libraries (Three.js / GSAP / Lenis) are isolated so a CDN failure never breaks the core tool

## Usage

1. Type or paste text into the workspace
2. Press **Download PDF**
3. The paginated PDF is generated locally and downloaded instantly

## Tech Stack

- [jsPDF](https://github.com/parallax/jsPDF) for client-side PDF generation
- Three.js (WebGL background), GSAP + Lenis (motion) — progressive enhancements
- Vanilla JavaScript, single static HTML file
- Cloudflare Pages for deployment

## Security

- All third-party scripts pinned with **Subresource Integrity (SRI)** hashes + `crossorigin`
- HTTP security headers in `_headers` (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, COOP/CORP)
- `.well-known/security.txt` for vulnerability disclosure
- No backend, no auth, no database — minimal attack surface

## SEO

- Keyword-optimized title/meta/canonical + Open Graph and Twitter cards
- `SoftwareApplication` and `FAQPage` JSON-LD structured data
- `robots.txt` and `sitemap.xml`
- Crawlable how-to / features / FAQ content woven into the page

## Palette

- Sage: `#C4DCC8`
- White: `#FFFFFF`
- Kraft: `#C9B19C`
- Charcoal: `#1D1D1D`

## License

Built by Velocity — Digital Architecture House

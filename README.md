# Arabic Corporate Website — Design Demo (نموذج تصميم)

A live, RTL-first design demo for an Arabic-only corporate WordPress site.

**All text, images, logos and prices are placeholders** — they exist only to show
layout, typography and interaction, and are replaced with the client's own content.

## Pages
- `index.html` — hero with video background, animated stats counter, services, work, clients grid, quote form
- `about.html` — company intro, values, 4-step process
- `services.html` — overview of the 5 services + FAQ
- `service-{web,mobile,systems,branding,marketing}.html` — per-service detail page with
  feature icons, its own portfolio gallery, and 3 pricing tiers (buy-now or request-a-quote)
- `portfolio.html` — filterable work grid (websites / mobile apps / systems)
- `contact.html` — enquiry form and contact channels

## Notes
- Right-to-left throughout, built with CSS logical properties (no `direction` hacks).
- Fonts (Tajawal + IBM Plex Sans Arabic) are self-hosted — no third-party request.
- The hero video is generated, 148 KB, and loops seamlessly.
- No build step at runtime: plain HTML/CSS/JS. `build/` holds the generators.

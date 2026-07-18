# VASTOS Landing Page

Cinematic landing page for VASTOS, built with Next.js, Tailwind CSS, GSAP,
Resend, and React Email.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Add the restricted Resend sending key:

   ```text
   RESEND_API_KEY=re_your_private_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The site runs at [http://localhost:3000](http://localhost:3000).

## Enquiry delivery

Website enquiries are sent from `website@vastos.in` to `team@vastos.in`.
The visitor's work email is set as the reply-to address.

Add `RESEND_API_KEY` as a sensitive Production and Preview environment
variable in Vercel. The API key must have Sending access restricted to
`vastos.in`.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

import Script from "next/script";

/**
 * Google Analytics (GA4 / gtag.js). The measurement ID is public (not a secret);
 * it defaults to the Semitree property and can be overridden with
 * NEXT_PUBLIC_GA_ID. Loaded after hydration so it never blocks first paint.
 * Uses window.dataLayer, the same seam the app's `track()` helper writes to.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-89EBSXL8NP";

export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}

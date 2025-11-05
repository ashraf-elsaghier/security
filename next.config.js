// // /** @type {import('next').NextConfig} */
// // const { i18n } = require("./next-i18next.config");

// // const nextConfig = {
// //   reactStrictMode: true,
// //   i18n,
// //   swcMinify: false,
// //   keySeparator: ".",
// //   returnEmptyString: false,
// //   reloadOnPrerender: process.env.NODE_ENV === "development",
// // };

// // module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const { i18n } = require("./next-i18next.config");

// // --- 1. CONFIGURATION FLAGS ---
// const isProd = process.env.NODE_ENV === "production";
// const isDev = !isProd;

// // --- 2. CSP SOURCE ARRAYS ---
// let styleSources = [
//   "'self'",
//   "https://fonts.googleapis.com",
//   "https://cdnjs.cloudflare.com",
//   "https://stackpath.bootstrapcdn.com",
// ];

// let scriptSources = [
//   "'self'",
//   "https://*.googleapis.com",
//   "https://*.google.com",
//   "https://www.googletagmanager.com",
// ];

// let connectSources = [
//   "'self'",
//   "https://api.fms.mobily.saferoad.net",
//   "wss://socketio.fms.mobily.saferoad.net",
//   "https://www.google-analytics.com",
//   "https://*.googleapis.com",
//   "https://*.google.com",
// ];

// let imageSources = [
//   "'self'",
//   "data:",
//   "blob:",
//   "https://res.cloudinary.com",
//   "https://*.googleapis.com",
//   "https://*.gstatic.com",
// ];

// let fontSources = [
//   "'self'",
//   "data:",
//   "https://fonts.gstatic.com",
//   "https://cdnjs.cloudflare.com",
//   "https://stackpath.bootstrapcdn.com",
// ];

// // --- 3. CONDITIONAL ADDITIONS FOR DEVELOPMENT (FIXES EvalError) ---
// if (isDev) {
//   // Fixes: "Uncaught EvalError: Refused to evaluate a string as JavaScript"
//   scriptSources.push("'unsafe-eval'");

//   // Fixes other development-mode issues
//   scriptSources.push("'unsafe-inline'");
//   styleSources.push("'unsafe-inline'");
//   connectSources.push("http:");
//   connectSources.push("ws:");
//   imageSources.push("http:");
// }

// // --- 4. BUILD THE FINAL CSP STRING ---
// const csp = `
//     default-src 'self';
//     object-src 'none';
//     base-uri 'self';
//     frame-ancestors 'none';
//     upgrade-insecure-requests;

//     form-action 'self';

//     script-src ${scriptSources.join(" ")};
//     style-src ${styleSources.join(" ")};
//     style-src-elem ${styleSources.join(" ")};
//     img-src ${imageSources.join(" ")};
//     connect-src ${connectSources.join(" ")};
//     font-src ${fontSources.join(" ")};

//     frame-src 'self' https://*.google.com;
//     worker-src 'self' blob:;
//     child-src 'self' blob:;
// `;

// // Clean up the string
// const cspValue = csp.replace(/\s+/g, " ").trim();

// // --- 5. DEFINE ALL SECURITY HEADERS ---
// const securityHeaders = [
//   // FIX: This structure is correct. The error must have been an external typo.
//   {
//     key: "Content-Security-Policy",
//     value: cspValue,
//   },
//   {
//     key: "X-Frame-Options",
//     value: "DENY",
//   },
//   {
//     key: "X-Content-Type-Options",
//     value: "nosniff",
//   },
//   {
//     key: "Referrer-Policy",
//     value: "strict-origin-when-cross-origin",
//   },
//   {
//     key: "X-XSS-Protection",
//     value: "1; mode=block",
//   },
//   {
//     key: "X-Powered-By",
//     value: "",
//   },
//   {
//     key: "Permissions-Policy",
//     value: "camera=(), microphone=(), geolocation=()",
//   },
// ];

// // --- 6. NEXT.JS CONFIGURATION OBJECT ---
// const nextConfig = {
//   reactStrictMode: true,
//   i18n,
//   swcMinify: false,
//   keySeparator: ".",
//   returnEmptyString: false,
//   reloadOnPrerender: isDev,
//   poweredByHeader: false,

//   async headers() {
//     return [
//       {
//         source: "/(.*)", // Ensure this is exactly "/(.*)" for all paths.
//         headers: securityHeaders,
//       },
//     ];
//   },
// };

// module.exports = nextConfig;

// next.config.js
/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

// Build a Content Security Policy that matches our current external usage.
// NOTE: Start permissive enough to avoid breaking prod, then tighten iteratively
// by watching the browser console for CSP violations and whitelisting only what we need.
const isProd = process.env.NODE_ENV === "production";

const csp = [
  "default-src 'self'",
  // Next.js and our app inject inline styles (styled-jsx), so 'unsafe-inline' for style is needed unless we migrate to nonces
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com",
  // We currently load and init scripts for GTM/GA, Microsoft Clarity and Zoho SalesIQ, plus some inline bootstraps
  "script-src 'self' " +
    (isProd ? "" : "'unsafe-eval' ") +
    "'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://salesiq.zoho.com https://maps.googleapis.com",
  // Images, including data URIs and possible analytics pixels
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://maps.gstatic.com",
  // Fonts
  "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com",
  // Network/API calls and websockets. Refine these hosts as you harden.
  "connect-src 'self' https: wss: https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://salesiq.zoho.com https://maps.googleapis.com https://maps.gstatic.com",
  // We don't expect to be framed by other origins; allow only same-origin framing
  "frame-ancestors 'self'",
  // Allow iframes we embed from our own origin and trusted vendors if needed later (add hosts here)
  "frame-src 'self' https://www.googletagmanager.com https://www.clarity.ms https://salesiq.zoho.com",
  // Disallow object/embed entirely
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  // Content Security Policy
  { key: "Content-Security-Policy", value: csp },
  // Clickjacking protection (CSP frame-ancestors is modern; keep X-Frame-Options for legacy)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer policy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Old XSS filter header (disabled to avoid false positives)
  { key: "X-XSS-Protection", value: "0" },
  // Cross-Origin policies (tighten if you add COOP/COEP later)
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  // HSTS only in production and only over HTTPS (make sure you serve via HTTPS before enabling)
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig = {
  reactStrictMode: true,
  i18n,
  swcMinify: false,
  keySeparator: ".",
  returnEmptyString: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",
  async headers() {
    // Apply security headers site-wide, plus explicitly for sitemap/robots
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/sitemap.xml",
        headers: securityHeaders,
      },
      {
        source: "/robots.txt",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;

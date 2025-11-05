// /** @type {import('next').NextConfig} */
// const { i18n } = require("./next-i18next.config");

// const nextConfig = {
//   reactStrictMode: true,
//   i18n,
//   swcMinify: false,
//   keySeparator: ".",
//   returnEmptyString: false,
//   reloadOnPrerender: process.env.NODE_ENV === "development",
// };

// module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const { i18n } = require("./next-i18next.config");

// // --- 1. CONFIGURATION FLAGS ---
// const isProd = process.env.NODE_ENV === "production";
// const isDev = !isProd;

// // --- 2. CSP SOURCE ARRAYS ---

// // Note: Keeping 'unsafe-inline' for style-src is often unavoidable with Next.js/React
// // unless using a tool like emotion's nonce or extracting all critical CSS.
// let styleSources = [
//   "'self'",
//   "'unsafe-inline'", // Needed for many Next.js style chunks, even in prod
//   "https://fonts.googleapis.com",
//   "https://cdnjs.cloudflare.com",
//   "https://stackpath.bootstrapcdn.com",
//   "https://css.zohocdn.com",
// ];

// let scriptSources = [
//   "'self'",
//   "'unsafe-inline'",
//   "https://*.googleapis.com",
//   "https://*.google.com",
//   "https://www.googletagmanager.com",
// ];

// // FIX: Added both required WebSocket domains from the error logs.
// let connectSources = [
//   "'self'",
//   "https://api.fms.mobily.saferoad.net",
//   "wss://socketio.fms.mobily.saferoad.net",
//   "wss://socketio.fms.saferoad.net", // **<-- FIX: Added specific wss origin from error**
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
//   "https://css.zohocdn.com",
// ];

// // --- 3. CONDITIONAL ADDITIONS FOR DEVELOPMENT ONLY ---
// if (isDev) {
//   // These directives are CRITICAL for Next.js/Webpack development features (hot-reloading, source maps)
//   scriptSources.push("'unsafe-eval'");
//   scriptSources.push("'unsafe-inline'");
//   connectSources.push("http:");
//   connectSources.push("ws:");
//   imageSources.push("http:");
// } else {
//   // PRODUCTION FIX: Include the specific hash for the inline script error you saw.
//   // NOTE: If this script changes, the hash must be updated. A nonce is safer.
//   scriptSources.push("'sha256-7Ayf/i8gH+ASideztFT+YbgRd62nZdTXp4RbP3P4hjk='");
// }

// // --- 4. BUILD FINAL CSP STRING ---
// const csp = `
//   default-src 'self';
//   object-src 'none';
//   base-uri 'self';
//   frame-ancestors 'none';
//   upgrade-insecure-requests;
//   form-action 'self';

//   script-src ${scriptSources.join(" ")};
//   style-src ${styleSources.join(" ")};
//   style-src-elem ${styleSources.join(" ")};
//   img-src ${imageSources.join(" ")};
//   connect-src ${connectSources.join(" ")};
//   font-src ${fontSources.join(" ")};

//   frame-src 'self' https://*.google.com;
//   worker-src 'self' blob:;
//   child-src 'self' blob:;
// `;

// // Clean up spaces
// const cspValue = csp.replace(/\s+/g, " ").trim();

// // --- 5. SECURITY HEADERS ---
// const securityHeaders = [
//   {
//     key: "Content-Security-Policy",
//     value: cspValue,
//   },
//   // Other security headers remain unchanged and are good practice:
//   { key: "X-Frame-Options", value: "DENY" },
//   { key: "X-Content-Type-Options", value: "nosniff" },
//   { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//   { key: "X-XSS-Protection", value: "1; mode=block" },
//   { key: "X-Powered-By", value: "" },
//   {
//     key: "Permissions-Policy",
//     value: "camera=(), microphone=(), geolocation=()",
//   },
//   { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
//   { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
// ];

// // --- 6. NEXT CONFIG EXPORT ---
// const nextConfig = {
//   reactStrictMode: true,
//   i18n,
//   swcMinify: false,
//   keySeparator: ".",
//   returnEmptyString: false,
//   // Ensure we only reload on prerender in development
//   reloadOnPrerender: isDev,
//   poweredByHeader: false,

//   async headers() {
//     return [
//       {
//         source: "/(.*)", // apply to all routes
//         headers: securityHeaders,
//       },
//     ];
//   },
// };

// module.exports = nextConfig;
// // const { i18n } = require("./next-i18next.config");

// // // --- 1. CONFIGURATION FLAGS ---
// // const isProd = process.env.NODE_ENV === "production";
// // const isDev = !isProd;

// // // --- 2. CSP SOURCE ARRAYS ---
// // let styleSources = [
// //   "'self'",
// //   "https://fonts.googleapis.com",
// //   "https://cdnjs.cloudflare.com",
// //   "https://stackpath.bootstrapcdn.com",
// // ];

// // let scriptSources = [
// //   "'self'",
// //   "https://*.googleapis.com",
// //   "https://*.google.com",
// //   "https://www.googletagmanager.com",
// // ];

// // let connectSources = [
// //   "'self'",
// //   "https://api.fms.mobily.saferoad.net",
// //   "wss://socketio.fms.mobily.saferoad.net",
// //   "https://www.google-analytics.com",
// //   "https://*.googleapis.com",
// //   "https://*.google.com",
// // ];

// // let imageSources = [
// //   "'self'",
// //   "data:",
// //   "blob:",
// //   "https://res.cloudinary.com",
// //   "https://*.googleapis.com",
// //   "https://*.gstatic.com",
// // ];

// // let fontSources = [
// //   "'self'",
// //   "data:",
// //   "https://fonts.gstatic.com",
// //   "https://cdnjs.cloudflare.com",
// //   "https://stackpath.bootstrapcdn.com",
// // ];

// // // --- 3. CONDITIONAL ADDITIONS FOR DEVELOPMENT (FIXES EvalError) ---
// // if (isDev) {
// //   // Fixes: "Uncaught EvalError: Refused to evaluate a string as JavaScript"
// //   scriptSources.push("'unsafe-eval'");

// //   // Fixes other development-mode issues
// //   scriptSources.push("'unsafe-inline'");
// //   styleSources.push("'unsafe-inline'");
// //   connectSources.push("http:");
// //   connectSources.push("ws:");
// //   imageSources.push("http:");
// // }

// // // --- 4. BUILD THE FINAL CSP STRING ---
// // const csp = `
// //     default-src 'self';
// //     object-src 'none';
// //     base-uri 'self';
// //     frame-ancestors 'none';
// //     upgrade-insecure-requests;

// //     form-action 'self';

// //     script-src ${scriptSources.join(" ")};
// //     style-src ${styleSources.join(" ")};
// //     style-src-elem ${styleSources.join(" ")};
// //     img-src ${imageSources.join(" ")};
// //     connect-src ${connectSources.join(" ")};
// //     font-src ${fontSources.join(" ")};

// //     frame-src 'self' https://*.google.com;
// //     worker-src 'self' blob:;
// //     child-src 'self' blob:;
// // `;

// // // Clean up the string
// // const cspValue = csp.replace(/\s+/g, " ").trim();

// // // --- 5. DEFINE ALL SECURITY HEADERS ---
// // const securityHeaders = [
// //   // FIX: This structure is correct. The error must have been an external typo.
// //   {
// //     key: "Content-Security-Policy",
// //     value: cspValue,
// //   },
// //   {
// //     key: "X-Frame-Options",
// //     value: "DENY",
// //   },
// //   {
// //     key: "X-Content-Type-Options",
// //     value: "nosniff",
// //   },
// //   {
// //     key: "Referrer-Policy",
// //     value: "strict-origin-when-cross-origin",
// //   },
// //   {
// //     key: "X-XSS-Protection",
// //     value: "1; mode=block",
// //   },
// //   {
// //     key: "X-Powered-By",
// //     value: "",
// //   },
// //   {
// //     key: "Permissions-Policy",
// //     value: "camera=(), microphone=(), geolocation=()",
// //   },
// // ];

// // // --- 6. NEXT.JS CONFIGURATION OBJECT ---
// // const nextConfig = {
// //   reactStrictMode: true,
// //   i18n,
// //   swcMinify: false,
// //   keySeparator: ".",
// //   returnEmptyString: false,
// //   reloadOnPrerender: isDev,
// //   poweredByHeader: false,

// //   async headers() {
// //     return [
// //       {
// //         source: "/(.*)", // Ensure this is exactly "/(.*)" for all paths.
// //         headers: securityHeaders,
// //       },
// //     ];
// //   },
// // };

// // module.exports = nextConfig;
// /** @type {import('next').NextConfig} */
// const { i18n } = require("./next-i18next.config");

// // --- 1. CONFIGURATION FLAGS ---
// const isProd = process.env.NODE_ENV === "production";
// const isDev = !isProd;

// // --- 2. CSP SOURCE ARRAYS ---

// // Note: Keeping 'unsafe-inline' for style-src is often unavoidable with Next.js/React
// // unless using a tool like emotion's nonce or extracting all critical CSS.
// let styleSources = [
//   "'self'",
//   "'unsafe-inline'", // Needed for many Next.js style chunks, even in prod
//   "https://fonts.googleapis.com",
//   "https://cdnjs.cloudflare.com",
//   "https://stackpath.bootstrapcdn.com",
//   "https://css.zohocdn.com",
// ];

// let scriptSources = [
//   "'self'",
//   "'unsafe-inline'",
//   "https://*.googleapis.com",
//   "https://*.google.com",
//   "https://www.googletagmanager.com",
// ];

// // FIX: Added both required WebSocket domains from the error logs.
// let connectSources = [
//   "'self'",
//   "https://api.fms.mobily.saferoad.net",
//   "wss://socketio.fms.mobily.saferoad.net",
//   "wss://socketio.fms.saferoad.net", // **<-- FIX: Added specific wss origin from error**
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
//   "https://css.zohocdn.com",
// ];

// // --- 3. CONDITIONAL ADDITIONS FOR DEVELOPMENT ONLY ---
// if (isDev) {
//   // These directives are CRITICAL for Next.js/Webpack development features (hot-reloading, source maps)
//   scriptSources.push("'unsafe-eval'");
//   scriptSources.push("'unsafe-inline'");
//   connectSources.push("http:");
//   connectSources.push("ws:");
//   imageSources.push("http:");
// } else {
//   // PRODUCTION FIX: Include the specific hash for the inline script error you saw.
//   // NOTE: If this script changes, the hash must be updated. A nonce is safer.
//   scriptSources.push("'sha256-7Ayf/i8gH+ASideztFT+YbgRd62nZdTXp4RbP3P4hjk='");
// }

// // --- 4. BUILD FINAL CSP STRING ---
// const csp = `
//   default-src 'self';
//   object-src 'none';
//   base-uri 'self';
//   frame-ancestors 'none';
//   upgrade-insecure-requests;
//   form-action 'self';

//   script-src ${scriptSources.join(" ")};
//   style-src ${styleSources.join(" ")};
//   style-src-elem ${styleSources.join(" ")};
//   img-src ${imageSources.join(" ")};
//   connect-src ${connectSources.join(" ")};
//   font-src ${fontSources.join(" ")};

//   frame-src 'self' https://*.google.com;
//   worker-src 'self' blob:;
//   child-src 'self' blob:;
// `;

// // Clean up spaces
// const cspValue = csp.replace(/\s+/g, " ").trim();

// // --- 5. SECURITY HEADERS ---
// const securityHeaders = [
//   {
//     key: "Content-Security-Policy",
//     value: cspValue,
//   },
//   // This header specifically fixes the 'Missing Anti-clickjacking Header' warning
//   { key: "X-Frame-Options", value: "DENY" },
//   { key: "X-Content-Type-Options", value: "nosniff" },
//   { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//   { key: "X-XSS-Protection", value: "1; mode=block" },
//   { key: "X-Powered-By", value: "" },
//   {
//     key: "Permissions-Policy",
//     value: "camera=(), microphone=(), geolocation=()",
//   },
//   { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
//   { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
// ];

// // --- 6. NEXT CONFIG EXPORT ---
// const nextConfig = {
//   reactStrictMode: true,
//   i18n,
//   swcMinify: false,
//   keySeparator: ".",
//   returnEmptyString: false,
//   // Ensure we only reload on prerender in development
//   reloadOnPrerender: isDev,
//   poweredByHeader: false,

//   async headers() {
//     return [
//       {
//         source: "/((?!api).*)",
//         headers: securityHeaders,
//       },
//     ];
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const isProd = process.env.NODE_ENV === "production";

// =========================================================================
// MEDIUM FIXES: REMOVED 'unsafe-inline' (CSP: script/style-src unsafe-inline)
// NOTE: This will break your app if you use inline styles/scripts.
// You must move them to external files or implement a Nonce strategy.
// =========================================================================
let styleSources = [
  "'self'",
  // "'unsafe-inline'", // <-- REMOVED: Fixes CSP: style-src unsafe-inline
  "https://fonts.googleapis.com",
  "https://cdnjs.cloudflare.com",
  "https://stackpath.bootstrapcdn.com",
  "https://css.zohocdn.com",
];

let scriptSources = [
  "'self'",
  // "'unsafe-inline'", // <-- REMOVED: Fixes CSP: script-src unsafe-inline
  "https://*.googleapis.com",
  "https://*.google.com",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://www.clarity.ms",
  "https://salesiq.zoho.com",
  "https://maps.googleapis.com",
  "https://*.zohocdn.com",
];

// =========================================================================
// MEDIUM FIXES: REMOVED broad wildcards 'https:' and 'wss:' (CSP: Wildcard Directive)
// =========================================================================
let connectSources = [
  "'self'",
  "https://api.fms.mobily.saferoad.net",
  "wss://socketio.fms.mobily.saferoad.net",
  "wss://socketio.fms.saferoad.net",
  "https://www.google-analytics.com",
  "https://www.googletagmanager.com",
  "https://www.clarity.ms",
  "https://salesiq.zoho.com",
  "https://maps.googleapis.com",
  "https://maps.gstatic.com",
  "https://*.zohocdn.com",
  // "https:", // <-- REMOVED: Fixes CSP: Wildcard Directive
  // "wss:", // <-- REMOVED: Fixes CSP: Wildcard Directive
];

let imageSources = [
  "'self'",
  "data:",
  "blob:",
  "https://res.cloudinary.com",
  "https://*.googleapis.com",
  "https://*.gstatic.com",
  "https://salesiq.zoho.com",
  "https://*.zohocdn.com",
];

let fontSources = [
  "'self'",
  "data:",
  "https://fonts.gstatic.com",
  "https://cdnjs.cloudflare.com",
  "https://stackpath.bootstrapcdn.com",
  "https://css.zohocdn.com",
];

const csp = `
  default-src 'self';
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none'; // FIX: Missing Anti-clickjacking Header (Medium)
  form-action 'self';
  upgrade-insecure-requests;

  script-src ${scriptSources.join(" ")};
  style-src ${styleSources.join(" ")};
  img-src ${imageSources.join(" ")};
  connect-src ${connectSources.join(" ")};
  font-src ${fontSources.join(" ")};
  frame-src 'self' https://www.googletagmanager.com https://www.clarity.ms https://salesiq.zoho.com https://*.zohocdn.com;
  worker-src 'self' blob:;
  child-src 'self' blob:;
`
  .replace(/\s+/g, " ")
  .trim();

const securityHeaders = [
  // FIX: Content Security Policy (CSP) Header Not Set (Medium)
  { key: "Content-Security-Policy", value: csp },

  // FIX: Missing Anti-clickjacking Header (Medium) - Redundant with CSP frame-ancestors, but good fallback.
  { key: "X-Frame-Options", value: "DENY" },

  // FIX: Cross-Domain Misconfiguration (Medium)
  // This explicitly restricts resources to the same origin.
  // This *overrides* any existing overly broad Access-Control-Allow-Origin: * header.
  // If you need CORS for specific endpoints, this header should be moved to a conditional block or API route.
  {
    key: "Access-Control-Allow-Origin",
    value: "self",
  },

  // =========================================================================
  // LOW FIXES (X-Content-Type-Options Header Missing & Strict-Transport-Security Header Not Set)
  // =========================================================================
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Only use this if the site is ONLY served over HTTPS. Vercel enforces this.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },

  // Other standard security headers
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig = {
  reactStrictMode: true,
  i18n,
  swcMinify: false,
  reloadOnPrerender: !isProd,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;

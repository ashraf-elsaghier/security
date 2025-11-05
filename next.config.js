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

// --- 1. CONFIGURATION FLAGS ---
const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

// --- 2. CSP SOURCE ARRAYS ---

// Note: Ensure all necessary domains for styles are listed here.
let styleSources = [
  "'self'",
  "https://fonts.googleapis.com",
  "https://cdnjs.cloudflare.com",
  "https://stackpath.bootstrapcdn.com",
];

// Note: Ensure all domains for scripts (GTM, analytics, etc.) are listed here.
let scriptSources = [
  "'self'",
  "https://*.googleapis.com",
  "https://*.google.com",
  "https://www.googletagmanager.com",
];

// Note: Ensure all domains for fetch/websocket requests are listed here.
let connectSources = [
  "'self'",
  "https://api.fms.mobily.saferoad.net",
  "wss://socketio.fms.mobily.saferoad.net",
  "https://www.google-analytics.com",
  "https://*.googleapis.com",
  "https://*.google.com",
];

// Note: Ensure all domains for images, SVGs, and data URIs are listed here.
let imageSources = [
  "'self'",
  "data:", // Allows data URIs (often used for small icons/images)
  "blob:", // Allows blob URLs
  "https://res.cloudinary.com",
  "https://*.googleapis.com",
  "https://*.gstatic.com",
];

// Note: Ensure all domains for custom fonts and icon fonts are listed here.
let fontSources = [
  "'self'",
  "data:", // Allows font data URIs
  "https://fonts.gstatic.com",
  "https://cdnjs.cloudflare.com",
  "https://stackpath.bootstrapcdn.com",
];

// --- 3. CONDITIONAL ADDITIONS FOR DEVELOPMENT (CSP FIXES) ---
if (isDev) {
  // FIX for: "Refused to apply inline style"
  // WARNING: This is INSECURE for production. Use Nonce/Hash for production.
  styleSources.push("'unsafe-inline'");

  // FIX for: "Refused to execute inline script"
  // WARNING: This is INSECURE for production. Use Nonce/Hash for production.
  scriptSources.push("'unsafe-inline'");

  // FIX for: "Uncaught EvalError: Refused to evaluate a string as JavaScript" (often for sourcemaps)
  scriptSources.push("'unsafe-eval'");

  // Allow HTTP/WS connections in development
  connectSources.push("http:");
  connectSources.push("ws:");
  imageSources.push("http:");
}

// --- 4. BUILD THE FINAL CSP STRING ---
const csp = `
    default-src 'self';
    object-src 'none';
    base-uri 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    
    form-action 'self';

    script-src ${scriptSources.join(" ")};
    style-src ${styleSources.join(" ")};
    style-src-elem ${styleSources.join(" ")};
    img-src ${imageSources.join(" ")};
    connect-src ${connectSources.join(" ")};
    font-src ${fontSources.join(" ")};
    
    frame-src 'self' https://*.google.com;
    worker-src 'self' blob:;
    child-src 'self' blob:;
`;

// Clean up the string by replacing multiple spaces/newlines with a single space
const cspValue = csp.replace(/\s+/g, " ").trim();

// --- 5. DEFINE ALL SECURITY HEADERS ---
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspValue,
  },
  {
    key: "X-Frame-Options",
    value: "DENY", // Prevents clickjacking by blocking framing
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff", // Prevents browser from 'sniffing' content type
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block", // Basic XSS protection (though CSP is better)
  },
  // Removed 'X-Powered-By' header by setting 'poweredByHeader: false' below
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()", // Denies access to sensitive APIs
  },
];

// --- 6. NEXT.JS CONFIGURATION OBJECT ---
const nextConfig = {
  reactStrictMode: true,
  i18n,
  swcMinify: false, // You might want to remove this or set to true for better performance
  keySeparator: ".",
  returnEmptyString: false,
  reloadOnPrerender: isDev,
  poweredByHeader: false, // Recommended security practice to hide Next.js

  // Headers function to apply the security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)", // Apply headers to all paths
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;

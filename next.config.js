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
let styleSources = [
  "'self'",
  "https://fonts.googleapis.com",
  "https://cdnjs.cloudflare.com",
  "https://stackpath.bootstrapcdn.com",
];

let scriptSources = [
  "'self'",
  "https://*.googleapis.com",
  "https://*.google.com",
  "https://www.googletagmanager.com",
];

let connectSources = [
  "'self'",
  "https://api.fms.mobily.saferoad.net",
  "wss://socketio.fms.mobily.saferoad.net",
  "https://www.google-analytics.com",
  "https://*.googleapis.com",
  "https://*.google.com",
];

let imageSources = [
  "'self'",
  "data:",
  "blob:",
  "https://res.cloudinary.com",
  "https://*.googleapis.com",
  "https://*.gstatic.com",
];

let fontSources = [
  "'self'",
  "data:",
  "https://fonts.gstatic.com",
  "https://cdnjs.cloudflare.com",
  "https://stackpath.bootstrapcdn.com",
];

// --- 3. CONDITIONAL ADDITIONS FOR DEVELOPMENT (CSP FIXES) ---
// These INSECURE directives are ONLY added for local development.
if (isDev) {
  // FIX for: "Refused to apply inline style"
  styleSources.push("'unsafe-inline'");

  // FIX for: "Refused to execute inline script"
  scriptSources.push("'unsafe-inline'");

  // FIX for: "Uncaught EvalError: Refused to evaluate a string as JavaScript"
  scriptSources.push("'unsafe-eval'");

  // Allow HTTP/WS connections in development
  connectSources.push("http:");
  connectSources.push("ws:");
  imageSources.push("http:");
}

// --- 4. BUILD THE FINAL CSP STRING ---
// NOTE: If issues persist in PRODUCTION, you need to add specific domains
// that are being blocked, or use a secure Nonce/Hash solution
// to replace the development-only 'unsafe-inline' and 'unsafe-eval'.
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
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

// --- 6. NEXT.JS CONFIGURATION OBJECT ---
const nextConfig = {
  reactStrictMode: true,
  i18n,
  swcMinify: false, // Consider setting to true for better production performance
  keySeparator: ".",
  returnEmptyString: false,
  reloadOnPrerender: isDev,
  poweredByHeader: false, // Security: Hide Next.js

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

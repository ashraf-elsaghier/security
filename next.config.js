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

/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

// Security Headers Configuration
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.google.com https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline' https: http:;
      style-src-elem 'self' 'unsafe-inline' https: http:;
      img-src 'self' data: blob: https: http:
        https://res.cloudinary.com 
        http://res.cloudinary.com
        https://*.googleapis.com
        https://*.gstatic.com;
      connect-src 'self' 
        https://api.fms.mobily.saferoad.net 
        wss://socketio.fms.saferoad.net 
        ws://socketio.fms.saferoad.net 
        https://www.google-analytics.com
        https://*.googleapis.com
        https://*.google.com;
      font-src 'self' https: data:;
      frame-src 'self' https://*.google.com;
      worker-src 'self' blob:;
      child-src 'self' blob:;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
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
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  i18n,
  swcMinify: false,
  keySeparator: ".",
  returnEmptyString: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",

  // Add security headers configuration
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

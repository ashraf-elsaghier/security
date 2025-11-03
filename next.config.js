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

// --- Security Headers
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://api.fms.mobily.saferoad.net; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
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
  swcMinify: false,
  i18n,
  keySeparator: ".",
  returnEmptyString: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",

  // ✅ Add security headers globally
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

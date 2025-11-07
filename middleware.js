// // middleware.js

// import { NextResponse } from "next/server";

// // Helper function to generate a base64 nonce (16 bytes = 24 base64 chars)
// const generateNonce = () => {
//   // This is a robust method compatible with the Next.js Edge Runtime
//   const array = new Uint8Array(16);
//   crypto.getRandomValues(array);
//   // Convert to base64 and remove padding
//   return btoa(String.fromCharCode.apply(null, array)).replace(/=/g, "");
// };

// // Use process.env values from next.config.js (adjust as needed for imports)
// const isProd = process.env.isProd === "true";

// // NOTE: In a real environment, you should import these arrays
// // from your next.config.js if possible, or define them here:
// // For simplicity and deployment reliability, we use the values exported
// // via `process.env` (as defined in the updated next.config.js)
// // const scriptSrc = process.env.scriptSources;
// // const styleSrc = process.env.styleSources;
// // const connectSrc = process.env.connectSources;
// // const imageSrc = process.env.imageSources;
// // const fontSrc = process.env.fontSources;
// const styleSrc = [
//   "'self'",
//   "https://fonts.googleapis.com",
//   "https://cdnjs.cloudflare.com",
//   "https://stackpath.bootstrapcdn.com",
//   "https://css.zohocdn.com",
// ];

// const scriptSrc = [
//   "'self'",
//   "https://*.googleapis.com",
//   "https://*.google.com",
//   "https://www.googletagmanager.com",
//   "https://maps.googleapis.com",
//   "https://maps.gstatic.com",
// ];

// const connectSrc = [
//   "'self'",
//   "https://api.fms.mobily.saferoad.net",
//   "wss://socketio.fms.mobily.saferoad.net",
//   "wss://socketio.fms.saferoad.net",
//   "https://www.google-analytics.com",
//   "https://*.googleapis.com",
//   "https://*.google.com",
//   "https://maps.googleapis.com",
//   "https://maps.gstatic.com",
// ];

// const imageSrc = [
//   "'self'",
//   "data:",
//   "blob:",
//   "https://res.cloudinary.com",
//   "https://*.googleapis.com",
//   "https://*.gstatic.com",
//   "https://maps.googleapis.com",
//   "https://maps.gstatic.com",
// ];

// const fontSrc = [
//   "'self'",
//   "data:",
//   "https://fonts.gstatic.com",
//   "https://cdnjs.cloudflare.com",
//   "https://stackpath.bootstrapcdn.com",
//   "https://css.zohocdn.com",
// ];
// export function middleware(request) {
//   const nonce = generateNonce();
//   const response = NextResponse.next();

//   // 1. CONSTRUCT THE CSP STRING, integrating the dynamic nonce
//   const csp = `
//         default-src 'self';
//         object-src 'none';
//         base-uri 'self';
//         frame-ancestors 'self';
//         upgrade-insecure-requests;
//         form-action 'self';

//         script-src ${scriptSrc} 'nonce-${nonce}';
//         style-src ${styleSrc} 'nonce-${nonce}';
//         style-src-elem ${styleSrc} 'nonce-${nonce}';
//         img-src ${imageSrc};
//         connect-src ${connectSrc};
//         font-src ${fontSrc};
//         media-src 'self'; // Fixes CSP Fallback issue
//         manifest-src 'self'; // Fixes CSP Fallback issue

//         frame-src 'self' https://*.google.com;
//         worker-src 'self' blob:;
//         child-src 'self' blob:;
//     `
//     .replace(/\s+/g, " ")
//     .trim(); // Normalize whitespace

//   // 2. SET ALL SECURITY HEADERS
//   response.headers.set("Content-Security-Policy", csp);
//   response.headers.set("X-Frame-Options", "SAMEORIGIN");
//   response.headers.set("X-Content-Type-Options", "nosniff");
//   response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
//   response.headers.set("X-XSS-Protection", "1; mode=block");
//   response.headers.set("X-Powered-By", "");
//   response.headers.set(
//     "Permissions-Policy",
//     "camera=(), microphone=(), geolocation=()"
//   );

//   // Stricter Cross-Origin Headers for Production (Addressing Cross-Domain Misconfiguration)
//   response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
//   response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

//   // 3. SET THE NONCE IN A COOKIE for _document.js to use
//   response.cookies.set("script-nonce", nonce, {
//     httpOnly: true,
//     maxAge: 60,
//     path: "/",
//     secure: true,
//     sameSite: "strict",
//   });

//   return response;
// }

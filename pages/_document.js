// import Document, { Html, Head, Main, NextScript } from "next/document";

// class MyDocument extends Document {
//   static async getInitialProps(ctx) {
//     const initialProps = await Document.getInitialProps(ctx);
//     return { ...initialProps, locale: ctx?.locale || "en" };
//   }

//   render() {
//     const isProduction = process.env.NODE_ENV === "production";
//     const clarityID = process.env.NEXT_PUBLIC_CLARITY_ID;
//     return (
//       <Html
//         dir={this.props.locale === "ar" ? "rtl" : "ltr"}
//         lang={this.props.locale}>
//         <Head>
//           <link rel="shortcut icon" href="/favicon.ico" />
//           <link rel="preconnect" href="https://fonts.googleapis.com" />
//           <link rel="preconnect" href="https://fonts.gstatic.com" />
//           <link
//             href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap"
//             rel="stylesheet"
//           />
//           <link
//             rel="stylesheet"
//             href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
//             integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
//             crossOrigin="anonymous"
//             referrerPolicy="no-referrer"
//           />
//           <link
//             rel="stylesheet"
//             type="text/css"
//             href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
//           />
//           {/* Load Clarity script only in production */}
//           {isProduction && clarityID && (
//             <>
//               <script
//                 type="text/javascript"
//                 dangerouslySetInnerHTML={{
//                   __html: `
//                 (function(c,l,a,r,i,t,y){
//                   c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
//                   t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
//                   y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
//                 })(window, document, "clarity", "script", "${clarityID}");
//                 `,
//                 }}
//               />
//               <script
//                 async
//                 src={`https://www.googletagmanager.com/gtag/js?id=G-V3S8895Y82`}></script>
//               <script
//                 dangerouslySetInnerHTML={{
//                   __html: `
//                 window.dataLayer = window.dataLayer || [];
//                 function gtag(){dataLayer.push(arguments);}
//                 gtag('js', new Date());
//                 gtag('config', 'G-V3S8895Y82');
//               `,
//                 }}
//               />
//             </>
//           )}
//         </Head>
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }

// export default MyDocument;

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, locale: ctx?.locale || "en" };
  }

  render() {
    const isProduction = process.env.NODE_ENV === "production";
    const clarityID = process.env.NEXT_PUBLIC_CLARITY_ID;
    return (
      <Html
        dir={this.props.locale === "ar" ? "rtl" : "ltr"}
        lang={this.props.locale}
      >
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          /> */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
            integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          />
          {/* Load Clarity script only in production */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.$zoho=window.$zoho||{};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`,
            }}
          />
          <script
            id="zsiqscript"
            src="https://salesiq.zoho.com/widget?wc=siqafbecdd73009757c0f4d341614b6d2bc64b57ca334e6134664a76932173e11caa9ec28430f7ea12a0c2a3fb1d0a131d0"
            defer
          />
          {isProduction && clarityID && (
            <>
              <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                  __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityID}");
                `,
                }}
              />
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=G-V3S8895Y82`}
              ></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-V3S8895Y82');
              `,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

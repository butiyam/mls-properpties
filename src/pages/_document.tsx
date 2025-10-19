import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-167x167.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-180x180.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
      <meta name="theme-color" content="#1a1f2b" />
      <meta name="twitter:image" content="https://www.obrglobal.com/logo.png" />
      <meta name="twitter:description" content="At Oak Brook Realty, we redefine the art of real estate. With a curated portfolio of high-end residences in the world’s most sought-after destinations, ...we offer more than homes—we offer access to an extraordinary lifestyle." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Curators of Distinctive Living" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

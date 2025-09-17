import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from '../components/Header';
import HeroSlider from "@/components/HeroSlider";
import Footer from "@/components/Footer";


export default function App({ Component, pageProps }: AppProps) {
  return(
    <>
     <Header/>
     <HeroSlider/>
     <Component {...pageProps} />
     <Footer/>
     </>
  );
}

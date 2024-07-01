import type { Metadata } from "next";
import { Inter, Bad_Script, Roboto_Flex, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// const noto_serif = Noto_Serif({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-noto-serif",
// });
const playfairD = Playfair_Display({
  subsets: ["latin"],
  weight: ['400', '500', '600'],
  variable: '--font-playfair'
})

const badscript = Bad_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bad-script",
});

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto-flex",
});

export const metadata: Metadata = {
  title: "Weaviate Poetry Factory",
  description: "Creates the perfect verses to match your emotions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${badscript.variable} ${robotoFlex.variable} ${playfairD.variable}`}>
        {children}
      </body>
    </html>
  );
}

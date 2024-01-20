import localFont from "next/font/local";
import { ClerkProvider } from '@clerk/nextjs'

import './globals.css'
import {Metadata} from "next";
import {ModalProvider} from "@/components/modal-provider";
import {EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";

const clash = localFont({
    src: [
        {
            path:'../public/fonts/ClashDisplay-Light.otf',
            weight: '100'
        },
        {
            path:'../public/fonts/ClashDisplay-Regular.otf',
            weight: '300'
        },
        {
            path:'../public/fonts/ClashDisplay-Medium.otf',
            weight: '500'
        },
        {
            path: '../public/fonts/ClashDisplay-Bold.otf',
            weight: '700'
        }
    ],
    variable: '--font-clash'
})

export const metadata: Metadata = {
    title: 'Vero GPT',
    description: 'A Chatbot for the vero.fi website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <ClerkProvider>
        <html lang="en">
         <body className={`${clash.variable} font-sans`}>

            <ModalProvider/>
            {children}
         </body>
        </html>
      </ClerkProvider>
  )
}
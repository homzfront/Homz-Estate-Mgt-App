import './globals.css'
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AbilityProvider } from '@/contexts/AbilityContext';

const plus_Jakarta_Sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Homz",
  description: "Homzng is a integrated estate management platform for property managers, Landlords & Tenants",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plus_Jakarta_Sans.className}
      >
        <Toaster
          toastOptions={{
            // Default options for all toasts
            style: {
              fontFamily: 'inherit',
              fontSize: '14px',
            },
            // Default duration
            duration: 4000,
          }}
        />
        <AbilityProvider>
          {children}
        </AbilityProvider>
      </body>
    </html>
  );
}
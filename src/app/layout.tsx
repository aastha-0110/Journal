
import { ThemeProvider as NextThemesProvider } from "next-themes";
import './globals.css'  // in layout.tsx


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextThemesProvider
          attribute="class"          // use `class` on <html> for theme switching
          defaultTheme="system"      // default to system theme if no saved preference
          enableSystem={true}        // enable system preference detection
          disableTransitionOnChange  // disables CSS transitions during theme toggle to reduce flicker
        >
          {children}
        </NextThemesProvider>
      </body>
    </html>  );
}

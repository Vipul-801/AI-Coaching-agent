import "./globals.css";
import Provider from "./provider";
import { StackTheme, StackProvider } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Toaster } from "sonner";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Provider>
              {children}
              <Toaster/>
            </Provider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}

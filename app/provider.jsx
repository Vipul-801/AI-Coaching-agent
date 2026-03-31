"use client";

import React, { Suspense } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { stackClientApp } from "../stack/client";
import { UserProvider } from "./_context/UserContext";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function Provider({ children }) {
  // Try to attach Stack-provided Convex auth if available on the client app.
  try {
    const auth = stackClientApp?.getConvexClientAuth?.({});
    if (auth) convex.setAuth(auth);
  } catch (e) {
    // ignore in environments where stackClientApp isn't available
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UserProvider>
        <ConvexProvider client={convex}>
          {children}
        </ConvexProvider>
      </UserProvider>
    </Suspense>
  );
}

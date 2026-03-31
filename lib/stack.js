import { createStackApp } from "@stackframe/stack";

export const stackClientApp = createStackApp({
  appId: "301606a2-f3d8-495e-b340-217ed9773c4a",
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
});

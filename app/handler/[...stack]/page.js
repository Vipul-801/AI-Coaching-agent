import { StackHandler } from "@stackframe/stack";

export default async function Handler(props) {
  const { getStackServerApp } = await import("../../../stack");
  const stackServerApp = await getStackServerApp();

  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
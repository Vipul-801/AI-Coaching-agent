import { StackHandler } from "@stackframe/stack";

export default async function Handler(props) {
  const { stackServerApp } = await import("../../../stack");

  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
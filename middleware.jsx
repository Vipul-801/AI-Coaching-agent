import { StackServerApp } from "@stackframe/stack";
import { NextResponse } from "next/server";

const stackServerApp = new StackServerApp();

export async function middleware(request){

  const user = await stackServerApp.getUser(request);

  if (!user){
    return NextResponse.redirect(new URL('/handler/sign-in', request.url));
  }
  return NextResponse.next();
}
export const config={
  matcher: ['/protected/:path*'],
}
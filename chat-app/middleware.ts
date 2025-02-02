import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  //   console.log("Middleware called",req);
  return NextResponse.next();
}

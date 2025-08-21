import { connectDb } from "@/lib/ConnectDb";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDb();
  return NextResponse.json({
    success: true,
    messsage: "coonection Successed",
  });
}

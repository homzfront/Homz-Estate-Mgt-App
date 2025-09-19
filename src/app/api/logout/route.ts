import { deleteToken } from "@/utils/cookies"
import { NextResponse } from "next/server";


export async function POST() {
  await deleteToken();
  return NextResponse.json({ success: true });
};

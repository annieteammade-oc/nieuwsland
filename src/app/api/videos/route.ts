import { NextResponse } from "next/server";
import { getAllVideos } from "@/lib/news";

export const revalidate = 300;

export async function GET() {
  const videos = await getAllVideos();
  return NextResponse.json({ videos });
}

"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/types";

function getYoutubeThumbnail(url: string): string | null {
  try {
    const parsed = new URL(url);
    let id: string | null = null;
    if (parsed.hostname.includes("youtu.be")) {
      id = parsed.pathname.replace("/", "");
    } else if (parsed.hostname.includes("youtube.com")) {
      id = parsed.searchParams.get("v") ?? parsed.pathname.replace("/embed/", "").split("/")[0] ?? null;
    }
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } catch {}
  return null;
}

function getVideoThumbnail(item: Article): string | null {
  if (item.image_url) return item.image_url;
  if (item.youtube_url) return getYoutubeThumbnail(item.youtube_url);
  return null;
}

function toYoutubeEmbed(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return url;
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {}
  return url;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Article[]>([]);
  const [activeVideo, setActiveVideo] = useState<Article | null>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => setVideos(data.videos ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#1E3A8A] to-blue-700 p-7 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-100">Archief</p>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">Video's</h1>
        <p className="mt-3 max-w-3xl text-sm text-blue-50">Alle video's op Nieuwsland.be</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => {
          const thumb = getVideoThumbnail(video);
          return (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideo(video)}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="relative aspect-video bg-slate-800">
                {thumb ? (
                  <img src={thumb} alt={video.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="rounded-full bg-white/90 px-5 py-2 text-sm font-bold text-slate-900 shadow">
                    ▶ Play
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-black uppercase leading-tight tracking-tight text-slate-900">{video.title}</p>
                {video.excerpt ? <p className="mt-2 text-xs text-slate-500 line-clamp-2">{video.excerpt}</p> : null}
              </div>
            </button>
          );
        })}
      </div>

      {videos.length === 0 && (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Nog geen video's beschikbaar.
        </p>
      )}

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="absolute inset-0" onClick={() => setActiveVideo(null)} aria-hidden />
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Video</p>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-slate-900"
              >
                Sluiten
              </button>
            </div>
            <div className="bg-slate-900 p-4">
              <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-black">
                {activeVideo.youtube_url ? (
                  <div className="aspect-video">
                    <iframe
                      className="h-full w-full"
                      src={toYoutubeEmbed(activeVideo.youtube_url)}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : activeVideo.video_url ? (
                  <div className="aspect-video">
                    <video className="h-full w-full" controls src={activeVideo.video_url} />
                  </div>
                ) : null}
              </div>
              <div className="mt-4 text-white">
                <h3 className="text-lg font-black uppercase tracking-tight">{activeVideo.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

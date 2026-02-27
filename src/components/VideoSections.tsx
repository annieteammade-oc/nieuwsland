"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/lib/types";

type VideoSource = {
  type: "youtube" | "video";
  url: string;
};

function toYoutubeEmbed(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }
      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }
  } catch {
    return url;
  }
  return url;
}

function getVideoSource(item: Article): VideoSource | null {
  if (item.youtube_url) {
    return { type: "youtube", url: toYoutubeEmbed(item.youtube_url) };
  }
  if (item.video_url) {
    return { type: "video", url: item.video_url };
  }
  return null;
}

function getYoutubeThumbnail(url: string): string | null {
  try {
    const parsed = new URL(url);
    let id: string | null = null;
    if (parsed.hostname.includes("youtu.be")) {
      id = parsed.pathname.replace("/", "");
    } else if (parsed.hostname.includes("youtube.com")) {
      id = parsed.searchParams.get("v") ?? parsed.pathname.replace("/embed/", "").split("/")[0] ?? null;
    }
    if (id) {
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
  } catch {
    // ignore
  }
  return null;
}

function getVideoThumbnail(item: Article): string | null {
  if (item.image_url) return item.image_url;
  if (item.youtube_url) return getYoutubeThumbnail(item.youtube_url);
  return null;
}

function VideoModal({ video, onClose }: { video: Article | null; onClose: () => void }) {
  const source = useMemo(() => (video ? getVideoSource(video) : null), [video]);

  if (!video || !source) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Video</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-all duration-300 hover:scale-105 hover:border-slate-400 hover:text-slate-900"
          >
            Sluiten
          </button>
        </div>
        <div className="bg-slate-900 p-4">
          <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-black">
            {source.type === "youtube" ? (
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={source.url}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video">
                <video className="h-full w-full" controls src={source.url} />
              </div>
            )}
          </div>
          <div className="mt-4 text-white">
            <p className="text-xs uppercase tracking-wide text-orange-200">Nieuwsland Video</p>
            <h3 className="mt-1 text-lg font-black uppercase tracking-tight">{video.title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoShorts({ videos }: { videos: Article[] }) {
  const [activeVideo, setActiveVideo] = useState<Article | null>(null);

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setActiveVideo(video)}
            className="group min-w-[190px] max-w-[190px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="relative aspect-[9/16] bg-slate-800">
              {getVideoThumbnail(video) ? (
                <img src={getVideoThumbnail(video)!} alt={video.title} className="absolute inset-0 h-full w-full object-cover" />
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-900">
                  Play
                </span>
              </div>
            </div>
            <p className="p-3 text-sm font-black uppercase leading-tight tracking-tight text-slate-900">{video.title}</p>
          </button>
        ))}
      </div>
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}

export function VideoGallery({
  lead,
  items,
}: {
  lead: Article;
  items: Article[];
}) {
  const [activeVideo, setActiveVideo] = useState<Article | null>(null);

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <button
          type="button"
          onClick={() => setActiveVideo(lead)}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm"
        >
          <div className="relative h-[320px] bg-slate-800">
            {getVideoThumbnail(lead) ? (
              <img src={getVideoThumbnail(lead)!} alt={lead.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="rounded-full bg-white/90 px-5 py-2 text-sm font-bold text-slate-900">Play</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xl font-black uppercase tracking-tight text-slate-900">{lead.title}</p>
            <p className="mt-2 text-sm text-slate-500">{lead.excerpt}</p>
          </div>
        </button>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveVideo(item)}
              className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm"
            >
              <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
                {getVideoThumbnail(item) ? (
                  <img src={getVideoThumbnail(item)!} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-900">
                    Play
                  </span>
                </div>
              </div>
              <p className="text-sm font-black uppercase leading-tight tracking-tight text-slate-900">{item.title}</p>
            </button>
          ))}
        </div>
      </div>
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}

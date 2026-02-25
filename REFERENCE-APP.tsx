/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Newspaper, 
  Download, 
  RefreshCw, 
  Palette, 
  Layout, 
  Type, 
  Sparkles,
  CheckCircle2,
  Loader2,
  Globe
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const LogoVector = ({ 
  variant = 'default', 
  className = '',
  hideIcon = false,
  hideTagline = false
}: { 
  variant?: 'default' | 'monochrome' | 'white' | 'accent' | 'stacked';
  className?: string;
  hideIcon?: boolean;
  hideTagline?: boolean;
}) => {
  const isStacked = variant === 'stacked';
  
  const colors = {
    default: {
      text: 'text-slate-900',
      accent: 'text-orange-500',
      icon: 'bg-blue-900 text-white',
      dot: 'bg-orange-500'
    },
    monochrome: {
      text: 'text-slate-900',
      accent: 'text-slate-900',
      icon: 'bg-slate-900 text-white',
      dot: 'bg-slate-900'
    },
    white: {
      text: 'text-white',
      accent: 'text-white',
      icon: 'bg-white text-blue-900',
      dot: 'bg-white'
    },
    accent: {
      text: 'text-blue-900',
      accent: 'text-blue-700',
      icon: 'bg-orange-500 text-white',
      dot: 'bg-blue-900'
    }
  }[variant === 'stacked' ? 'default' : variant];

  return (
    <div className={cn(
      "flex items-center gap-3 font-sans", 
      isStacked ? "flex-col text-center" : "flex-row",
      className
    )}>
      {!hideIcon && (
        <div className={cn(
          "flex items-center justify-center rounded-lg shadow-sm transition-transform hover:scale-105",
          isStacked ? "w-16 h-16" : "w-10 h-10",
          colors.icon
        )}>
          <Newspaper size={isStacked ? 32 : 20} strokeWidth={2.5} />
        </div>
      )}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span className={cn(
            "font-black tracking-tighter uppercase",
            isStacked ? "text-4xl" : "text-2xl",
            colors.text
          )}>
            Nieuws
          </span>
          <span className={cn(
            "font-light tracking-tight italic",
            isStacked ? "text-4xl ml-1" : "text-2xl ml-0.5",
            colors.accent
          )}>
            land
          </span>
          <div className={cn(
            "rounded-full ml-1",
            isStacked ? "w-2 h-2" : "w-1.5 h-1.5",
            colors.dot
          )} />
        </div>
        {!isStacked && !hideTagline && (
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-50 -mt-0.5">
            België & Wereld
          </span>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateAiLogo = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: 'A professional, modern, minimalist logo for a news website called "Nieuwsland". The logo should feature a stylized newspaper or globe icon combined with clean typography. Colors: Deep navy blue and vibrant orange. High-end corporate identity style, flat design, vector aesthetic, white background.',
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (err) {
      console.error(err);
      setError("Er is iets misgegaan bij het genereren van het logo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <LogoVector />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-900 transition-colors">Concept</a>
            <a href="#" className="hover:text-blue-900 transition-colors">Variaties</a>
            <a href="#" className="hover:text-blue-900 transition-colors">AI Generator</a>
          </nav>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95"
          >
            <Download size={16} />
            <span>Brand Kit</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Nieuwe Identiteit</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900">
            Nieuwsland<span className="text-orange-500">.</span>be
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Een moderne, betrouwbare en dynamische visuele identiteit voor het toonaangevende nieuwsplatform van België.
          </p>
        </section>

        {/* Logo Variations Grid */}
        <section className="space-y-12">
          <div className="flex items-center gap-3">
            <Layout className="text-blue-600" />
            <h2 className="text-2xl font-bold">Logo Variaties</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Primary */}
            <div className="group p-12 bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-8 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
              <LogoVector className="scale-125" />
              <div className="text-center space-y-1">
                <p className="text-sm font-bold">Primair Logo</p>
                <p className="text-xs text-slate-400">Voor algemeen gebruik op lichte achtergronden.</p>
              </div>
            </div>

            {/* Dark Mode */}
            <div className="group p-12 bg-slate-900 rounded-3xl flex flex-col items-center justify-center gap-8 hover:shadow-xl transition-all">
              <LogoVector variant="white" className="scale-125" />
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-white">Dark Mode</p>
                <p className="text-xs text-slate-500">Geoptimaliseerd voor donkere interfaces.</p>
              </div>
            </div>

            {/* Monochrome */}
            <div className="group p-12 bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-8 hover:shadow-xl transition-all">
              <LogoVector variant="monochrome" className="scale-125" />
              <div className="text-center space-y-1">
                <p className="text-sm font-bold">Monochroom</p>
                <p className="text-xs text-slate-400">Voor print en minimalistische toepassingen.</p>
              </div>
            </div>

            {/* Stacked */}
            <div className="group p-12 bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-8 hover:shadow-xl transition-all lg:col-span-2">
              <LogoVector variant="stacked" />
              <div className="text-center space-y-1">
                <p className="text-sm font-bold">Gestapeld Logo</p>
                <p className="text-xs text-slate-400">Ideaal voor social media profielen en vierkante formaten.</p>
              </div>
            </div>

            {/* Accent */}
            <div className="group p-12 bg-orange-50 rounded-3xl border border-orange-100 flex flex-col items-center justify-center gap-8 hover:shadow-xl transition-all">
              <LogoVector variant="accent" className="scale-125" />
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-orange-900">Accent Variatie</p>
                <p className="text-xs text-orange-600/60">Voor speciale campagnes en branding.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Minimal Versions Section */}
        <section className="space-y-12">
          <div className="flex items-center gap-3">
            <Type className="text-blue-600" />
            <h2 className="text-2xl font-bold">Minimalistische Versies (Geen Icon/Onderschrift)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Minimal Primary */}
            <div className="group p-12 bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-8 hover:shadow-xl transition-all">
              <LogoVector hideIcon hideTagline className="scale-150" />
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm font-bold">Minimal Primair</p>
                  <p className="text-xs text-slate-400">Alleen tekst, primair kleurenpalet.</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={() => {
                      const svg = `<svg width="400" height="120" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                        <rect width="200" height="60" fill="white"/>
                        <text x="10" y="45" font-family="Inter, sans-serif" font-weight="900" font-size="32" fill="#0F172A" style="text-transform: uppercase; letter-spacing: -0.05em;">NIEUWS</text>
                        <text x="135" y="45" font-family="Inter, sans-serif" font-weight="300" font-size="32" font-style="italic" fill="#F97316" style="letter-spacing: -0.02em;">land</text>
                        <circle cx="192" cy="40" r="3" fill="#F97316" />
                      </svg>`;
                      const blob = new Blob([svg], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'nieuwsland-minimal-primair.svg';
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Download SVG
                  </button>
                  <button 
                    onClick={() => {
                      const canvas = document.createElement('canvas');
                      canvas.width = 800;
                      canvas.height = 240;
                      const ctx = canvas.getContext('2d');
                      if (!ctx) return;
                      
                      ctx.fillStyle = 'white';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      
                      ctx.font = '900 128px Inter, sans-serif';
                      ctx.fillStyle = '#0F172A';
                      ctx.fillText('NIEUWS', 40, 180);
                      
                      ctx.font = '300 italic 128px Inter, sans-serif';
                      ctx.fillStyle = '#F97316';
                      ctx.fillText('land', 540, 180);
                      
                      ctx.beginPath();
                      ctx.arc(770, 160, 12, 0, Math.PI * 2);
                      ctx.fillStyle = '#F97316';
                      ctx.fill();
                      
                      const link = document.createElement('a');
                      link.download = 'nieuwsland-minimal-primair.png';
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Download PNG
                  </button>
                </div>
              </div>
            </div>

            {/* Minimal Dark */}
            <div className="group p-12 bg-slate-900 rounded-3xl flex flex-col items-center justify-center gap-8 hover:shadow-xl transition-all">
              <LogoVector variant="white" hideIcon hideTagline className="scale-150" />
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm font-bold text-white">Minimal Darkmode</p>
                  <p className="text-xs text-slate-500">Alleen tekst, wit/accent op donker.</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={() => {
                      const svg = `<svg width="400" height="120" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                        <rect width="200" height="60" fill="#0F172A"/>
                        <text x="10" y="45" font-family="Inter, sans-serif" font-weight="900" font-size="32" fill="#FFFFFF" style="text-transform: uppercase; letter-spacing: -0.05em;">NIEUWS</text>
                        <text x="135" y="45" font-family="Inter, sans-serif" font-weight="300" font-size="32" font-style="italic" fill="#FFFFFF" style="letter-spacing: -0.02em;">land</text>
                        <circle cx="192" cy="40" r="3" fill="#FFFFFF" />
                      </svg>`;
                      const blob = new Blob([svg], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'nieuwsland-minimal-dark.svg';
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-bold hover:bg-white/20 transition-colors"
                  >
                    Download SVG
                  </button>
                  <button 
                    onClick={() => {
                      const canvas = document.createElement('canvas');
                      canvas.width = 800;
                      canvas.height = 240;
                      const ctx = canvas.getContext('2d');
                      if (!ctx) return;
                      
                      ctx.fillStyle = '#0F172A';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      
                      ctx.font = '900 128px Inter, sans-serif';
                      ctx.fillStyle = '#FFFFFF';
                      ctx.fillText('NIEUWS', 40, 180);
                      
                      ctx.font = '300 italic 128px Inter, sans-serif';
                      ctx.fillStyle = '#FFFFFF';
                      ctx.fillText('land', 540, 180);
                      
                      ctx.beginPath();
                      ctx.arc(770, 160, 12, 0, Math.PI * 2);
                      ctx.fillStyle = '#FFFFFF';
                      ctx.fill();
                      
                      const link = document.createElement('a');
                      link.download = 'nieuwsland-minimal-dark.png';
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                    }}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
                  >
                    Download PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Elements */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Colors */}
          <div className="space-y-8 bg-white p-10 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-3">
              <Palette className="text-blue-600" />
              <h2 className="text-2xl font-bold">Kleurenpalet</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="h-24 bg-blue-900 rounded-2xl shadow-inner" />
                <div>
                  <p className="font-bold text-sm">Deep Navy</p>
                  <p className="text-xs font-mono text-slate-400">#1E3A8A</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-24 bg-orange-500 rounded-2xl shadow-inner" />
                <div>
                  <p className="font-bold text-sm">Action Orange</p>
                  <p className="text-xs font-mono text-slate-400">#F97316</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-24 bg-slate-900 rounded-2xl shadow-inner" />
                <div>
                  <p className="font-bold text-sm">Ink Black</p>
                  <p className="text-xs font-mono text-slate-400">#0F172A</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-24 bg-slate-100 rounded-2xl shadow-inner border border-slate-200" />
                <div>
                  <p className="font-bold text-sm">Paper White</p>
                  <p className="text-xs font-mono text-slate-400">#F1F5F9</p>
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-8 bg-white p-10 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-3">
              <Type className="text-blue-600" />
              <h2 className="text-2xl font-bold">Typografie</h2>
            </div>
            <div className="space-y-6">
              <div className="pb-6 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Display Font</p>
                <p className="text-4xl font-black tracking-tighter uppercase text-slate-900">Inter Black</p>
                <p className="text-sm text-slate-500 mt-1">Krachtig, scannable en modern.</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Body Font</p>
                <p className="text-2xl font-medium text-slate-700 italic">Inter Light Italic</p>
                <p className="text-sm text-slate-500 mt-1">Elegant, menselijk en leesbaar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Generator Section */}
        <section id="ai-generator" className="relative overflow-hidden bg-slate-900 rounded-[40px] p-12 md:p-20 text-white">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-orange-400" />
                <span>AI Concepten</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Genereer Alternatieve <br />
                <span className="text-orange-400">AI Concepten</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Gebruik de kracht van Gemini om direct nieuwe visuele richtingen te verkennen voor het Nieuwsland logo.
              </p>
              <button 
                onClick={generateAiLogo}
                disabled={isGenerating}
                className="group flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-orange-400 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" size={20} />
                )}
                <span>{isGenerating ? "Genereren..." : "Genereer Nieuw Concept"}</span>
              </button>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group">
                {generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="AI Generated Logo" 
                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center space-y-4 opacity-40 group-hover:opacity-60 transition-opacity">
                    <div className="w-20 h-20 rounded-full bg-white/10 mx-auto flex items-center justify-center">
                      <Sparkles size={32} />
                    </div>
                    <p className="text-sm font-medium">Klik op de knop om een AI logo te genereren</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-24 border-t border-slate-200 text-center space-y-8">
          <div className="flex flex-col items-center gap-4">
            <LogoVector className="opacity-50 grayscale" />
            <p className="text-sm text-slate-400 font-medium">
              © {new Date().getFullYear()} Nieuwsland.be Brand Identity System
            </p>
          </div>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>Vector Ready</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>Web Optimized</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>Print Ready</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

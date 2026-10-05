import React, { useRef, useState, useEffect } from "react";
import { Player, PlayerRef } from "@remotion/player";
import GraduationCollab from "./GraduationCollab";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Layers,
  Info,
  Gift,
  Camera,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  fromFrame: number;
  toFrame: number;
  durationFrames: number;
  startTime: string;
  endTime: string;
  category: "Opening" | "DeeGift" | "Fotera" | "Collab" | "Offer" | "CTA";
  color: string;
  description: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    title: "The Moment",
    subtitle: "Wisuda UNIGORO 2026 Opening",
    fromFrame: 0,
    toFrame: 190,
    durationFrames: 190,
    startTime: "00:00",
    endTime: "00:03.8",
    category: "Opening",
    color: "#641C2E",
    description: "Atmospheric editorial opening with ambient lighting, gold dust particles, and UNIGORO emblem.",
  },
  {
    id: 2,
    title: "DeeGift Showcase",
    subtitle: "Make The Moment Bloom",
    fromFrame: 190,
    toFrame: 375,
    durationFrames: 185,
    startTime: "00:03.8",
    endTime: "00:07.5",
    category: "DeeGift",
    color: "#83243B",
    description: "Cinematic reel footage of handmade fresh graduation botanicals.",
  },
  {
    id: 3,
    title: "Fresh Flowers",
    subtitle: "Real Botanical Gift",
    fromFrame: 375,
    toFrame: 575,
    durationFrames: 200,
    startTime: "00:07.5",
    endTime: "00:11.5",
    category: "DeeGift",
    color: "#A22C49",
    description: "High-fashion editorial layout featuring transparent fresh flower cutout hero objects.",
  },
  {
    id: 4,
    title: "Fotera Studio",
    subtitle: "Capture The Moment",
    fromFrame: 575,
    toFrame: 780,
    durationFrames: 205,
    startTime: "00:11.5",
    endTime: "00:15.6",
    category: "Fotera",
    color: "#173A8F",
    description: "Real graduation photography reel showing candid studio portraits and photobooth vibes.",
  },
  {
    id: 5,
    title: "Special Collaboration",
    subtitle: "Capture The Moment. Take Home A Fresh Flower.",
    fromFrame: 780,
    toFrame: 935,
    durationFrames: 155,
    startTime: "00:15.6",
    endTime: "00:18.7",
    category: "Collab",
    color: "#4F2B5E",
    description: "Editorial two-hero pairing: Real Fresh Flower Cutout directly beside Authentic Fotera Photo Output.",
  },
  {
    id: 6,
    title: "Special Offer",
    subtitle: "Rp30K • 1 Session Photobooth + Free Fresh Flower",
    fromFrame: 935,
    toFrame: 1050,
    durationFrames: 115,
    startTime: "00:18.7",
    endTime: "00:21.0",
    category: "Offer",
    color: "#B45309",
    description: "Primary offer reveal: Rp30K promotional bundle featuring 1 Session Photobooth + Free Fresh Flower.",
  },
  {
    id: 7,
    title: "Call to Action",
    subtitle: "Kunjungi Stan Kami",
    fromFrame: 1050,
    toFrame: 1200,
    durationFrames: 150,
    startTime: "00:21.0",
    endTime: "00:24.0",
    category: "CTA",
    color: "#111111",
    description: "Deliberate luxury campaign end card with large fresh flower, Fotera photo, and official CTA.",
  },
];

const PLAYER_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

interface VideoPreviewStageProps {
  playerRef: React.RefObject<PlayerRef | null>;
  totalFrames: number;
  fps: number;
  playbackRate: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentScene: Scene;
}

const VideoPreviewStage: React.FC<VideoPreviewStageProps> = React.memo(
  ({
    playerRef,
    totalFrames,
    fps,
    playbackRate,
    isPlaying,
    onTogglePlay,
    currentScene,
  }) => {
    return (
      <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border-4 border-stone-800 bg-black">
        {/* Top phone bezel speaker accent */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-stone-700/60 z-20 pointer-events-none" />

        {/* REMOTION PLAYER - FIXED ABSOLUTE INSET CONTAINER */}
        <div className="absolute inset-0 w-full h-full">
          <Player
            ref={playerRef}
            component={GraduationCollab}
            durationInFrames={totalFrames}
            compositionWidth={1080}
            compositionHeight={1920}
            fps={fps}
            playbackRate={playbackRate}
            style={PLAYER_STYLE}
            autoPlay={false}
            loop
            acknowledgeRemotionLicense
          />

          {/* OVERLAY PLAY TRIGGER IF PAUSED */}
          {!isPlaying && (
            <button
              onClick={onTogglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur text-white flex items-center justify-center transition border border-white/20 shadow-xl cursor-pointer"
              aria-label="Play video"
            >
              <Play className="w-8 h-8 translate-x-0.5 text-white" />
            </button>
          )}
        </div>

        {/* LIVE SCENE TAG OVERLAY */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-md bg-black/70 backdrop-blur text-white border border-white/10 shadow">
            Scene {currentScene.id}/7: {currentScene.title}
          </span>
        </div>
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.isPlaying === next.isPlaying &&
      prev.playbackRate === next.playbackRate &&
      prev.currentScene.id === next.currentScene.id
    );
  }
);

export const App: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"timeline" | "offer" | "specs">("timeline");
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const totalFrames = 1200;
  const fps = 50;

  useEffect(() => {
    let animId: number | null = null;
    let isAttached = false;
    let frameRafId: number | null = null;
    let cleanup: (() => void) | null = null;

    const attach = () => {
      const player = playerRef.current;
      if (!player) {
        animId = requestAnimationFrame(attach);
        return;
      }
      if (isAttached) return;
      isAttached = true;

      let lastReportedFrame = -1;
      let pendingFrame: number | null = null;

      const onFrameUpdate = (e: { detail: { frame: number } }) => {
        const frame = Math.round(e.detail.frame);
        if (frame !== lastReportedFrame) {
          lastReportedFrame = frame;
          pendingFrame = frame;
          if (frameRafId === null) {
            frameRafId = requestAnimationFrame(() => {
              frameRafId = null;
              if (pendingFrame !== null) {
                setCurrentFrame(pendingFrame);
              }
            });
          }
        }
      };

      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);

      player.addEventListener("frameupdate", onFrameUpdate);
      player.addEventListener("play", onPlay);
      player.addEventListener("pause", onPause);

      cleanup = () => {
        player.removeEventListener("frameupdate", onFrameUpdate);
        player.removeEventListener("play", onPlay);
        player.removeEventListener("pause", onPause);
      };
    };

    attach();

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      if (frameRafId !== null) cancelAnimationFrame(frameRafId);
      if (cleanup) cleanup();
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const handleSeek = (frame: number) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(frame);
    setCurrentFrame(frame);
  };

  const handleStep = (step: number) => {
    if (!playerRef.current) return;
    const nextFrame = Math.max(0, Math.min(totalFrames - 1, currentFrame + step));
    playerRef.current.seekTo(nextFrame);
    setCurrentFrame(nextFrame);
  };

  const handleRestart = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    playerRef.current.play();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unmute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  // Find active scene
  const currentScene = SCENES.find(
    (s) => currentFrame >= s.fromFrame && currentFrame < s.toFrame
  ) || SCENES[SCENES.length - 1];

  const formatTime = (frame: number) => {
    const totalSecs = Math.floor(frame / fps);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const dec = Math.floor(((frame % fps) / fps) * 10);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${dec}`;
  };

  const copyRenderCommand = () => {
    const cmd = "npx remotion render src/index.ts GraduationCollab out/graduation-collab.mp4";
    navigator.clipboard?.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-stone-200 flex flex-col font-sans">
      {/* TOP HEADER */}
      <header className="border-b border-stone-800 bg-[#141418]/90 backdrop-blur sticky top-0 z-50 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-base lg:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-[#e2a8b3]">DeeGift</span>
              <span className="text-stone-500 text-xs font-normal">×</span>
              <span className="text-[#89a7e0]">Fotera</span>
            </h1>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-stone-800 text-stone-300 border border-stone-700">
            Wisuda UNIGORO 2026
          </span>
          <span className="hidden md:inline-block px-2 py-0.5 text-[11px] font-mono rounded bg-red-950/60 text-red-300 border border-red-900/60">
            Remotion 4.0
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={copyRenderCommand}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition"
            title="Copy command to render MP4 video"
          >
            {copiedCmd ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Command Copied!</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Render CLI</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: VIDEO PLAYER STAGE */}
        <section className="lg:col-span-7 flex flex-col items-center">
          {/* PHONE FRAME PREVIEW STAGE */}
          <VideoPreviewStage
            playerRef={playerRef}
            totalFrames={totalFrames}
            fps={fps}
            playbackRate={playbackRate}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            currentScene={currentScene}
          />

          {/* PLAYER CONTROLS BAR */}
          <div className="w-full max-w-[440px] mt-4 p-3.5 bg-[#17171d] rounded-2xl border border-stone-800 flex flex-col gap-3 shadow-lg">
            {/* Progress & Timeline Scrubber */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono text-stone-400">
                <span className="text-white font-medium">{formatTime(currentFrame)}</span>
                <span className="text-[11px] text-stone-500">
                  Frame {currentFrame} / {totalFrames}
                </span>
                <span>00:24.0</span>
              </div>

              {/* Interactive Scrub Bar */}
              <div className="relative w-full group py-1">
                <input
                  type="range"
                  min={0}
                  max={totalFrames - 1}
                  value={currentFrame}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-stone-800 appearance-none cursor-pointer accent-[#83243B] focus:outline-none"
                />

                {/* Scene markers on timeline */}
                <div className="absolute top-1 left-0 right-0 h-2 pointer-events-none flex">
                  {SCENES.map((scene) => (
                    <div
                      key={scene.id}
                      style={{
                        left: `${(scene.fromFrame / totalFrames) * 100}%`,
                        width: `${(scene.durationFrames / totalFrames) * 100}%`,
                      }}
                      className="absolute h-full border-r border-stone-900/60"
                      title={scene.title}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleRestart}
                  className="p-2 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white transition"
                  title="Restart from beginning"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleStep(-25)}
                  className="p-2 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white transition"
                  title="Step back 25 frames (0.5s)"
                >
                  <Rewind className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-xl bg-[#641C2E] hover:bg-[#7b243a] text-white transition shadow"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 translate-x-0.5" />
                  )}
                </button>

                <button
                  onClick={() => handleStep(25)}
                  className="p-2 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white transition"
                  title="Step forward 25 frames (0.5s)"
                >
                  <FastForward className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white transition"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Speed selection */}
              <div className="flex items-center gap-1">
                {[0.5, 1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleRateChange(speed)}
                    className={`px-2 py-1 text-[11px] font-mono rounded-md transition ${
                      playbackRate === speed
                        ? "bg-stone-700 text-white font-bold"
                        : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: DETAILS, SCENES & INFO TABS */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          {/* TAB HEADERS */}
          <div className="flex p-1 bg-[#16161b] rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === "timeline"
                  ? "bg-[#641C2E] text-white shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Scenes (7)</span>
            </button>

            <button
              onClick={() => setActiveTab("offer")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === "offer"
                  ? "bg-[#173A8F] text-white shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Offer Details</span>
            </button>

            <button
              onClick={() => setActiveTab("specs")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === "specs"
                  ? "bg-stone-800 text-white shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Specs</span>
            </button>
          </div>

          {/* TAB CONTENT 1: SCENE TIMELINE */}
          {activeTab === "timeline" && (
            <div className="flex flex-col gap-2.5">
              <div className="text-xs text-stone-400 px-1 flex items-center justify-between">
                <span>Click any scene to jump immediately:</span>
                <span className="font-mono text-[11px] text-stone-500">20s • 600f</span>
              </div>

              <div className="space-y-2">
                {SCENES.map((scene) => {
                  const isActive = currentScene.id === scene.id;
                  return (
                    <div
                      key={scene.id}
                      onClick={() => handleSeek(scene.fromFrame)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? "bg-[#1e1b20] border-[#9b3a50] shadow-md shadow-red-950/20 translate-x-1"
                          : "bg-[#141418] border-stone-800 hover:border-stone-700 hover:bg-[#18181e]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                            isActive
                              ? "bg-[#641C2E] text-white"
                              : "bg-stone-800 text-stone-400"
                          }`}
                        >
                          {scene.id}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {scene.title}
                            </span>
                            {isActive && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-700/60">
                                Playing
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {scene.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-semibold text-stone-300">
                          {scene.startTime}
                        </span>
                        <ChevronRight className={`w-4 h-4 ml-auto mt-0.5 transition ${isActive ? "text-[#e2a8b3]" : "text-stone-600"}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: PROMO OFFER DETAILS */}
          {activeTab === "offer" && (
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#641C2E]/40 via-[#1c1822] to-[#173A8F]/30 border border-stone-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded">
                    Wisuda UNIGORO 2026 Special
                  </span>
                  <span className="text-xs text-stone-400">Collaboration</span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">Rp30K</span>
                  <span className="text-xs text-stone-400">/ complete bundle</span>
                </div>

                <div className="mt-2 flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white tracking-wide uppercase">1 Session Photobooth</span>
                  <span className="text-sm font-bold text-amber-200 tracking-wide uppercase">+ Free Fresh Flower</span>
                </div>

                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  Celebrate your graduation moment with Fotera photobooth experience and take home an authentic fresh flower gift for only Rp30K.
                </p>

                <div className="mt-4 space-y-2 border-t border-stone-700/60 pt-3">
                  <div className="flex items-center gap-2 text-xs text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>1× Photobooth Session</strong> by Fotera Studio</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>FREE 1× Authentic Fresh Flower</strong> by DeeGift</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Printed Souvenir Keepsake + High-Res Digital Softcopy</span>
                  </div>
                </div>
              </div>

              {/* BRAND PARTNERS */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#141418] border border-stone-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-[#d6a3ad]" />
                    <span className="text-xs font-bold text-white">DeeGift</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    Florist & fresh gift specialist for graduation celebrations, botanicals, and bespoke arrangements.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141418] border border-stone-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-[#89a7e0]" />
                    <span className="text-xs font-bold text-white">Fotera Studio</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    Professional photography and instant photobooths capturing unforgettable campus memories.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: SPECS & ASSETS */}
          {activeTab === "specs" && (
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-[#141418] border border-stone-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Remotion Composition Details
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
                    <span className="text-stone-500 block text-[11px]">Resolution</span>
                    <span className="font-mono font-bold text-white">1080 × 1920 (9:16)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
                    <span className="text-stone-500 block text-[11px]">Framerate</span>
                    <span className="font-mono font-bold text-white">50 FPS</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
                    <span className="text-stone-500 block text-[11px]">Duration</span>
                    <span className="font-mono font-bold text-white">24.0 seconds (1200f)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
                    <span className="text-stone-500 block text-[11px]">Format</span>
                    <span className="font-mono font-bold text-white">Reel / Story / Shorts</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800">
                  <span className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Typography Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-stone-800 text-[11px] text-stone-300">
                      Cormorant Garamond (Editorial Serif)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-800 text-[11px] text-stone-300">
                      Manrope (Modern Grotesk)
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800">
                  <span className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Export CLI Command:
                  </span>
                  <div className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-amber-200 break-all select-all">
                    npx remotion render src/index.ts GraduationCollab out/video.mp4
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;

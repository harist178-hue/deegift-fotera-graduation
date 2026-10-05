import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  Video,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

import {
  cormorant,
  cormorantItalic,
  manrope,
} from "./fonts";

const A = (file: string) => staticFile(`assets/${file}`);

/* =========================================================
   CAMPAIGN TIMELINE ARCHITECTURE
   24.0 Seconds • 50 FPS • 1200 Frames
========================================================= */
export const FPS = 50;
export const TOTAL_DURATION_SECONDS = 24.0;
export const TOTAL_FRAMES = 1200;

export const secToFrames = (seconds: number, fps = FPS): number =>
  Math.round(seconds * fps);

/* =========================================================
   LUXURY EDITORIAL COLOR PALETTE
========================================================= */
const MAROON = "#581525";
const MAROON_DEEP = "#3D0D18";
const CREAM = "#FAF6F0";
const CREAM_WARM = "#F4EFE7";
const BLUE_NAVY = "#13285C";
const BLUE_LIGHT = "#EEF3F9";
const CHARCOAL = "#141315";
const WHITE = "#FFFFFF";
const GREY_MUTED = "#827C78";
const GOLD = "#C9A050";
const GOLD_HAIRLINE = "rgba(201, 160, 80, 0.45)";

/* =========================================================
   FLUID EASING PHYSICS (MATHEMATICAL SMOOTHNESS)
   Avoids abrupt starts, linear jumps, or stuttery stops
========================================================= */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);

/* =========================================================
   TIME-BASED INTERPOLATION PRIMITIVES (SECONDS-DRIVEN)
   Stable regardless of framerate changes
========================================================= */

/**
 * Time-based opacity fade in
 */
const fadeInSec = (
  frame: number,
  startSec: number,
  durationSec = 0.45,
  fps = FPS,
) => {
  const start = Math.round(startSec * fps);
  const dur = Math.max(1, Math.round(durationSec * fps));
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutCubic,
  });
};

/**
 * Time-based slide up with luxury deceleration
 */
const slideUpSec = (
  frame: number,
  startSec: number,
  durationSec = 0.65,
  distance = 28,
  fps = FPS,
) => {
  const start = Math.round(startSec * fps);
  const dur = Math.max(1, Math.round(durationSec * fps));
  return interpolate(frame, [start, start + dur], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuart,
  });
};

/**
 * Time-based slow cinematic camera scale
 */
const slowScaleSec = (
  frame: number,
  startSec: number,
  durationSec: number,
  from = 1.03,
  to = 1.0,
  fps = FPS,
) => {
  const start = Math.round(startSec * fps);
  const dur = Math.max(1, Math.round(durationSec * fps));
  return interpolate(frame, [start, start + dur], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutSine,
  });
};

/**
 * Smooth continuous organic float (harmonic sinusoidal)
 */
const subtleDriftSec = (
  frame: number,
  startSec: number,
  cycleSec = 3.8,
  amplitude = 5,
  fps = FPS,
) => {
  const elapsed = Math.max(0, frame / fps - startSec);
  return Math.sin((elapsed * 2 * Math.PI) / cycleSec) * amplitude;
};

/* =========================================================
   PERFORMANCE-OPTIMIZED ATMOSPHERIC GROUNDING
   Replaces expensive Gaussian blur filters with radial gradients
   for zero-jank 50 FPS GPU compositing
========================================================= */
const AmbientGlow: React.FC<{
  left: number;
  top: number;
  size: number;
  color: string;
  opacity?: number;
}> = ({ left, top, size, color, opacity = 0.06 }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 72%)`,
      opacity,
      pointerEvents: "none",
      willChange: "opacity",
    }}
  />
);

const PaperTextureOverlay: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      backgroundImage: "radial-gradient(rgba(88, 21, 37, 0.04) 1px, transparent 0)",
      backgroundSize: "24px 24px",
      pointerEvents: "none",
      zIndex: 5,
    }}
  />
);

const SubtleGoldDust: React.FC<{
  frame: number;
  startSec: number;
  durationSec: number;
  fps?: number;
}> = ({ frame, startSec, durationSec, fps = FPS }) => {
  const start = Math.round(startSec * fps);
  const dur = Math.round(durationSec * fps);
  const fadeDur = Math.round(0.4 * fps);
  const local = Math.max(0, frame - start);

  const alpha = interpolate(
    local,
    [0, fadeDur, dur - fadeDur, dur],
    [0, 0.022, 0.022, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Img
      src={A("gold-dust.png")}
      style={{
        position: "absolute",
        left: -30,
        top: -30,
        width: "calc(100% + 60px)",
        height: "calc(100% + 60px)",
        objectFit: "cover",
        opacity: alpha,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 25,
      }}
    />
  );
};

const SubtleLensFlare: React.FC<{
  frame: number;
  startSec: number;
  fps?: number;
}> = ({ frame, startSec, fps = FPS }) => {
  const start = Math.round(startSec * fps);
  const local = Math.max(0, frame - start);
  const alpha = interpolate(
    local,
    [0, Math.round(0.1 * fps), Math.round(0.2 * fps), Math.round(0.4 * fps)],
    [0, 0.034, 0.02, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Img
      src={A("lens-flare.png")}
      style={{
        position: "absolute",
        left: -80,
        top: -60,
        width: "calc(100% + 160px)",
        height: "calc(100% + 120px)",
        objectFit: "cover",
        opacity: alpha,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 30,
      }}
    />
  );
};

/* =========================================================
   EDITORIAL TOP HEADER
   High-contrast, authoritative typography
========================================================= */
const EditorialHeader: React.FC<{
  chapter: string;
  category: string;
  frame: number;
  startSec?: number;
  dark?: boolean;
}> = ({ chapter, category, frame, startSec = 0, dark = false }) => (
  <div
    style={{
      position: "absolute",
      left: 72,
      right: 72,
      top: 56,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 80,
      opacity: fadeInSec(frame, startSec, 0.45),
      transform: `translate3d(0, ${slideUpSec(frame, startSec, 0.55, 10)}px, 0)`,
      willChange: "transform, opacity",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{
          fontFamily: manrope.fontFamily,
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: 5.5,
          color: dark ? "#FFFFFF" : MAROON,
          textTransform: "uppercase",
        }}
      >
        DEE.GIFT
      </span>
      <span
        style={{
          fontFamily: cormorant.fontFamily,
          fontSize: 18,
          color: dark ? "rgba(255,255,255,0.4)" : "#827C78",
          lineHeight: 1,
        }}
      >
        ×
      </span>
      <span
        style={{
          fontFamily: manrope.fontFamily,
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: 5.5,
          color: dark ? "#FFFFFF" : BLUE_NAVY,
          textTransform: "uppercase",
        }}
      >
        FOTERA
      </span>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: manrope.fontFamily,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 3.5,
        color: dark ? "rgba(255,255,255,0.7)" : GREY_MUTED,
        textTransform: "uppercase",
      }}
    >
      <span>{category}</span>
      <span style={{ opacity: 0.4 }}>•</span>
      <span style={{ color: dark ? "#FFFFFF" : CHARCOAL, fontWeight: 800 }}>{chapter}</span>
    </div>
  </div>
);

/* =========================================================
   PROMINENT LOGO LOCKUP COMPONENT (DEE.GIFT × FOTERA)
========================================================= */
const LogoPair: React.FC<{
  frame: number;
  startSec?: number;
  width?: number;
  logoSize?: number;
  dark?: boolean;
}> = ({ frame, startSec = 0.1, width, logoSize = 132, dark = false }) => {
  const size = logoSize || (width ? Math.round(width * 0.45) : 132);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        opacity: fadeInSec(frame, startSec, 0.45),
        transform: `scale(${slowScaleSec(frame, startSec, 0.7, 0.96, 1.0)})`,
        willChange: "transform, opacity",
      }}
    >
      <Img
        src={A("deegift-logo.png")}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          filter: dark ? "brightness(0) invert(1)" : "none",
          mixBlendMode: dark ? "screen" : "multiply",
        }}
      />

      <span
        style={{
          fontFamily: cormorant.fontFamily,
          fontSize: 28,
          color: GOLD,
          lineHeight: 1,
          padding: "0 2px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ×
      </span>

      <Img
        src={A("fotera.png")}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          filter: dark ? "brightness(0) invert(1)" : "none",
          mixBlendMode: dark ? "screen" : "multiply",
        }}
      />
    </div>
  );
};

/* =========================================================
   AUTHENTIC HERO FRESH FLOWER (LUXURY EDITORIAL PRODUCT OBJECT)
   - Real fresh flower transparent cutout asset treated as authentic hero product
   - Soft natural shadow, subtle ambient depth, restrained scale motion
   - Preserves 100% authentic flower, species, wrapping, and colours
========================================================= */
const HeroFreshFlower: React.FC<{
  src: string;
  frame: number;
  startSec: number;
  durationSec?: number;
  left?: number | string;
  right?: number | string;
  top?: number | string;
  bottom?: number | string;
  width?: number | string;
  height: number | string;
  rotate?: number;
  flipX?: boolean;
  zIndex?: number;
  parallaxSpeed?: number;
  position?: "absolute" | "relative";
  fps?: number;
}> = ({
  src,
  frame,
  startSec,
  durationSec = 3.6,
  left,
  right,
  top,
  bottom,
  width = "auto",
  height,
  rotate = 0,
  flipX = false,
  zIndex = 40,
  parallaxSpeed = 12,
  position = "absolute",
  fps = FPS,
}) => {
  // Restrained scale movement: subtle 1.018 -> 1.0 over duration
  const scale = slowScaleSec(frame, startSec, durationSec, 1.018, 1.0);
  const opacity = fadeInSec(frame, startSec, 0.4);
  const driftY = subtleDriftSec(frame, startSec, 3.6, 4);
  const driftX = subtleDriftSec(frame, startSec, 5.0, 2);

  const startFrame = Math.round(startSec * fps);
  const durFrames = Math.round(durationSec * fps);
  const parallax = interpolate(
    frame,
    [startFrame, startFrame + durFrames],
    [parallaxSpeed, -parallaxSpeed * 0.3],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOutCubic,
    },
  );

  return (
    <div
      style={{
        position,
        left,
        right,
        top,
        bottom,
        width,
        height,
        opacity,
        transform: `translate3d(${driftX}px, ${driftY + parallax}px, 0) scale(${scale}) rotate(${rotate}deg) ${flipX ? "scaleX(-1)" : ""}`,
        transformOrigin: "center bottom",
        // Soft natural ambient shadow - restrained, natural, elegant
        filter: "drop-shadow(0 20px 32px rgba(22, 10, 16, 0.16)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08))",
        zIndex,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    >
      <Img
        src={src}
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
};

/* =========================================================
   FINE-ART ARCHIVAL PHOTO FRAME (SMOOTH TIME-BASED MATTING)
   Museum matting with subtle rotational tilt
========================================================= */
const EditorialPhotoFrame: React.FC<{
  src: string;
  frame: number;
  startSec: number;
  durationSec?: number;
  left?: number | string;
  right?: number | string;
  top?: number | string;
  bottom?: number | string;
  width: number;
  height: number;
  rotate?: number;
  caption?: string;
  zIndex?: number;
  position?: "absolute" | "relative";
  fps?: number;
}> = ({
  src,
  frame,
  startSec,
  durationSec = 2.4,
  left,
  right,
  top,
  bottom,
  width,
  height,
  rotate = 0,
  caption,
  zIndex = 35,
  position = "absolute",
  fps = FPS,
}) => {
  const startFrame = Math.round(startSec * fps);
  const durFrames = Math.round(0.7 * fps);
  const rotation = interpolate(
    frame,
    [startFrame, startFrame + durFrames],
    [rotate + 1.2, rotate],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOutCubic,
    },
  );

  const opacity = fadeInSec(frame, startSec, 0.45);
  const slide = slideUpSec(frame, startSec, 0.65, 22);
  const scale = slowScaleSec(frame, startSec, durationSec, 0.965, 1.0);

  return (
    <div
      style={{
        position,
        left,
        right,
        top,
        bottom,
        width,
        height,
        padding: "16px 16px 38px 16px",
        boxSizing: "border-box",
        backgroundColor: WHITE,
        border: "1px solid rgba(20, 18, 20, 0.12)",
        boxShadow: "0 28px 55px rgba(12, 10, 14, 0.20)",
        opacity,
        transform: `translate3d(0, ${slide}px, 0) scale(${scale}) rotate(${rotation}deg)`,
        zIndex,
        willChange: "transform, opacity",
      }}
    >
      <div style={{ width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#F0EAE1" }}>
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {caption && (
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: manrope.fontFamily,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 3,
              color: "#6D6864",
              textTransform: "uppercase",
            }}
          >
            {caption}
          </span>
          <span
            style={{
              fontFamily: manrope.fontFamily,
              fontSize: 9,
              letterSpacing: 2.5,
              color: "#99928D",
            }}
          >
            WISUDA 2026
          </span>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   SCENE 01 — EDITORIAL OPENING (0.0 – 3.8s / 190 Frames @ 50fps)
   High-fashion discipline: Monumental hero bouquet (64% height),
   centered with 90px side breathing room, authoritative display typography
========================================================= */
const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraScale = slowScaleSec(frame, 0, 3.8, 1.025, 1.0);
  const cameraPan = interpolate(
    frame,
    [0, Math.round(3.8 * FPS)],
    [4, -4],
    { easing: easeOutCubic },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CREAM,
        overflow: "hidden",
        transform: `translate3d(0, ${cameraPan}px, 0) scale(${cameraScale})`,
      }}
    >
      <PaperTextureOverlay />
      <AmbientGlow left={-100} top={-60} size={780} color="#E0AAB5" opacity={0.06} />
      <SubtleGoldDust frame={frame} startSec={0.4} durationSec={3.4} />

      {/* LUXURY EDITORIAL INSET BORDER */}
      <div
        style={{
          position: "absolute",
          left: 48,
          right: 48,
          top: 48,
          bottom: 48,
          border: "1px solid rgba(88, 21, 37, 0.12)",
          pointerEvents: "none",
          zIndex: 10,
          opacity: fadeInSec(frame, 0.1, 0.45),
        }}
      />

      {/* TOP METADATA BAR */}
      <EditorialHeader chapter="01" category="PRELUDE" frame={frame} startSec={0} />

      {/* UNIGORO EMBLEM WITH EDITORIAL CAPTION */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 118,
          display: "flex",
          alignItems: "center",
          gap: 18,
          zIndex: 70,
          opacity: fadeInSec(frame, 0.2, 0.45),
          transform: `translate3d(0, ${slideUpSec(frame, 0.2, 0.5, 12)}px, 0)`,
        }}
      >
        <Img
          src={A("unigoro-logo.png")}
          style={{
            width: 88,
            height: 88,
            objectFit: "contain",
          }}
        />
        <div>
          <div
            style={{
              fontFamily: manrope.fontFamily,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 4,
              color: CHARCOAL,
              textTransform: "uppercase",
            }}
          >
            UNIVERSITAS BOJONEGORO
          </div>
          <div
            style={{
              fontFamily: cormorantItalic.fontFamily,
              fontSize: 20,
              color: MAROON,
              marginTop: 2,
            }}
          >
            Official Graduation Celebration 2026
          </div>
        </div>
      </div>

      {/* EDITORIAL DISPLAY HEADLINE */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 254,
          zIndex: 70,
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 6,
            color: MAROON,
            marginBottom: 14,
            opacity: fadeInSec(frame, 0.3, 0.4),
          }}
        >
          AN EXCLUSIVE COLLABORATION
        </div>

        <div
          style={{
            fontFamily: cormorant.fontFamily,
            fontSize: 124,
            fontWeight: 500,
            lineHeight: 0.86,
            letterSpacing: -2,
            color: CHARCOAL,
            opacity: fadeInSec(frame, 0.45, 0.5),
            transform: `translate3d(0, ${slideUpSec(frame, 0.45, 0.55, 22)}px, 0)`,
          }}
        >
          THE MOMENT
        </div>

        <div
          style={{
            marginTop: 6,
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 98,
            fontWeight: 400,
            lineHeight: 0.90,
            color: MAROON,
            opacity: fadeInSec(frame, 0.7, 0.55),
            transform: `translate3d(0, ${slideUpSec(frame, 0.7, 0.6, 22)}px, 0)`,
          }}
        >
          worth remembering forever.
        </div>
      </div>

      {/* PRIMARY HERO FRESH FLOWER — AUTHENTIC GRADUATION GIFT */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: -30,
          height: 1120,
          display: "flex",
          justifyContent: "center",
          zIndex: 40,
        }}
      >
        <HeroFreshFlower
          src={A("fresh-flower-01.png")}
          frame={frame}
          startSec={0.45}
          durationSec={3.35}
          height={1120}
          rotate={1}
          parallaxSpeed={14}
        />
      </div>

      {/* FOOTER METADATA WITH THIN RULE */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 80,
          opacity: fadeInSec(frame, 1.0, 0.45),
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 4,
            color: CHARCOAL,
          }}
        >
          WISUDA UNIGORO 2026
        </div>

        <div
          style={{
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 22,
            color: MAROON,
          }}
        >
          Fresh Floral Gift & Studio Photography
        </div>
      </div>

      <SubtleLensFlare frame={frame} startSec={2.0} />
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 02 — DEEGIFT HERO FILM (3.8 – 7.5s / 185 Frames @ 50fps)
   Cinematic fashion film moment with editorial letterbox matte
========================================================= */
const DeeGiftVideoScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CHARCOAL,
        overflow: "hidden",
      }}
    >
      {/* VIDEO LAYER WITH SUBTLE CAMERA PUSH */}
      <Video
        src={A("deegift-video.mp4")}
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${slowScaleSec(frame, 0, 3.7, 1.028, 1.0)})`,
        }}
      />

      {/* LUXURY EDITORIAL GRADIENT VEIL */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(16,12,14,0.72) 0%, rgba(20,10,16,0.12) 42%, rgba(14,10,12,0.88) 100%)",
        }}
      />

      {/* EDITORIAL INSET BORDER */}
      <div
        style={{
          position: "absolute",
          left: 48,
          right: 48,
          top: 48,
          bottom: 48,
          border: "1px solid rgba(255,255,255,0.15)",
          pointerEvents: "none",
          zIndex: 20,
          opacity: fadeInSec(frame, 0, 0.4),
        }}
      />

      {/* TOP HEADER */}
      <EditorialHeader chapter="02" category="FLORAL ATELIER" frame={frame} startSec={0} dark />

      {/* UPPER BRAND STAMP */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 124,
          zIndex: 70,
          opacity: fadeInSec(frame, 0.25, 0.45),
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 5,
            color: "#E5B6BE",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          FLORAL ATELIER BOJONEGORO
        </div>
        <Img
          src={A("deegift-logo.png")}
          style={{
            width: 230,
            height: 230 * 0.38,
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>

      {/* BOTTOM HEADLINE */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 96,
          zIndex: 70,
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 5.5,
            color: "#E5B6BE",
            marginBottom: 10,
            opacity: fadeInSec(frame, 0.35, 0.4),
          }}
        >
          CURATED GRADUATION COLLECTION
        </div>

        <div
          style={{
            fontFamily: cormorant.fontFamily,
            fontSize: 104,
            fontWeight: 400,
            lineHeight: 0.88,
            color: WHITE,
            opacity: fadeInSec(frame, 0.45, 0.5),
            transform: `translate3d(0, ${slideUpSec(frame, 0.45, 0.55, 20)}px, 0)`,
          }}
        >
          Make the moment
        </div>

        <div
          style={{
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 112,
            fontWeight: 400,
            lineHeight: 0.88,
            color: "#E2A4B0",
            opacity: fadeInSec(frame, 0.65, 0.5),
            transform: `translate3d(0, ${slideUpSec(frame, 0.65, 0.55, 20)}px, 0)`,
          }}
        >
          bloom forever.
        </div>

        <div
          style={{
            marginTop: 18,
            width: 80,
            height: 1,
            backgroundColor: GOLD,
            opacity: fadeInSec(frame, 0.85, 0.35),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 03 — PURE DEEGIFT MOTION SPREAD (7.5 – 11.5s / 200 Frames @ 50fps)
   - Real authentic fresh flower hero object
   - Centered with 90px side breathing room
   - Deep background bokeh depth fresh flower
   - Asymmetric luxury editorial typography
========================================================= */
const DeeGiftMotionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraScale = slowScaleSec(frame, 0, 4.0, 1.025, 1.0);
  const cameraPan = interpolate(
    frame,
    [0, Math.round(4.0 * FPS)],
    [5, -5],
    { easing: easeOutCubic },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CREAM_WARM,
        overflow: "hidden",
        transform: `translate3d(0, ${cameraPan}px, 0) scale(${cameraScale})`,
      }}
    >
      <PaperTextureOverlay />
      <AmbientGlow left={280} top={180} size={720} color="#D8A0AA" opacity={0.07} />
      <SubtleGoldDust frame={frame} startSec={0.25} durationSec={3.75} />

      {/* EDITORIAL INSET BORDER */}
      <div
        style={{
          position: "absolute",
          left: 48,
          right: 48,
          top: 48,
          bottom: 48,
          border: "1px solid rgba(88, 21, 37, 0.12)",
          pointerEvents: "none",
          zIndex: 10,
          opacity: fadeInSec(frame, 0.1, 0.45),
        }}
      />

      {/* GHOSTED MONOGRAPH WATERMARK IN DEEP BACKGROUND */}
      <div
        style={{
          position: "absolute",
          right: 72,
          top: 140,
          fontFamily: cormorant.fontFamily,
          fontSize: 220,
          fontWeight: 300,
          color: "rgba(88, 21, 37, 0.045)",
          lineHeight: 0.8,
          pointerEvents: "none",
          zIndex: 6,
        }}
      >
        N° 01
      </div>

      {/* METADATA BAR */}
      <EditorialHeader chapter="03" category="FRESH FLOWERS" frame={frame} startSec={0} />

      {/* ASYMMETRIC EDITORIAL TYPOGRAPHY BLOCK */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 136,
          maxWidth: 620,
          zIndex: 70,
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 5,
            color: MAROON,
            marginBottom: 8,
            opacity: fadeInSec(frame, 0.2, 0.4),
          }}
        >
          AUTHENTIC BOTANICALS
        </div>

        <div
          style={{
            fontFamily: cormorant.fontFamily,
            fontSize: 104,
            fontWeight: 500,
            lineHeight: 0.86,
            color: CHARCOAL,
            opacity: fadeInSec(frame, 0.35, 0.5),
            transform: `translate3d(0, ${slideUpSec(frame, 0.35, 0.55, 22)}px, 0)`,
          }}
        >
          CRAFTED TO
        </div>

        <div
          style={{
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 114,
            fontWeight: 400,
            lineHeight: 0.88,
            color: MAROON,
            opacity: fadeInSec(frame, 0.5, 0.5),
            transform: `translate3d(0, ${slideUpSec(frame, 0.5, 0.55, 22)}px, 0)`,
          }}
        >
          inspire joy.
        </div>

        <div
          style={{
            marginTop: 14,
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 24,
            color: "#68615E",
            opacity: fadeInSec(frame, 0.7, 0.45),
          }}
        >
          Real fresh blooms curated for every graduate.
        </div>

        <div
          style={{
            marginTop: 16,
            width: 80,
            height: 1,
            backgroundColor: GOLD,
            opacity: fadeInSec(frame, 0.85, 0.35),
          }}
        />
      </div>

      {/* BACKGROUND DEPTH FRESH FLOWER (SUBTLE BOKEH EFFECT) */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 680,
          opacity: fadeInSec(frame, 0.5, 0.6) * 0.28,
          filter: "blur(9px)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <Img
          src={A("fresh-flower-03.png")}
          style={{
            height: 720,
            width: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      {/* PRIMARY HERO FRESH FLOWER CUTOUT — REAL PRODUCT OBJECT
          Centered with 90px side breathing room */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: -30,
          height: 1180,
          display: "flex",
          justifyContent: "center",
          zIndex: 45,
        }}
      >
        <HeroFreshFlower
          src={A("fresh-flower-02.png")}
          frame={frame}
          startSec={0.35}
          durationSec={3.65}
          height={1180}
          rotate={1.5}
          parallaxSpeed={16}
        />
      </div>

      {/* EDITORIAL SPECIFICATION TAG */}
      <div
        style={{
          position: "absolute",
          left: 72,
          bottom: 70,
          zIndex: 80,
          opacity: fadeInSec(frame, 1.0, 0.45),
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 4.5,
            color: CHARCOAL,
          }}
        >
          DEE.GIFT FLORAL ATELIER
        </div>
        <div
          style={{
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 18,
            color: MAROON,
            marginTop: 3,
          }}
        >
          Authentic Fresh Flower • Wisuda UNIGORO 2026
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 04 — FOTERA HERO FILM (11.5 – 15.6s / 205 Frames @ 50fps)
   Luxury photography showcase: Cinematic video + Archival gallery photo
   Upper-left: Clean editorial typography ONLY (no small yellow logo / white box)
========================================================= */
const FoteraVideoScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B101D",
        overflow: "hidden",
      }}
    >
      {/* VIDEO LAYER */}
      <Video
        src={A("fotera-video.mp4")}
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${slowScaleSec(frame, 0, 4.1, 1.028, 1.0)})`,
        }}
      />

      {/* EDITORIAL NAVY GRADIENT MASK */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,16,29,0.76) 0%, rgba(11,16,29,0.18) 38%, rgba(10,14,24,0.88) 100%)",
        }}
      />

      {/* EDITORIAL INSET BORDER */}
      <div
        style={{
          position: "absolute",
          left: 48,
          right: 48,
          top: 48,
          bottom: 48,
          border: "1px solid rgba(255,255,255,0.15)",
          pointerEvents: "none",
          zIndex: 20,
          opacity: fadeInSec(frame, 0, 0.4),
        }}
      />

      {/* TOP HEADER */}
      <EditorialHeader chapter="04" category="STUDIO PORTRAITURE" frame={frame} startSec={0} dark />

      {/* UPPER BRAND STAMP — CLEAN EDITORIAL TYPOGRAPHY ONLY */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 124,
          zIndex: 70,
          opacity: fadeInSec(frame, 0.25, 0.45),
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 5.5,
            color: "#A8C2ED",
            textTransform: "uppercase",
          }}
        >
          FOTERA STUDIO
        </div>
        <div
          style={{
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 20,
            color: "rgba(255, 255, 255, 0.72)",
            marginTop: 4,
          }}
        >
          Official Graduation Portraiture
        </div>
        <div
          style={{
            width: 48,
            height: 1,
            backgroundColor: "rgba(168, 194, 237, 0.4)",
            marginTop: 12,
          }}
        />
      </div>

      {/* ARCHIVAL GALLERY PHOTO FRAME (PHOTO 01)
          Positioned as an asymmetric luxury exhibition piece */}
      <EditorialPhotoFrame
        src={A("photo-01.jpg")}
        frame={frame}
        startSec={0.4}
        durationSec={3.7}
        right={72}
        top={520}
        width={490}
        height={660}
        rotate={-2.2}
        caption="Fotera Studio Series"
       
      />

      {/* BOTTOM HEADLINE */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 96,
          zIndex: 70,
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 5.5,
            color: "#A8C2ED",
            marginBottom: 10,
            opacity: fadeInSec(frame, 0.3, 0.4),
          }}
        >
          STUDIO PHOTOGRAPHY BOJONEGORO
        </div>

        <div
          style={{
            fontFamily: cormorant.fontFamily,
            fontSize: 104,
            fontWeight: 400,
            lineHeight: 0.88,
            color: WHITE,
            opacity: fadeInSec(frame, 0.4, 0.5),
            transform: `translate3d(0, ${slideUpSec(frame, 0.4, 0.55, 20)}px, 0)`,
          }}
        >
          Capture every
        </div>

        <div
          style={{
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 112,
            fontWeight: 400,
            lineHeight: 0.88,
            color: "#A2C0F2",
            opacity: fadeInSec(frame, 0.6, 0.5),
            transform: `translate3d(0, ${slideUpSec(frame, 0.6, 0.55, 20)}px, 0)`,
          }}
        >
          precious memory.
        </div>

        <div
          style={{
            marginTop: 18,
            width: 80,
            height: 1,
            backgroundColor: BLUE_NAVY,
            borderTop: "1px solid #4C72C9",
            opacity: fadeInSec(frame, 0.8, 0.35),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 05 — COLLABORATION HERO (15.6 – 18.7s / 155 Frames @ 50fps)
   High-Fashion Magazine Editorial:
   - MONUMENTAL DEE.GIFT × FOTERA BRANDING
   - MANDATORY EDITORIAL COPY:
     "CAPTURE THE MOMENT."
     "TAKE HOME A FRESH FLOWER."
   - TWO HERO OBJECTS SITTING DIRECTLY BESIDE EACH OTHER:
     LEFT: REAL FRESH FLOWER CUTOUT (~580px height = 30.2% screen height)
     RIGHT: AUTHENTIC FOTERA PHOTO OUTPUT (~570px height)
   - Visual safety margin 9% (96px margins), never touches screen edge
========================================================= */
const CollaborationScene: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraScale = slowScaleSec(frame, 0, 3.1, 1.02, 1.0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CREAM,
        overflow: "hidden",
        transform: `scale(${cameraScale})`,
      }}
    >
      <PaperTextureOverlay />

      {/* DUAL TONE ARCHITECTURAL SPLIT */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "50%",
          backgroundColor: CREAM_WARM,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "50%",
          backgroundColor: BLUE_LIGHT,
        }}
      />

      {/* EDITORIAL INSET BORDER (8–10% MARGIN) */}
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 54,
          bottom: 54,
          border: "1px solid rgba(20, 18, 20, 0.12)",
          pointerEvents: "none",
          zIndex: 15,
          opacity: fadeInSec(frame, 0.05, 0.45),
        }}
      />

      {/* METADATA BAR */}
      <EditorialHeader chapter="05" category="COLLABORATION" frame={frame} startSec={0} />

      {/* TOP BRAND LOCKUP: DEE.GIFT × FOTERA */}
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 132,
          textAlign: "center",
          zIndex: 70,
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 5.5,
            color: "#6D6864",
            textTransform: "uppercase",
            marginBottom: 12,
            opacity: fadeInSec(frame, 0.1, 0.4),
          }}
        >
          WISUDA UNIGORO 2026 OFFICIAL COLLABORATION
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            opacity: fadeInSec(frame, 0.2, 0.45),
            transform: `scale(${slowScaleSec(frame, 0.2, 0.5, 0.96, 1.0)})`,
          }}
        >
          <span
            style={{
              fontFamily: manrope.fontFamily,
              fontSize: 62,
              fontWeight: 800,
              color: MAROON,
              letterSpacing: -1,
            }}
          >
            DEE.GIFT
          </span>

          <span
            style={{
              fontFamily: cormorant.fontFamily,
              fontSize: 70,
              color: GOLD,
              lineHeight: 1,
            }}
          >
            ×
          </span>

          <span
            style={{
              fontFamily: manrope.fontFamily,
              fontSize: 62,
              fontWeight: 800,
              color: BLUE_NAVY,
              letterSpacing: -1,
            }}
          >
            FOTERA
          </span>
        </div>

        <div
          style={{
            width: 220,
            height: 1,
            backgroundColor: GOLD_HAIRLINE,
            margin: "14px auto 0",
            opacity: fadeInSec(frame, 0.35, 0.35),
          }}
        />
      </div>

      {/* MANDATORY SCENE 5 COPY:
          CAPTURE THE MOMENT.
          TAKE HOME A FRESH FLOWER. */}
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 288,
          textAlign: "center",
          zIndex: 75,
        }}
      >
        <div
          style={{
            fontFamily: cormorant.fontFamily,
            fontSize: 82,
            fontWeight: 600,
            lineHeight: 0.92,
            letterSpacing: -1.5,
            color: CHARCOAL,
            opacity: fadeInSec(frame, 0.3, 0.45),
            transform: `translate3d(0, ${slideUpSec(frame, 0.3, 0.45, 16)}px, 0)`,
          }}
        >
          CAPTURE THE MOMENT.
        </div>

        <div
          style={{
            marginTop: 10,
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 72,
            fontWeight: 400,
            lineHeight: 0.92,
            color: MAROON,
            opacity: fadeInSec(frame, 0.45, 0.45),
            transform: `translate3d(0, ${slideUpSec(frame, 0.45, 0.5, 16)}px, 0)`,
          }}
        >
          Take home a fresh flower.
        </div>

        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#6E6864",
            textTransform: "uppercase",
            marginTop: 14,
            opacity: fadeInSec(frame, 0.6, 0.4),
          }}
        >
          1 Photobooth Session + 1 Authentic Fresh Bloom
        </div>
      </div>

      {/* =========================================================
          THE TWO HERO OBJECTS (SIDE-BY-SIDE ON THE EXACT SAME LEVEL):
          [ REAL FRESH FLOWER CUTOUT ]      [ AUTHENTIC FOTERA PHOTO OUTPUT ]
          - Fresh flower sits DIRECTLY BESIDE the photo
          - Neither object touches the screen edge (96px margins = ~9% safety margin)
          - Fresh flower occupies ~580px (30.2% of screen height)
          - Fotera photo occupies ~570px (similar visual importance)
          - Both clearly visible, substantial, unboxed, authentic editorial pairing
         ========================================================= */}
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 590,
          height: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 60,
        }}
      >
        {/* LEFT HERO OBJECT: REAL FRESH FLOWER CUTOUT */}
        <div
          style={{
            width: 420,
            height: 580,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <HeroFreshFlower
            src={A("fresh-flower-01.png")}
            frame={frame}
            startSec={0.35}
            durationSec={2.75}
            height={580}
            rotate={-1.5}
            position="relative"
            zIndex={40}
          />
        </div>

        {/* RIGHT HERO OBJECT: AUTHENTIC FOTERA PHOTO OUTPUT */}
        <div
          style={{
            width: 424,
            height: 580,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <EditorialPhotoFrame
            src={A("photo-02.jpg")}
            frame={frame}
            startSec={0.45}
            durationSec={2.65}
            width={410}
            height={570}
            rotate={1.5}
            caption="Fotera Studio Output"
            position="relative"
            zIndex={35}
          />
        </div>
      </div>

      {/* LOWER RESTRAINED EDITORIAL ATTRIBUTION */}
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 1240,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 70,
          opacity: fadeInSec(frame, 0.75, 0.45),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 1, backgroundColor: MAROON }} />
          <span
            style={{
              fontFamily: manrope.fontFamily,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 3,
              color: MAROON,
              textTransform: "uppercase",
            }}
          >
            Authentic Fresh Gift
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: manrope.fontFamily,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 3,
              color: BLUE_NAVY,
              textTransform: "uppercase",
            }}
          >
            Permanent Studio Memory
          </span>
          <div style={{ width: 32, height: 1, backgroundColor: BLUE_NAVY }} />
        </div>
      </div>

      {/* UNIGORO FOOTER EMBLEM */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 64,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          zIndex: 80,
          opacity: fadeInSec(frame, 0.85, 0.45),
        }}
      >
        <Img
          src={A("unigoro-logo.png")}
          style={{
            width: 52,
            height: 52,
            objectFit: "contain",
          }}
        />
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#5B5552",
          }}
        >
          WISUDA UNIVERSITAS BOJONEGORO 2026
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 06 — THE PROMOTIONAL MESSAGE (18.7 – 21.0s / 115 Frames @ 50fps)
   High-Impact Luxury Editorial Reveal:
   - Deep wine & gold hairline frame
   - Primary Commercial Payoff:
     Rp30K
     1 SESSION PHOTOBOOTH
     + FREE FRESH FLOWER
   - Subtle luxury motion reveal (settles, fades/slides into position)
   - Real transparent fresh flower cutout (~580px) & photobooth photo anchors
========================================================= */
const OfferScene: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraScale = slowScaleSec(frame, 0, 2.3, 1.02, 1.0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: MAROON_DEEP,
        overflow: "hidden",
        transform: `scale(${cameraScale})`,
      }}
    >
      <AmbientGlow left={480} top={380} size={750} color="#9C2C47" opacity={0.16} />
      <SubtleGoldDust frame={frame} startSec={0} durationSec={2.3} />

      {/* EDITORIAL INSET BORDER (FINE GOLD HAIRLINE) */}
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 54,
          bottom: 54,
          border: `1px solid ${GOLD_HAIRLINE}`,
          pointerEvents: "none",
          zIndex: 10,
          opacity: fadeInSec(frame, 0.05, 0.4),
        }}
      />

      {/* METADATA BAR */}
      <EditorialHeader chapter="06" category="OFFER" frame={frame} startSec={0} dark />

      {/* PROMOTIONAL OFFER COMMERCIAL PAYOFF (EDITORIAL TYPOGRAPHY) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 120,
          zIndex: 70,
        }}
      >
        {/* EYEBROW */}
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 5.5,
            color: GOLD,
            textTransform: "uppercase",
            marginBottom: 6,
            opacity: fadeInSec(frame, 0.1, 0.35),
          }}
        >
          WISUDA UNIGORO 2026 • COMMENCEMENT EXCLUSIVE
        </div>

        {/* 1. MONUMENTAL HERO PRICE: Rp30K */}
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 144,
            fontWeight: 800,
            letterSpacing: -6,
            lineHeight: 0.85,
            color: WHITE,
            opacity: fadeInSec(frame, 0.15, 0.45),
            transform: `translate3d(0, ${slideUpSec(frame, 0.15, 0.5, 20)}px, 0)`,
          }}
        >
          Rp30K
        </div>

        {/* 2. SUPPORTING OFFER: 1 SESSION PHOTOBOOTH */}
        <div
          style={{
            marginTop: 10,
            fontFamily: manrope.fontFamily,
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: -1,
            lineHeight: 1.0,
            color: "#F6E8CE",
            opacity: fadeInSec(frame, 0.35, 0.45),
            transform: `translate3d(0, ${slideUpSec(frame, 0.35, 0.5, 16)}px, 0)`,
          }}
        >
          1 SESSION PHOTOBOOTH
        </div>

        {/* 3. SUPPORTING OFFER: + FREE FRESH FLOWER */}
        <div
          style={{
            marginTop: 4,
            fontFamily: manrope.fontFamily,
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 1.5,
            lineHeight: 1.0,
            color: GOLD,
            opacity: fadeInSec(frame, 0.45, 0.45),
            transform: `translate3d(0, ${slideUpSec(frame, 0.45, 0.5, 16)}px, 0)`,
          }}
        >
          + FREE FRESH FLOWER
        </div>

        {/* SUBTITLE */}
        <div
          style={{
            marginTop: 10,
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 26,
            color: "#E2D3D6",
            opacity: fadeInSec(frame, 0.6, 0.4),
          }}
        >
          Capture the celebration. Take home an authentic fresh flower gift.
        </div>
      </div>

      {/* VISUAL HERO OBJECTS PAIRING:
          [ AUTHENTIC PHOTOBOOTH KEEPSAKE ]      [ REAL FRESH FLOWER CUTOUT ]
          - Both substantial (~580px)
          - Transparent fresh flower cutout sits directly beside the photobooth print
          - Visual safety margin ~9% (96px margins)
          - Restrained natural lighting, no heavy discount badges
      */}
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 550,
          height: 590,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 60,
        }}
      >
        {/* LEFT OBJECT: AUTHENTIC FOTERA PHOTOBOOTH SOUVENIR */}
        <div
          style={{
            width: 420,
            height: 580,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <EditorialPhotoFrame
            src={A("photo-01.jpg")}
            frame={frame}
            startSec={0.4}
            durationSec={1.9}
            width={410}
            height={570}
            rotate={-1.5}
            caption="1× Photobooth Session Output"
            position="relative"
            zIndex={35}
          />
        </div>

        {/* RIGHT HERO OBJECT: AUTHENTIC REAL FRESH FLOWER CUTOUT */}
        <div
          style={{
            width: 420,
            height: 580,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <HeroFreshFlower
            src={A("fresh-flower-02.png")}
            frame={frame}
            startSec={0.3}
            durationSec={2.0}
            height={580}
            rotate={2.0}
            parallaxSpeed={12}
            position="relative"
            zIndex={40}
          />
        </div>
      </div>

      {/* PHOTOBOOTH & BOTANICAL ATTRIBUTES SEAL */}
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          bottom: 64,
          zIndex: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: fadeInSec(frame, 0.65, 0.45),
          transform: `translate3d(0, ${slideUpSec(frame, 0.65, 0.5, 14)}px, 0)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 58,
              height: 58,
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.30))",
            }}
          >
            <Img
              src={A("photobooth.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: manrope.fontFamily,
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 2.5,
                color: WHITE,
              }}
            >
              PRINTED KEEPSAKE + DIGITAL SOFTCOPY
            </div>
            <div
              style={{
                fontFamily: manrope.fontFamily,
                fontSize: 12,
                color: "#D0C4C8",
                marginTop: 2,
              }}
            >
              100% Curated Fresh Graduation Bloom Included
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: manrope.fontFamily,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 3,
              color: GOLD,
              textTransform: "uppercase",
            }}
          >
            FOTERA × DEE.GIFT
          </div>
          <div
            style={{
              fontFamily: cormorantItalic.fontFamily,
              fontSize: 16,
              color: "#E2D3D6",
              marginTop: 2,
            }}
          >
            Wisuda UNIGORO 2026
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 07 — FINAL CALL TO ACTION (21.0 – 24.0s / 150 Frames @ 50fps)
   Deliberate Luxury Campaign End Card (3.0s / 150 frames):
   - Brand identities: DEE.GIFT × FOTERA & UNIGORO
   - Campaign message:
     1 SESSION PHOTOBOOTH + FREE FRESH FLOWER
   - Two Hero Visuals:
     Large authentic fresh flower cutout (soft natural shadow)
     Large real Fotera graduation photo
   - Official CTA:
     KUNJUNGI STAN KAMI
   - Generous negative space, perfectly balanced & readable
========================================================= */
const EndCardScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera settles early (by 0.4s) so the entire reading period is silky and solid
  const cameraScale = slowScaleSec(frame, 0, 0.4, 1.015, 1.0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CREAM,
        overflow: "hidden",
        transform: `scale(${cameraScale})`,
      }}
    >
      <PaperTextureOverlay />

      {/* BRAND COLOR ACCENT LINES */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: 8,
          backgroundColor: MAROON,
          zIndex: 90,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 8,
          backgroundColor: BLUE_NAVY,
          zIndex: 90,
        }}
      />

      {/* EDITORIAL INSET BORDER */}
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 54,
          bottom: 54,
          border: "1px solid rgba(88, 21, 37, 0.12)",
          pointerEvents: "none",
          zIndex: 10,
          opacity: fadeInSec(frame, 0, 0.35),
        }}
      />

      {/* METADATA BAR */}
      <EditorialHeader chapter="07" category="FINALE" frame={frame} startSec={0} />

      {/* 1. UNIGORO CREST & INSTITUTIONAL IDENTITY */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 104,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          zIndex: 70,
          opacity: fadeInSec(frame, 0, 0.4),
        }}
      >
        <Img
          src={A("unigoro-logo.png")}
          style={{
            width: 86,
            height: 86,
            objectFit: "contain",
          }}
        />
        <div>
          <div
            style={{
              fontFamily: manrope.fontFamily,
              fontSize: 13.5,
              fontWeight: 800,
              letterSpacing: 4.5,
              color: CHARCOAL,
              textTransform: "uppercase",
            }}
          >
            UNIVERSITAS BOJONEGORO
          </div>
          <div
            style={{
              fontFamily: cormorantItalic.fontFamily,
              fontSize: 18.5,
              color: MAROON,
              marginTop: 2,
            }}
          >
            Official Graduation Celebration 2026
          </div>
        </div>
      </div>

      {/* 2. PROMINENT COLLABORATION LOCKUP (DEE.GIFT × FOTERA) */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 212,
          zIndex: 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: fadeInSec(frame, 0.1, 0.4),
        }}
      >
        <LogoPair frame={frame} startSec={0.1} logoSize={134} />
      </div>

      {/* 3. PROMOTIONAL OFFER HEADLINE (WISUDA UNIGORO 2026 ↓ Rp30K ↓ 1 SESSION PHOTOBOOTH + FREE FRESH FLOWER) */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 366,
          textAlign: "center",
          zIndex: 75,
          opacity: fadeInSec(frame, 0.25, 0.45),
          transform: `translate3d(0, ${slideUpSec(frame, 0.25, 0.45, 14)}px, 0)`,
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 5,
            color: MAROON,
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          WISUDA UNIGORO 2026 SPECIAL OFFER
        </div>

        {/* DOMINANT PRICE: Rp30K */}
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 98,
            fontWeight: 800,
            letterSpacing: -4.5,
            color: CHARCOAL,
            lineHeight: 0.92,
          }}
        >
          Rp30K
        </div>

        {/* SUPPORTING OFFER WITH GENEROUS BREATHING SPACE */}
        <div
          style={{
            marginTop: 18,
            fontFamily: manrope.fontFamily,
            fontSize: 23,
            fontWeight: 800,
            letterSpacing: 2.8,
            color: MAROON,
            textTransform: "uppercase",
            lineHeight: 1.15,
          }}
        >
          1 SESSION PHOTOBOOTH + FREE FRESH FLOWER
        </div>

        <div
          style={{
            marginTop: 8,
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 20,
            color: "#5A5350",
          }}
        >
          Authentic graduation flower & timeless studio portraits.
        </div>
      </div>

      {/* 4. THE TWO MAJOR VISUAL HEROES:
          LEFT: LARGE AUTHENTIC FRESH FLOWER CUTOUT (~580px, soft natural shadow)
          RIGHT: LARGE REAL FOTERA PHOTO (~560px, museum archival frame)
          - Both clearly visible, substantial, and balanced
          - Sitting side-by-side with 88px margins (approx 8.1% safety margin)
          - Sits cleanly below the offer block with equal visual gravity
      */}
      <div
        style={{
          position: "absolute",
          left: 88,
          right: 88,
          top: 594,
          height: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 60,
        }}
      >
        {/* LEFT MAJOR HERO ANCHOR: LARGE FRESH FLOWER CUTOUT */}
        <div
          style={{
            width: 420,
            height: 580,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HeroFreshFlower
            src={A("fresh-flower-03.png")}
            frame={frame}
            startSec={0.4}
            durationSec={2.5}
            height={580}
            rotate={-1.5}
            parallaxSpeed={10}
            position="relative"
            zIndex={40}
          />
        </div>

        {/* RIGHT MAJOR HERO ANCHOR: LARGE REAL FOTERA PHOTOGRAPH */}
        <div
          style={{
            width: 420,
            height: 560,
            position: "relative",
            padding: "12px 12px 30px 12px",
            backgroundColor: WHITE,
            border: "1px solid rgba(20, 18, 20, 0.14)",
            boxShadow: "0 22px 45px rgba(12, 10, 14, 0.16)",
            boxSizing: "border-box",
            opacity: fadeInSec(frame, 0.45, 0.5),
            transform: `
              translate3d(0, ${slideUpSec(frame, 0.45, 0.5, 16)}px, 0)
              scale(${slowScaleSec(frame, 0.45, 0.7, 0.97, 1.0)})
              rotate(1.8deg)
            `,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              backgroundColor: "#F0EAE1",
            }}
          >
            <Img
              src={A("photo-03.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              bottom: 9,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: manrope.fontFamily,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2.5,
                color: "#6D6864",
                textTransform: "uppercase",
              }}
            >
              FOTERA STUDIO SERIES
            </span>
            <span
              style={{
                fontFamily: manrope.fontFamily,
                fontSize: 9,
                letterSpacing: 2,
                color: "#99928D",
              }}
            >
              WISUDA 2026
            </span>
          </div>
        </div>
      </div>

      {/* 5. ATELIER FEATURE ATTRIBUTES */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 1228,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          zIndex: 80,
          opacity: fadeInSec(frame, 0.8, 0.4),
        }}
      >
        <div style={{ width: 28, height: 1, backgroundColor: GOLD_HAIRLINE }} />
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3.5,
            color: "#6C6662",
            textTransform: "uppercase",
          }}
        >
          AUTHENTIC FRESH FLOWER • INSTANT PHOTOBOOTH PRINT • DIGITAL SOFTCOPY
        </div>
        <div style={{ width: 28, height: 1, backgroundColor: GOLD_HAIRLINE }} />
      </div>

      {/* 6. OFFICIAL CALL TO ACTION BUTTON (EXACTLY: "KUNJUNGI STAN KAMI") */}
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 1284,
          height: 96,
          borderRadius: 999,
          backgroundColor: CHARCOAL,
          border: `1.5px solid ${GOLD}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 90,
          boxShadow: "0 22px 46px rgba(18, 16, 20, 0.22)",
          opacity: fadeInSec(frame, 1.0, 0.45),
          transform: `scale(${slowScaleSec(frame, 1.0, 0.45, 0.96, 1.0)})`,
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 5.5,
            color: WHITE,
            textTransform: "uppercase",
          }}
        >
          KUNJUNGI STAN KAMI
        </div>
      </div>

      {/* 7. CAMPUS LOCATION COORDINATE & PARTNERSHIP ACCREDITATION (GENEROUS SEPARATION FROM CTA) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1436,
          textAlign: "center",
          zIndex: 80,
          opacity: fadeInSec(frame, 1.2, 0.4),
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 4.5,
            color: GREY_MUTED,
            textTransform: "uppercase",
          }}
        >
          WISUDA UNIVERSITAS BOJONEGORO 2026
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 19,
            color: MAROON,
          }}
        >
          Official Commencement Partner • Dee.Gift × Fotera Studio
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   MASTER TIMELINE (1080x1920 • 50 FPS • 1200 FRAMES • 24.0s)
   - Scene 1 (0.0s – 3.8s): 190 frames
   - Scene 2 (3.8s – 7.5s): 185 frames
   - Scene 3 (7.5s – 11.5s): 200 frames
   - Scene 4 (11.5s – 15.6s): 205 frames
   - Scene 5 (15.6s – 18.7s): 155 frames
   - Scene 6 (18.7s – 21.0s): 115 frames
   - Scene 7 (21.0s – 24.0s): 150 frames
   Total: 1200 frames = exactly 24.0 seconds
========================================================= */
export default function GraduationCollab() {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: CHARCOAL,
        overflow: "hidden",
      }}
    >
      {/* 0.0 – 3.8s / Frames 0 – 190 (190 frames): EDITORIAL OPENING */}
      <Sequence durationInFrames={190}>
        <OpeningScene />
      </Sequence>

      {/* 3.8 – 7.5s / Frames 190 – 375 (185 frames): DEEGIFT CINEMATIC HERO */}
      <Sequence from={190} durationInFrames={185}>
        <DeeGiftVideoScene />
      </Sequence>

      {/* 7.5 – 11.5s / Frames 375 – 575 (200 frames): PURE DEEGIFT MOTION SPREAD */}
      <Sequence from={375} durationInFrames={200}>
        <DeeGiftMotionScene />
      </Sequence>

      {/* 11.5 – 15.6s / Frames 575 – 780 (205 frames): FOTERA CINEMATIC HERO */}
      <Sequence from={575} durationInFrames={205}>
        <FoteraVideoScene />
      </Sequence>

      {/* 15.6 – 18.7s / Frames 780 – 935 (155 frames): COLLABORATION SPREAD */}
      <Sequence from={780} durationInFrames={155}>
        <CollaborationScene />
      </Sequence>

      {/* 18.7 – 21.0s / Frames 935 – 1050 (115 frames): EXCLUSIVE SPECIAL OFFER */}
      <Sequence from={935} durationInFrames={115}>
        <OfferScene />
      </Sequence>

      {/* 21.0 – 24.0s / Frames 1050 – 1200 (150 frames): LUXURY FINALE & CTA */}
      <Sequence from={1050} durationInFrames={150}>
        <EndCardScene />
      </Sequence>
    </AbsoluteFill>
  );
}

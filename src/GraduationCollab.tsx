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
   BRAND COLORS
========================================================= */

const MAROON = "#641C2E";
const CREAM = "#F5EEE5";

const BLUE = "#173A8F";
const BLUE_LIGHT = "#EEF2F8";

const BLACK = "#111111";
const WHITE = "#FFFFFF";
const GREY = "#77716D";

/* =========================================================
   MOTION
========================================================= */

const easeOut = (v: number) =>
  1 - Math.pow(1 - v, 3);

const fadeIn = (
  frame: number,
  start: number,
  duration = 18,
) =>
  interpolate(
    frame,
    [start, start + duration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    },
  );

const scaleIn = (
  frame: number,
  start: number,
  duration = 22,
  from = 0.96,
) =>
  interpolate(
    frame,
    [start, start + duration],
    [from, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    },
  );

const slowZoom = (
  frame: number,
  start: number,
  duration = 90,
  from = 1.03,
  to = 1,
) =>
  interpolate(
    frame,
    [start, start + duration],
    [from, to],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    },
  );

const subtleDrift = (
  frame: number,
  start: number,
) =>
  Math.sin((frame - start) / 25) * 3;

/* =========================================================
   AMBIENT LIGHT
========================================================= */

const AmbientLight: React.FC<{
  left: number;
  top: number;
  size: number;
  color: string;
  opacity?: number;
}> = ({
  left,
  top,
  size,
  color,
  opacity = 0.07,
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: color,
      opacity,
      filter: "blur(110px)",
      pointerEvents: "none",
    }}
  />
);

/* =========================================================
   GOLD DUST
========================================================= */

const GoldDust: React.FC<{
  frame: number;
  start: number;
  duration: number;
  opacity?: number;
}> = ({
  frame,
  start,
  duration,
  opacity = 0.025,
}) => {
  const local = Math.max(0, frame - start);

  const alpha = interpolate(
    local,
    [0, 18, duration - 18, duration],
    [0, opacity, opacity, 0],
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
        left: -40,
        top: -30,
        width: "calc(100% + 80px)",
        height: "calc(100% + 60px)",
        objectFit: "cover",
        opacity: alpha,
        transform: `
          translate(
            ${Math.sin(local / 60) * 3}px,
            ${Math.cos(local / 48) * 2}px
          )
        `,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 30,
      }}
    />
  );
};

/* =========================================================
   LENS FLARE
========================================================= */

const LensFlare: React.FC<{
  frame: number;
  start: number;
  opacity?: number;
}> = ({
  frame,
  start,
  opacity = 0.06,
}) => {
  const local = Math.max(0, frame - start);

  const alpha = interpolate(
    local,
    [0, 2, 4, 8],
    [0, opacity, opacity * 0.45, 0],
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
        left: -100,
        top: -80,
        width: "calc(100% + 200px)",
        height: "calc(100% + 160px)",
        objectFit: "cover",
        opacity: alpha,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 100,
      }}
    />
  );
};

/* =========================================================
   EDITORIAL LABEL
========================================================= */

const Label: React.FC<{
  children: React.ReactNode;
  frame: number;
  start?: number;
  color?: string;
  center?: boolean;
}> = ({
  children,
  frame,
  start = 0,
  color = BLACK,
  center = false,
}) => (
  <div
    style={{
      fontFamily: manrope.fontFamily,
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: 4.5,
      color,
      textAlign: center ? "center" : "left",
      opacity: fadeIn(frame, start, 14),
      transform: `
        translateY(
          ${interpolate(
            frame,
            [start, start + 14],
            [12, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            },
          )}px
        )
      `,
    }}
  >
    {children}
  </div>
);

/* =========================================================
   EDITORIAL HEADLINE
========================================================= */

const EditorialHeadline: React.FC<{
  children: React.ReactNode;
  frame: number;
  start?: number;
  size?: number;
  color?: string;
  italic?: boolean;
  center?: boolean;
}> = ({
  children,
  frame,
  start = 0,
  size = 86,
  color = BLACK,
  italic = false,
  center = false,
}) => (
  <div
    style={{
      fontFamily: italic
        ? cormorantItalic.fontFamily
        : cormorant.fontFamily,
      fontSize: size,
      fontWeight: italic ? 400 : 500,
      lineHeight: 0.87,
      color,
      textAlign: center ? "center" : "left",
      opacity: fadeIn(frame, start, 20),
      transform: `
        translateY(
          ${interpolate(
            frame,
            [start, start + 20],
            [22, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            },
          )}px
        )
      `,
    }}
  >
    {children}
  </div>
);

/* =========================================================
   LARGE REAL LOGOS
   Used on white background only so background blends.
========================================================= */

const LogoPair: React.FC<{
  frame: number;
  start?: number;
  width?: number;
}> = ({
  frame,
  start = 0,
  width = 280,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 28,
      opacity: fadeIn(frame, start, 16),
      transform: `scale(${scaleIn(
        frame,
        start,
        18,
        0.95,
      )})`,
    }}
  >
    <Img
      src={A("deegift-logo.png")}
      style={{
        width,
        height: width * 0.40,
        objectFit: "contain",
      }}
    />

    <div
      style={{
        fontFamily: cormorant.fontFamily,
        fontSize: 52,
        color: "#3A3735",
        lineHeight: 1,
      }}
    >
      ×
    </div>

    <Img
      src={A("fotera.png")}
      style={{
        width,
        height: width * 0.40,
        objectFit: "contain",
      }}
    />
  </div>
);

/* =========================================================
   BOUQUET HERO
========================================================= */

const Bouquet: React.FC<{
  src: string;
  frame: number;
  start: number;
  left: number;
  top: number;
  size: number;
  rotate?: number;
}> = ({
  src,
  frame,
  start,
  left,
  top,
  size,
  rotate = 0,
}) => {
  const scale = slowZoom(
    frame,
    start,
    100,
    1.035,
    1,
  );

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        opacity: fadeIn(frame, start, 18),
        transform: `
          translateY(${subtleDrift(
            frame,
            start,
          )}px)
          scale(${scale})
          rotate(${rotate}deg)
        `,
        transformOrigin: "center bottom",
        filter:
          "drop-shadow(0 32px 34px rgba(0,0,0,0.16))",
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

/* =========================================================
   EDITORIAL PHOTO FRAME
========================================================= */

const EditorialPhoto: React.FC<{
  src: string;
  frame: number;
  start: number;
  left: number;
  top: number;
  width: number;
  height?: number;
  rotate?: number;
}> = ({
  src,
  frame,
  start,
  left,
  top,
  width,
  height,
  rotate = 0,
}) => {
  const rotation = interpolate(
    frame,
    [start, start + 20],
    [rotate + 1.2, rotate],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        padding: 9,
        boxSizing: "border-box",
        backgroundColor: WHITE,
        border: "1px solid rgba(17,17,17,0.18)",
        boxShadow:
          "0 18px 45px rgba(0,0,0,0.14)",
        opacity: fadeIn(frame, start, 15),
        transform: `
          scale(${scaleIn(
            frame,
            start,
            18,
            0.96,
          )})
          rotate(${rotation}deg)
        `,
        zIndex: 40,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: height
            ? "100%"
            : "auto",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
};

/* =========================================================
   SCENE 01 — EDITORIAL OPENING
   0–3.3
========================================================= */

const Opening: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CREAM,
        overflow: "hidden",
      }}
    >
      <AmbientLight
        left={-180}
        top={-120}
        size={650}
        color="#D6A3AD"
        opacity={0.09}
      />

      <GoldDust
        frame={frame}
        start={20}
        duration={76}
      />

      {/* MICRO HEADER */}
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 46,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 80,
          opacity: fadeIn(frame, 0, 12),
        }}
      >
        <Label
          frame={frame}
          color={MAROON}
        >
          DEE.GIFT × FOTERA
        </Label>

        <Label
          frame={frame}
          color="#6F6964"
        >
          01 / 07
        </Label>
      </div>

      {/* UNIGORO */}
      <div
        style={{
          position: "absolute",
          left: 54,
          top: 95,
          zIndex: 70,
          opacity: fadeIn(frame, 4, 14),
        }}
      >
        <Img
          src={A("unigoro-logo.png")}
          style={{
            width: 105,
            height: 105,
            objectFit: "contain",
          }}
        />
      </div>

      {/* BIG EDITORIAL COPY */}
      <div
        style={{
          position: "absolute",
          left: 54,
          top: 255,
          zIndex: 70,
        }}
      >
        <EditorialHeadline
          frame={frame}
          start={14}
          size={98}
        >
          THE
          <br />
          MOMENT
        </EditorialHeadline>

        <div style={{height: 5}} />

        <EditorialHeadline
          frame={frame}
          start={23}
          size={92}
          italic
          color={MAROON}
        >
          worth remembering.
        </EditorialHeadline>
      </div>

      {/* HUGE BOUQUET */}
      <div
        style={{
          position: "absolute",
          right: -155,
          bottom: -165,
          zIndex: 30,
        }}
      >
        <Bouquet
          src={A("bouquet-01.png")}
          frame={frame}
          start={36}
          left={0}
          top={0}
          size={820}
          rotate={2}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          bottom: 52,
          display: "flex",
          justifyContent: "space-between",
          zIndex: 80,
        }}
      >
        <Label
          frame={frame}
          start={46}
          color="#6D6762"
        >
          WISUDA UNIGORO 2026
        </Label>

        <Label
          frame={frame}
          start={46}
          color={MAROON}
        >
          FLOWERS & GIFT
        </Label>
      </div>

      <LensFlare
        frame={frame}
        start={75}
        opacity={0.04}
      />
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 02 — DEEGIFT VIDEO
   3.3–6.8
========================================================= */

const DeeGiftVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        overflow: "hidden",
      }}
    >
      <Video
        src={A("deegift-video.mp4")}
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${slowZoom(
            frame,
            0,
            105,
            1.028,
            1,
          )})`,
        }}
      />

      <AbsoluteFill
        style={{
          backgroundColor:
            "rgba(30,10,16,0.12)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 50,
          zIndex: 80,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Label
          frame={frame}
          color={WHITE}
        >
          DEE.GIFT
        </Label>

        <Label
          frame={frame}
          color="rgba(255,255,255,0.78)"
        >
          02 / 07
        </Label>
      </div>

      <div
        style={{
          position: "absolute",
          left: 54,
          bottom: 90,
          zIndex: 80,
        }}
      >
        <EditorialHeadline
          frame={frame}
          start={10}
          size={82}
          color={WHITE}
          italic
        >
          Make the
          <br />
          moment bloom.
        </EditorialHeadline>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 8,
          backgroundColor: MAROON,
          zIndex: 90,
        }}
      />
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 03 — DEEGIFT EDITORIAL MOTION
   6.8–10.2
========================================================= */

const DeeGiftMotion: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WHITE,
        overflow: "hidden",
      }}
    >
      {/* EDITORIAL HEADER */}
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 48,
          display: "flex",
          justifyContent: "space-between",
          zIndex: 80,
        }}
      >
        <Label
          frame={frame}
          color={MAROON}
        >
          DEE.GIFT
        </Label>

        <Label
          frame={frame}
          color="#6F6964"
        >
          03 / 07
        </Label>
      </div>

      {/* HEADLINE */}
      <div
        style={{
          position: "absolute",
          left: 54,
          top: 145,
          zIndex: 70,
        }}
      >
        <EditorialHeadline
          frame={frame}
          start={6}
          size={86}
        >
          MAKE IT
        </EditorialHeadline>

        <EditorialHeadline
          frame={frame}
          start={15}
          size={96}
          italic
          color={MAROON}
        >
          bloom.
        </EditorialHeadline>
      </div>

      {/* THIN EDITORIAL FRAME */}
      <div
        style={{
          position: "absolute",
          left: 42,
          right: 42,
          top: 385,
          bottom: 54,
          border: "1px solid rgba(17,17,17,0.16)",
          zIndex: 15,
          opacity: fadeIn(frame, 8, 20),
        }}
      />

      {/* HERO BOUQUET */}
      <Bouquet
        src={A("bouquet-02.png")}
        frame={frame}
        start={8}
        left={180}
        top={390}
        size={810}
        rotate={1}
      />

      {/* CROPPED SECONDARY BOUQUET */}
      <Bouquet
        src={A("bouquet-01.png")}
        frame={frame}
        start={34}
        left={-210}
        top={980}
        size={460}
        rotate={-8}
      />

      {/* THIRD ACCENT */}
      <Bouquet
        src={A("bouquet-03.png")}
        frame={frame}
        start={45}
        left={705}
        top={1040}
        size={400}
        rotate={8}
      />

      <div
        style={{
          position: "absolute",
          left: 55,
          bottom: 58,
          zIndex: 80,
        }}
      >
        <Label
          frame={frame}
          start={50}
          color="#6E6863"
        >
          GRADUATION COLLECTION
        </Label>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 04 — FOTERA VIDEO
   10.2–13.7
========================================================= */

const FoteraVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        overflow: "hidden",
      }}
    >
      <Video
        src={A("fotera-video.mp4")}
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${slowZoom(
            frame,
            0,
            105,
            1.025,
            1,
          )})`,
        }}
      />

      <AbsoluteFill
        style={{
          backgroundColor:
            "rgba(17,33,72,0.10)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 50,
          display: "flex",
          justifyContent: "space-between",
          zIndex: 80,
        }}
      >
        <Label
          frame={frame}
          color={WHITE}
        >
          FOTERA STUDIO
        </Label>

        <Label
          frame={frame}
          color="rgba(255,255,255,0.80)"
        >
          04 / 07
        </Label>
      </div>

      {/* LARGE PHOTO FRAME */}
      <EditorialPhoto
        src={A("photo-01.jpg")}
        frame={frame}
        start={28}
        left={620}
        top={790}
        width={390}
        height={530}
        rotate={-4}
      />

      <div
        style={{
          position: "absolute",
          left: 54,
          bottom: 90,
          zIndex: 80,
        }}
      >
        <EditorialHeadline
          frame={frame}
          start={8}
          size={82}
          color={WHITE}
          italic
        >
          Capture the
          <br />
          moment.
        </EditorialHeadline>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 8,
          backgroundColor: BLUE,
          zIndex: 90,
        }}
      />
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 05 — COLLAB HERO
   13.7–16
========================================================= */

const Collaboration: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WHITE,
        overflow: "hidden",
      }}
    >
      {/* FULL SCREEN TWO-TONE EDITORIAL */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "50%",
          backgroundColor: CREAM,
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

      {/* HUGE TYPOGRAPHIC LOCKUP */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 250,
          zIndex: 70,
          textAlign: "center",
        }}
      >
        <Label
          frame={frame}
          start={5}
          color="#6D6863"
          center
        >
          SPECIAL COLLABORATION
        </Label>

        <div
          style={{
            marginTop: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            opacity: fadeIn(frame, 10, 18),
            transform: `scale(${scaleIn(
              frame,
              10,
              18,
              0.93,
            )})`,
          }}
        >
          <div
            style={{
              fontFamily: manrope.fontFamily,
              fontSize: 68,
              fontWeight: 800,
              color: MAROON,
              letterSpacing: -1,
            }}
          >
            DEE.GIFT
          </div>

          <div
            style={{
              fontFamily: cormorant.fontFamily,
              fontSize: 75,
              color: BLACK,
              lineHeight: 1,
            }}
          >
            ×
          </div>

          <div
            style={{
              fontFamily: manrope.fontFamily,
              fontSize: 68,
              fontWeight: 800,
              color: BLUE,
              letterSpacing: -1,
            }}
          >
            FOTERA
          </div>
        </div>

        <div
          style={{
            width: 340,
            height: 1,
            backgroundColor:
              "rgba(17,17,17,0.18)",
            margin: "30px auto 0",
            opacity: fadeIn(frame, 26, 12),
          }}
        />

        <div
          style={{
            marginTop: 20,
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 42,
            color: "#3C3836",
            opacity: fadeIn(frame, 29, 14),
          }}
        >
          Flowers + Memories
        </div>
      </div>

      {/* BOUQUET CROPPED LEFT */}
      <Bouquet
        src={A("bouquet-01.png")}
        frame={frame}
        start={8}
        left={-205}
        top={860}
        size={550}
        rotate={-7}
      />

      {/* PHOTO CROPPED RIGHT */}
      <EditorialPhoto
        src={A("photo-02.jpg")}
        frame={frame}
        start={16}
        left={690}
        top={855}
        width={390}
        height={535}
        rotate={5}
      />

      {/* UNIGORO */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 55,
          display: "flex",
          justifyContent: "center",
          zIndex: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: fadeIn(frame, 38, 12),
          }}
        >
          <Img
            src={A("unigoro-logo.png")}
            style={{
              width: 58,
              height: 58,
              objectFit: "contain",
            }}
          />

          <Label
            frame={frame}
            start={38}
            color="#68625E"
          >
            WISUDA UNIGORO 2026
          </Label>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 06 — OFFER
   16–18.2
========================================================= */

const Offer: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CREAM,
        overflow: "hidden",
      }}
    >
      {/* EDITORIAL HEADER */}
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 46,
          display: "flex",
          justifyContent: "space-between",
          zIndex: 70,
        }}
      >
        <Label
          frame={frame}
          color={MAROON}
        >
          GRADUATION SPECIAL
        </Label>

        <Label
          frame={frame}
          color="#6F6964"
        >
          06 / 07
        </Label>
      </div>

      {/* PRICE */}
      <div
        style={{
          position: "absolute",
          left: 52,
          top: 150,
          zIndex: 60,
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 25,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#7B7470",
            opacity: fadeIn(frame, 5, 12),
          }}
        >
          BOUQUET
        </div>

        <div
          style={{
            marginTop: 3,
            fontFamily: manrope.fontFamily,
            fontSize: 160,
            fontWeight: 800,
            letterSpacing: -10,
            lineHeight: 0.82,
            color: MAROON,
            opacity: fadeIn(frame, 10, 18),
            transform: `scale(${scaleIn(
              frame,
              10,
              18,
              0.94,
            )})`,
            transformOrigin: "left center",
          }}
        >
          Rp80K
        </div>

        <div style={{height: 32}} />

        <div
          style={{
            fontFamily: cormorantItalic.fontFamily,
            fontSize: 42,
            color: BLACK,
            opacity: fadeIn(frame, 27, 14),
          }}
        >
          flowers + memories.
        </div>
      </div>

      {/* GIANT BOUQUET */}
      <Bouquet
        src={A("bouquet-03.png")}
        frame={frame}
        start={23}
        left={500}
        top={655}
        size={620}
        rotate={5}
      />

      {/* PHOTOBOOTH */}
      <div
        style={{
          position: "absolute",
          right: 35,
          top: 440,
          width: 280,
          height: 280,
          opacity: fadeIn(frame, 25, 16),
          transform: `scale(${scaleIn(
            frame,
            25,
            16,
            0.95,
          )})`,
          zIndex: 60,
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

      {/* FREE TEXT */}
      <div
        style={{
          position: "absolute",
          left: 52,
          bottom: 120,
          zIndex: 80,
          opacity: fadeIn(frame, 35, 14),
        }}
      >
        <div
          style={{
            width: 70,
            height: 1,
            backgroundColor: MAROON,
            marginBottom: 15,
          }}
        />

        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 25,
            fontWeight: 800,
            color: BLACK,
            letterSpacing: 1,
          }}
        >
          FREE 1× PHOTOBOOTH
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   SCENE 07 — FINAL
   18.2–20
========================================================= */

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WHITE,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: 8,
          backgroundColor: MAROON,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 8,
          backgroundColor: BLUE,
        }}
      />

      {/* LOGOS MUCH LARGER */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 58,
          zIndex: 80,
        }}
      >
        <LogoPair
          frame={frame}
          start={0}
          width={235}
        />
      </div>

      {/* UNIGORO */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 165,
          display: "flex",
          justifyContent: "center",
          zIndex: 70,
          opacity: fadeIn(frame, 5, 12),
        }}
      >
        <Img
          src={A("unigoro-logo.png")}
          style={{
            width: 92,
            height: 92,
            objectFit: "contain",
          }}
        />
      </div>

      {/* FINAL COPY */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 300,
          textAlign: "center",
          zIndex: 70,
        }}
      >
        <EditorialHeadline
          frame={frame}
          start={8}
          size={70}
          center
        >
          Make your graduation
        </EditorialHeadline>

        <EditorialHeadline
          frame={frame}
          start={16}
          size={78}
          italic
          color={MAROON}
          center
        >
          unforgettable.
        </EditorialHeadline>
      </div>

      {/* PRICE */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 625,
          textAlign: "center",
          zIndex: 70,
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -4,
            color: BLACK,
            opacity: fadeIn(frame, 24, 12),
          }}
        >
          Rp80K
        </div>

        <div
          style={{
            marginTop: 10,
            fontFamily: manrope.fontFamily,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2,
            color: BLUE,
            opacity: fadeIn(frame, 31, 12),
          }}
        >
          FREE 1× PHOTOBOOTH
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 125,
          height: 84,
          borderRadius: 999,
          backgroundColor: BLACK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 90,
          opacity: fadeIn(frame, 36, 12),
          transform: `scale(${scaleIn(
            frame,
            36,
            12,
            0.95,
          )})`,
        }}
      >
        <div
          style={{
            fontFamily: manrope.fontFamily,
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: 2.2,
            color: WHITE,
          }}
        >
          KUNJUNGI STAN KAMI
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 70,
          textAlign: "center",
          fontFamily: manrope.fontFamily,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 4,
          color: GREY,
          opacity: fadeIn(frame, 43, 10),
        }}
      >
        WISUDA UNIGORO 2026
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   MASTER TIMELINE
   20 SEC / 600 FRAMES / 30 FPS
========================================================= */

export default function GraduationCollab() {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        overflow: "hidden",
      }}
    >
      {/* 0–3.3 */}
      <Sequence durationInFrames={99}>
        <Opening />
      </Sequence>

      {/* 3.3–6.8 */}
      <Sequence from={99} durationInFrames={105}>
        <DeeGiftVideo />
      </Sequence>

      {/* 6.8–10.2 */}
      <Sequence from={204} durationInFrames={102}>
        <DeeGiftMotion />
      </Sequence>

      {/* 10.2–13.7 */}
      <Sequence from={306} durationInFrames={105}>
        <FoteraVideo />
      </Sequence>

      {/* 13.7–16 */}
      <Sequence from={411} durationInFrames={69}>
        <Collaboration />
      </Sequence>

      {/* 16–18.2 */}
      <Sequence from={480} durationInFrames={66}>
        <Offer />
      </Sequence>

      {/* 18.2–20 */}
      <Sequence from={546} durationInFrames={54}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
}
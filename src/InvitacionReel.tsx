import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// Tipos para los props
interface InvitacionProps {
  novia: string;
  novio: string;
  fecha: string;
  fechaCorta: string;
  hora: string;
  lugar: string;
  ciudad: string;
  dressCode: string;
  hashtag: string;
  colorPrimario: string;
  colorSecundario: string;
  colorDorado: string;
}

// ============================================
// COMPONENTE PRINCIPAL DEL REEL
// ============================================
export const InvitacionReel: React.FC<InvitacionProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #f5ede6 0%, #e8ddd4 50%, #f0ebe4 100%)`,
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Sección 1: Portada (0s - 3s) */}
      <Sequence from={0} durationInFrames={90}>
        <Portada {...props} />
      </Sequence>

      {/* Sección 2: Nos Casamos (3s - 5.5s) */}
      <Sequence from={90} durationInFrames={75}>
        <NosCasamos {...props} />
      </Sequence>

      {/* Sección 3: Cuándo y Dónde (5.5s - 8s) */}
      <Sequence from={165} durationInFrames={75}>
        <CuandoDonde {...props} />
      </Sequence>

      {/* Sección 4: Cierre (8s - 10s) */}
      <Sequence from={240} durationInFrames={60}>
        <Cierre {...props} />
      </Sequence>

      {/* Decoraciones flotantes constantes */}
      <Decoraciones frame={frame} color={props.colorSecundario} />
    </AbsoluteFill>
  );
};

// ============================================
// SECCIÓN: PORTADA
// ============================================
const Portada: React.FC<InvitacionProps> = ({
  novia,
  novio,
  fechaCorta,
  colorPrimario,
  colorDorado,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scaleFlower = spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 });

  const slideUpNovia = spring({ frame: frame - 15, fps, from: 50, to: 0, durationInFrames: 25 });
  const slideUpNovio = spring({ frame: frame - 25, fps, from: 50, to: 0, durationInFrames: 25 });
  const opNovia = interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opNovio = interpolate(frame, [25, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fadeDate = interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade out al final
  const fadeOut = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Flor decorativa */}
      <div
        style={{
          fontSize: 80,
          transform: `scale(${scaleFlower})`,
          marginBottom: 30,
          opacity: 0.7,
        }}
      >
        &#10048;
      </div>

      {/* Subtítulo */}
      <div
        style={{
          fontSize: 24,
          letterSpacing: 4,
          color: colorPrimario,
          textTransform: "uppercase",
          fontWeight: 300,
          marginBottom: 20,
        }}
      >
        &#161;Nos casamos!
      </div>

      {/* Nombre Novia */}
      <div
        style={{
          fontSize: 90,
          fontStyle: "italic",
          color: "#4a4a4a",
          transform: `translateY(${slideUpNovia}px)`,
          opacity: opNovia,
        }}
      >
        {novia}
      </div>

      {/* Ampersand */}
      <div
        style={{
          fontSize: 60,
          color: colorDorado,
          margin: "10px 0",
          opacity: opNovia,
        }}
      >
        &amp;
      </div>

      {/* Nombre Novio */}
      <div
        style={{
          fontSize: 90,
          fontStyle: "italic",
          color: "#4a4a4a",
          transform: `translateY(${slideUpNovio}px)`,
          opacity: opNovio,
        }}
      >
        {novio}
      </div>

      {/* Fecha */}
      <div
        style={{
          fontSize: 32,
          letterSpacing: 6,
          color: "#7a7a7a",
          marginTop: 40,
          fontWeight: 300,
          opacity: fadeDate,
        }}
      >
        {fechaCorta}
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SECCIÓN: NOS CASAMOS + COUNTDOWN
// ============================================
const NosCasamos: React.FC<InvitacionProps> = ({
  novia,
  novio,
  fecha,
  hora,
  lugar,
  ciudad,
  colorPrimario,
  colorDorado,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [60, 75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const slideCard = spring({ frame: frame - 5, fps, from: 100, to: 0, durationInFrames: 20 });
  const opCard = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn * fadeOut,
        padding: 60,
      }}
    >
      {/* Título script */}
      <div
        style={{
          fontSize: 72,
          fontStyle: "italic",
          color: "#4a4a4a",
          marginBottom: 10,
        }}
      >
        {novia} & {novio}
      </div>

      {/* Línea divisoria */}
      <div
        style={{
          width: 120,
          height: 2,
          background: colorDorado,
          margin: "20px 0",
        }}
      />

      {/* Info card */}
      <div
        style={{
          transform: `translateY(${slideCard}px)`,
          opacity: opCard,
          background: "rgba(255,255,255,0.8)",
          borderRadius: 24,
          padding: "50px 60px",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          marginTop: 30,
        }}
      >
        <div style={{ fontSize: 22, color: colorPrimario, letterSpacing: 3, marginBottom: 15 }}>
          LA CELEBRACI&Oacute;N
        </div>
        <div style={{ fontSize: 34, color: "#4a4a4a", marginBottom: 8 }}>
          {fecha}
        </div>
        <div style={{ fontSize: 28, color: "#7a7a7a", marginBottom: 20 }}>
          {hora}
        </div>
        <div
          style={{
            width: 80,
            height: 1,
            background: colorPrimario,
            margin: "15px auto",
            opacity: 0.4,
          }}
        />
        <div style={{ fontSize: 30, color: "#4a4a4a", marginTop: 15 }}>
          {lugar}
        </div>
        <div style={{ fontSize: 24, color: "#7a7a7a" }}>
          {ciudad}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SECCIÓN: CUÁNDO Y DÓNDE
// ============================================
const CuandoDonde: React.FC<InvitacionProps> = ({
  dressCode,
  colorPrimario,
  colorSecundario,
  colorDorado,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [60, 75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const scaleCard = spring({ frame: frame - 10, fps, from: 0.8, to: 1, durationInFrames: 20 });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn * fadeOut,
        padding: 60,
      }}
    >
      <div style={{ fontSize: 22, color: colorPrimario, letterSpacing: 3, marginBottom: 15 }}>
        C&Oacute;DIGO DE VESTIMENTA
      </div>

      <div style={{ fontSize: 48, color: "#4a4a4a", fontStyle: "italic", marginBottom: 40 }}>
        Dress Code
      </div>

      {/* Card dress code */}
      <div
        style={{
          transform: `scale(${scaleCard})`,
          background: "white",
          borderRadius: 30,
          padding: "60px 80px",
          textAlign: "center",
          boxShadow: "0 15px 50px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontSize: 50, color: colorDorado, marginBottom: 20 }}>&#9671;</div>
        <div style={{ fontSize: 36, color: "#4a4a4a", marginBottom: 12 }}>
          {dressCode}
        </div>
        <div style={{ fontSize: 24, color: "#7a7a7a", marginBottom: 30 }}>
          Colores suaves y tonos tierra
        </div>

        {/* Color dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>
          <ColorDot color="#d4c5a9" label="Beige" />
          <ColorDot color={colorPrimario} label="Verde" />
          <ColorDot color={colorSecundario} label="Flores" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SECCIÓN: CIERRE
// ============================================
const Cierre: React.FC<InvitacionProps> = ({
  novia,
  novio,
  fechaCorta,
  hashtag,
  colorPrimario,
  colorDorado,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const scaleHash = spring({ frame: frame - 20, fps, from: 0.5, to: 1, durationInFrames: 20 });
  const opHash = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn,
        background: `linear-gradient(180deg, #f0ebe4 0%, #e8e0d8 100%)`,
      }}
    >
      <div style={{ fontSize: 60, opacity: 0.5, marginBottom: 30 }}>&#10048;</div>

      <div style={{ fontSize: 30, fontStyle: "italic", color: "#4a4a4a", marginBottom: 15 }}>
        &ldquo;El amor en flor&hellip;&rdquo;
      </div>

      <div style={{ fontSize: 24, color: "#7a7a7a", marginBottom: 20 }}>
        Los esperamos en el jard&iacute;n.
      </div>

      <div
        style={{
          fontSize: 70,
          fontStyle: "italic",
          color: "#4a4a4a",
          margin: "20px 0",
        }}
      >
        {novia} & {novio}
      </div>

      <div style={{ fontSize: 28, letterSpacing: 5, color: "#7a7a7a", marginTop: 10 }}>
        {fechaCorta}
      </div>

      {/* Hashtag */}
      <div
        style={{
          marginTop: 50,
          transform: `scale(${scaleHash})`,
          opacity: opHash,
          background: "rgba(255,255,255,0.7)",
          padding: "15px 40px",
          borderRadius: 30,
          border: `1px solid ${colorPrimario}40`,
        }}
      >
        <div style={{ fontSize: 32, color: colorPrimario, fontWeight: 600 }}>
          {hashtag}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// COMPONENTES AUXILIARES
// ============================================
const ColorDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    <div
      style={{
        width: 55,
        height: 55,
        borderRadius: "50%",
        background: color,
        border: "3px solid rgba(0,0,0,0.05)",
      }}
    />
    <span style={{ fontSize: 18, color: "#7a7a7a" }}>{label}</span>
  </div>
);

const Decoraciones: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  // Pétalos flotantes animados
  const petals = [
    { x: 80, y: 200, size: 20, rotation: frame * 0.5, delay: 0 },
    { x: 950, y: 350, size: 16, rotation: frame * -0.3, delay: 20 },
    { x: 100, y: 1400, size: 18, rotation: frame * 0.4, delay: 40 },
    { x: 900, y: 1600, size: 14, rotation: frame * -0.6, delay: 10 },
    { x: 500, y: 100, size: 15, rotation: frame * 0.3, delay: 30 },
  ];

  return (
    <>
      {petals.map((petal, i) => {
        const floatY = Math.sin((frame + petal.delay) * 0.05) * 15;
        const opacity = interpolate(
          Math.sin((frame + petal.delay) * 0.03),
          [-1, 1],
          [0.1, 0.35]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: petal.x,
              top: petal.y + floatY,
              width: petal.size,
              height: petal.size * 1.4,
              background: color,
              borderRadius: "50% 50% 50% 0",
              transform: `rotate(${petal.rotation}deg)`,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

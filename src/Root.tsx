import { Composition } from "remotion";
import { InvitacionReel } from "./InvitacionReel";

// Datos de la boda - CAMBIÁ ESTO para cada invitación
const datosDefault = {
  novia: "Luciana",
  novio: "Gonzalo",
  fecha: "14 de marzo de 2027",
  fechaCorta: "14 · 03 · 2027",
  hora: "17:30 hs",
  lugar: "Quinta Los Robles",
  ciudad: "Pilar, Buenos Aires",
  dressCode: "Elegante campestre",
  hashtag: "#LuciYGonza2027",
  colorPrimario: "#8b9e7c",
  colorSecundario: "#e8c4b8",
  colorDorado: "#c9a96e",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="InvitacionReel"
        component={InvitacionReel}
        durationInFrames={300} // 10 segundos a 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={datosDefault}
      />
    </>
  );
};

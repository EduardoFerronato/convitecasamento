import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  const font = await fetch(
    "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86GnM.ttf",
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050a14",
        }}
      >
        <div
          style={{
            width: 392,
            height: 392,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 32% 28%, #121c32 0%, #0d1528 55%, #050a14 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid #121c32",
          }}
        >
          <div
            style={{
              fontSize: 118,
              color: "#e9d4a0",
              fontFamily: "Cormorant Garamond",
              letterSpacing: -2,
              marginTop: 8,
            }}
          >
            A | E
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Cormorant Garamond", data: font, style: "normal", weight: 400 }],
    },
  );
}

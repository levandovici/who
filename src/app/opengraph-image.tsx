import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "who.michitai.com — free WHOIS & DNS domain lookup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 600, letterSpacing: -2 }}>who.michitai.com</div>
        <div style={{ fontSize: 36, color: "#a1a1aa", marginTop: 16 }}>
          WHOIS &middot; RDAP &middot; DNS &middot; IP intelligence
        </div>
      </div>
    ),
    size,
  );
}

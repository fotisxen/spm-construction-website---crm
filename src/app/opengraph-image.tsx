import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#1c1917",
          color: "#faf6f0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: -0.5,
          }}
        >
          {siteConfig.shortName}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 60, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>
            Ανακαινίζουμε ακίνητα σαν να ήταν δικά μας.
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#c9beb2" }}>
            {siteConfig.tagline}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

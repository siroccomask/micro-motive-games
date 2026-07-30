import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#ee6b4d",
          borderRadius: 18,
          color: "#ffffff",
          display: "flex",
          fontFamily: "Georgia",
          fontSize: 46,
          fontStyle: "italic",
          height: "100%",
          justifyContent: "center",
          lineHeight: 1,
          width: "100%",
        }}
      >
        m
      </div>
    ),
    size,
  );
}

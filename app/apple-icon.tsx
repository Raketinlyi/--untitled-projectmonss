import { ImageResponse } from "next/og"

// Размеры иконки
export const size = {
  width: 180,
  height: 180,
}

export const contentType = "image/png"

// Генерация иконки
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#F2B705", // Желтый цвет как на логотипе
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "24px", // Скругленные углы
      }}
    >
      <div
        style={{
          width: "60%",
          height: "60%",
          background: "#000000", // Черный цвет для внутреннего элемента
          borderRadius: "50%", // Круглая форма для внутреннего элемента
        }}
      />
    </div>,
    {
      ...size,
    },
  )
}

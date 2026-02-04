import React from "react"
import { IconType } from "./IconType"

export const IconLogo: React.FC<IconType> = (props) => (
  <svg
    width="180"
    height="50"
    viewBox="0 0 180 50"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="180" height="50" rx="12" fill="#5D3FD3" />

    <g transform="translate(15, 12)">
      <rect
        width="26"
        height="26"
        rx="6"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M6 13L11 18L20 7"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#5D3FD3"
      />
    </g>

    <text
      x="52"
      y="33"
      fill="white"
      fontSize="26"
      fontWeight="700"
      fontFamily="Inter, system-ui, -apple-system, sans-serif"
    >
      Tasky
    </text>
  </svg>
)

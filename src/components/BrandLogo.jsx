export function BrandLogo({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="10"
        fill="#16222F"
        stroke="#2D3F52"
        strokeWidth="1.2"
      />
      <circle cx="26.5" cy="13.5" r="4.5" fill="#E29A3B" />
      <path
        d="M13.2 23.7H25.6C27.5 23.7 29 22.2 29 20.3C29 18.5 27.6 17 25.8 16.8C25.2 13.5 22.4 11.1 19 11.1C15.8 11.1 13.1 13.2 12.4 16.2C10.5 16.6 9 18.2 9 20.1C9 22.1 10.9 23.7 13.2 23.7Z"
        fill="#EAF1F8"
        stroke="#16222F"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect
        x="14.7"
        y="25.9"
        width="2.6"
        height="5.1"
        rx="1.3"
        fill="#3BA4D1"
        transform="rotate(18 16 28.45)"
      />
      <rect
        x="20.7"
        y="25.9"
        width="2.6"
        height="5.1"
        rx="1.3"
        fill="#3BA4D1"
        transform="rotate(18 22 28.45)"
      />
    </svg>
  )
}

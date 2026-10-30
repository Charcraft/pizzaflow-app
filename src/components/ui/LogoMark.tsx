export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-[10px] bg-tomato text-white"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        width={Math.round(size * 0.62)}
        height={Math.round(size * 0.62)}
        fill="none"
      >
        <circle cx="12" cy="12" r="8.4" fill="currentColor" />
        <circle cx="9" cy="9.6" r="1.35" fill="#C2410C" />
        <circle cx="14.6" cy="8.6" r="1.05" fill="#C2410C" />
        <circle cx="9.8" cy="14.6" r="1.15" fill="#C2410C" />
        <circle cx="15" cy="13.7" r="1.25" fill="#C2410C" />
        <circle cx="13.2" cy="17" r="0.8" fill="#15803D" />
        <path d="M12 3.6v1.6" stroke="#C2410C" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  )
}

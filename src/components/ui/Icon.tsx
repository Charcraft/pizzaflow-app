import type { SVGProps } from 'react'

export type IconName =
  | 'pizza'
  | 'bag'
  | 'arrow-right'
  | 'arrow-left'
  | 'clock'
  | 'flame'
  | 'receipt'
  | 'chart'
  | 'store'
  | 'home'
  | 'check'
  | 'chevron-right'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'phone'
  | 'map-pin'
  | 'users'
  | 'user-plus'
  | 'spark'

const PATHS: Record<IconName, React.ReactNode> = {
  pizza: (
    <>
      <path d="M12 3 3 21c5.5-1.6 12.5-1.6 18 0L12 3Z" />
      <circle cx="10" cy="12" r="1" />
      <circle cx="14" cy="16" r="1" />
      <circle cx="12" cy="8.5" r="1" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  'arrow-left': (
    <>
      <path d="M20 12H4" />
      <path d="m10 18-6-6 6-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  flame: (
    <path d="M12 3c1.5 4 5 5.5 5 9a5 5 0 0 1-10 0c0-1.9 1-3.2 2.2-4.6.5 1.3 1.2 2.2 2.3 2.8C12.4 8.3 12 5.5 12 3Z" />
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  store: (
    <>
      <path d="M4 10v10h16V10" />
      <path d="m3 10 2-6h14l2 6" />
      <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v11h14V10" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M6 7l1 14h10l1-14" />
    </>
  ),
  phone: (
    <path d="M7 3h3l2 5-2 1a12 12 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 5 5a2 2 0 0 1 2-2Z" />
  ),
  'map-pin': (
    <>
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5a3 3 0 0 1 0 6M18 20c0-2.2-.8-4.2-2-5.6" />
    </>
  ),
  'user-plus': (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5v6M13 8h6" />
    </>
  ),
  spark: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  ),
}

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
  label?: string
}

export function Icon({ name, size = 20, label, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      {...props}
    >
      {PATHS[name]}
    </svg>
  )
}

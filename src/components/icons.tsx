/** Minimal inline SVG icon set — no icon font, no emoji. */

interface IconProps {
  size?: number
  className?: string
  strokeWidth?: number
}

const baseProps = (size: number, strokeWidth: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
})

export function ArrowRightIcon({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <path d="M4 12h16" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  )
}

export function ArrowDownIcon({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <path d="M12 4v16" />
      <path d="m5 13 7 7 7-7" />
    </svg>
  )
}

export function DownloadIcon({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 21h16" />
    </svg>
  )
}

export function MenuIcon({ size = 20, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

export function CloseIcon({ size = 20, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}

export function ArrowUpRightIcon({ size = 14, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}

export function MailIcon({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export function BackIcon({ size = 16, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <path d="M12 4v16" />
      <path d="m19 9-7 7-7-7" />
    </svg>
  )
}

export function ExternalIcon({ size = 13, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <path d="M15 3h6v6" />
      <path d="M19 5l-6 6-4-4" />
    </svg>
  )
}

export function BookOpenIcon({ size = 14, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <path d="M2 3h6a6 6 0 0 1 6 6v12" />
      <path d="M22 3H16a6 6 0 0 0-6 6v12" />
      <path d="M8 21a4 4 0 0 1 4-4" />
      <path d="M16 21a4 4 0 0 0-4-4" />
    </svg>
  )
}

export function FileTextIcon({ size = 14, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  )
}

export function SearchIcon({ size = 14, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <circle cx="9" cy="9" r="5" />
      <path d="m15 15 3 3" />
    </svg>
  )
}

export function WarningIcon({ size = 13, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...baseProps(size, strokeWidth)} className={className}>
      <path d="M12 9v4" />
      <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    </svg>
  )
}

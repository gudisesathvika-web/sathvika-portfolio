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

export function SunIcon({ size = 18, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

export function MoonIcon({ size = 18, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
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

export function GitHubIcon({ size = 15, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden={true}
      focusable={false}
    >
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.24-.02-2.25-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58C20.57 22.29 24 17.79 24 12.5 24 5.87 18.63.5 12 .5Z" />
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

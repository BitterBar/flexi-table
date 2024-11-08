type CopyIconProps = {
  size?: number
  color?: string
}

export default function CopyIcon({
  size = 24,
  color = 'currentColor',
}: CopyIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon"
    >
      <rect x="8" y="8" width="12" height="12" rx="2"></rect>
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
    </svg>
  )
}

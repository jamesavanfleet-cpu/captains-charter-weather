// WindArrow — directional wind arrow SVG
interface WindArrowProps {
  deg: number;
  color?: string;
  size?: number;
}

export default function WindArrow({ deg, color = "#00D4FF", size = 24 }: WindArrowProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: `rotate(${deg}deg)`, display: "inline-block" }}
    >
      <path d="M12 3L12 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 8L12 3L17 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

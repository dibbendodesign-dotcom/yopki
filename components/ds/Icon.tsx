type IconProps = {
  /** Path to a single-colour SVG in /public. */
  src: string;
  size?: number;
  className?: string;
};

/**
 * Renders a single-colour SVG icon tinted with `currentColor`, so DS icon
 * slots ("Pick Icon") can take their colour from text/icon tokens.
 */
export function Icon({ src, size = 20, className = "" }: IconProps) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

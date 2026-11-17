type LogoProps = {
  size?: number;
  withText?: boolean;
};

export function Logo({ size = 44, withText = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="WorkoutApp logo"
      >
        <defs>
          <linearGradient
            id="logoGrad"
            x1="0"
            y1="0"
            x2="44"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#7B61FF" />
            <stop offset="100%" stopColor="#00E5A0" />
          </linearGradient>
          <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#C8BFFF" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <rect width="44" height="44" rx="12" fill="url(#logoGrad)" />

        <rect
          x="12"
          y="20"
          width="20"
          height="4"
          rx="2"
          fill="white"
          fillOpacity="0.9"
        />

        <rect x="8" y="15" width="5" height="14" rx="2.5" fill="white" />

        <rect x="31" y="15" width="5" height="14" rx="2.5" fill="white" />

        <path
          d="M25 10 L19 23 H23.5 L19 34 L29 20 H24.5 Z"
          fill="url(#boltGrad)"
          fillOpacity="0.92"
        />
      </svg>

      {withText && (
        <span
          className="text-xl font-bold tracking-tight"
          style={{ color: 'var(--color-text)' }}
        >
          Workout<span style={{ color: 'var(--color-accent)' }}>App</span>
        </span>
      )}
    </div>
  );
}

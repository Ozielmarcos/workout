import { ImageResponse } from 'next/og';

export const alt = 'WorkoutApp — Monte seus treinos e acompanhe sua evolução';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0E0E14 0%, #1A1A2E 100%)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 24,
          background: 'linear-gradient(135deg, #7B61FF, #00E5A0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <svg width="64" height="64" viewBox="0 0 44 44" fill="none">
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
            fill="white"
            fillOpacity="0.9"
          />
        </svg>
      </div>

      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -2,
          color: 'white',
          display: 'flex',
        }}
      >
        Workout
        <span style={{ color: '#00E5A0' }}>App</span>
      </div>

      <div
        style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.6)',
          marginTop: 16,
          textAlign: 'center',
          maxWidth: 700,
        }}
      >
        Monte seus treinos, calcule seu IMC e acompanhe sua evolução física
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 48 }}>
        {['876+ Exercícios', 'Cálculo de IMC', 'Treinos Personalizados'].map(
          (text) => (
            <div
              key={text}
              style={{
                padding: '10px 24px',
                borderRadius: 999,
                background: 'rgba(123,97,255,0.2)',
                border: '1px solid rgba(123,97,255,0.4)',
                color: 'rgba(255,255,255,0.9)',
                fontSize: 18,
              }}
            >
              {text}
            </div>
          ),
        )}
      </div>
    </div>,
    { ...size },
  );
}

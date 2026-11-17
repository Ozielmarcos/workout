import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: {
    default: 'WorkoutApp',
    template: '%s | WorkoutApp',
  },
  description:
    'Monte treinos personalizados, calcule seu IMC e acompanhe sua evolução física. Mais de 876 exercícios com filtros por grupo muscular, nível e equipamento.',
  keywords: ['treino', 'academia', 'exercícios', 'IMC', 'fitness', 'musculação', 'saúde'],
  authors: [{ name: 'WorkoutApp' }],
  creator: 'WorkoutApp',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: 'WorkoutApp — Monte seus treinos e acompanhe sua evolução',
    description:
      'Crie séries de exercícios personalizadas, calcule seu IMC e evolua com mais de 876 exercícios catalogados.',
    siteName: 'WorkoutApp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorkoutApp — Monte seus treinos e acompanhe sua evolução',
    description:
      'Crie séries de exercícios personalizadas, calcule seu IMC e evolua com mais de 876 exercícios catalogados.',
  },
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

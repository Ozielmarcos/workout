import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'

export function errorHandler(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { status, message } = prismaError(err)
    res.status(status).json({ message })
    return
  }

  const status = err.status ?? 500
  if (status === 500) console.error('[500]', err)
  const message = status === 500 ? 'Erro interno do servidor' : err.message
  res.status(status).json({ message })
}

function prismaError(err: Prisma.PrismaClientKnownRequestError): { status: number; message: string } {
  switch (err.code) {
    case 'P2002': {
      const field = (err.meta?.target as string[] | undefined)?.[0] ?? 'campo'
      return { status: 409, message: `Já existe um registro com esse ${field}.` }
    }
    case 'P2025':
      return { status: 404, message: 'Registro não encontrado.' }
    case 'P2003':
      return { status: 422, message: 'Referência inválida: o registro relacionado não existe.' }
    default:
      console.error('[Prisma]', err.code, err)
      return { status: 500, message: 'Erro interno do servidor.' }
  }
}

export function createError(message: string, status: number): Error & { status: number } {
  const err = new Error(message) as Error & { status: number }
  err.status = status
  return err
}

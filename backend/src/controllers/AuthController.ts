import { Request, Response } from 'express'
import { AuthService } from '../services/AuthService.js'

export class AuthController {
  constructor(private readonly service: AuthService) {}

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ message: 'Email e senha são obrigatórios' })
      return
    }
    const result = await this.service.login(email, password)
    res.status(200).json(result)
  }
}

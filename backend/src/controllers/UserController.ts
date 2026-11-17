import { Request, Response } from 'express'
import { UserService } from '../services/UserService.js'

export class UserController {
  constructor(private readonly service: UserService) {}

  create = async (req: Request, res: Response) => {
    const user = await this.service.create(req.body)
    res.status(201).json(user)
  }

  update = async (req: Request, res: Response) => {
    const id = String(req.params.id)
    const user = await this.service.update(id, req.userId, req.body)
    res.status(200).json(user)
  }

  me = async (req: Request, res: Response) => {
    const user = await this.service.getById(req.userId)
    res.status(200).json(user)
  }
}

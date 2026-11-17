import { Request, Response } from 'express'
import { UserProfileService } from '../services/UserProfileService.js'

export class UserProfileController {
  constructor(private readonly service: UserProfileService) {}

  get = async (req: Request, res: Response) => {
    const profile = await this.service.get(req.userId)
    res.status(200).json(profile)
  }

  create = async (req: Request, res: Response) => {
    const profile = await this.service.create(req.userId, req.body)
    res.status(201).json(profile)
  }

  update = async (req: Request, res: Response) => {
    const profile = await this.service.update(req.userId, req.body)
    res.status(200).json(profile)
  }

  delete = async (req: Request, res: Response) => {
    await this.service.delete(req.userId)
    res.status(204).send()
  }
}

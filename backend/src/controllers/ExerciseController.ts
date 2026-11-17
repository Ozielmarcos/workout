import { Request, Response } from 'express'
import { ExerciseService } from '../services/ExerciseService.js'
import { parsePagination } from '../validators/index.js'

export class ExerciseController {
  constructor(private readonly service: ExerciseService) {}

  list = async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query as Record<string, unknown>)
    const { category, level, equipment, primaryMuscle, search } = req.query as Record<string, string>
    const result = await this.service.list(pagination, { category, level, equipment, primaryMuscle, search })
    res.status(200).json(result)
  }

  getById = async (req: Request, res: Response) => {
    const exercise = await this.service.getById(String(req.params.id))
    res.status(200).json(exercise)
  }

  create = async (req: Request, res: Response) => {
    const exercise = await this.service.create(req.body)
    res.status(201).json(exercise)
  }

  update = async (req: Request, res: Response) => {
    const exercise = await this.service.update(String(req.params.id), req.body)
    res.status(200).json(exercise)
  }

  delete = async (req: Request, res: Response) => {
    await this.service.delete(String(req.params.id))
    res.status(204).send()
  }
}

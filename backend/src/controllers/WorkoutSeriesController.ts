import { Request, Response } from 'express'
import { WorkoutSeriesService } from '../services/WorkoutSeriesService.js'
import { parsePagination } from '../validators/index.js'

export class WorkoutSeriesController {
  constructor(private readonly service: WorkoutSeriesService) {}

  list = async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query as Record<string, unknown>)
    const result = await this.service.list(req.userId, pagination)
    res.status(200).json(result)
  }

  getById = async (req: Request, res: Response) => {
    const series = await this.service.getById(String(req.params.id), req.userId)
    res.status(200).json(series)
  }

  create = async (req: Request, res: Response) => {
    const series = await this.service.create(req.userId, req.body)
    res.status(201).json(series)
  }

  update = async (req: Request, res: Response) => {
    const series = await this.service.update(String(req.params.id), req.userId, req.body)
    res.status(200).json(series)
  }

  delete = async (req: Request, res: Response) => {
    await this.service.delete(String(req.params.id), req.userId)
    res.status(204).send()
  }
}

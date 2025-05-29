import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    // 已知的操作错误
    return res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message
    })
  }

  // 记录未知错误
  logger.error('Unexpected error:', {
    error: err,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  })

  // 返回通用错误响应
  res.status(500).json({
    code: 500,
    message: 'Internal server error'
  })
} 
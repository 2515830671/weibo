import winston from 'winston'
import { config } from '../config'

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
)

// 开发环境使用控制台输出
const developmentTransports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
]

// 生产环境使用文件输出
const productionTransports = [
  new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  new winston.transports.File({ filename: 'logs/combined.log' })
]

export const logger = winston.createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  format,
  transports:
    config.nodeEnv === 'development' ? developmentTransports : productionTransports
}) 
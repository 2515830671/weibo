import app from './app'
import { config } from './config'
import { logger } from './utils/logger'

const port = config.port || 3000

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
}) 
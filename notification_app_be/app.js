import { createApp } from './src/app.js'
import { environment } from './src/config/environment.js'
import { Log } from 'logging_middleware'

const app = createApp()

app.listen(environment.port, () => {
  void Log('backend', 'info', 'handler', `Notification backend listening on port ${environment.port}`)
})

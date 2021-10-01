import * as express from 'express'
import { makeTeamsAmpqWacher } from './main/factories/services/teams-amqp-watcher.factory'
import { Server } from './config/config'
import messagesController from './main/controllers/messages.controller'
import searchController from './main/controllers/search.controller'
import { MessageReader } from './domain/contracts/message-reader.interface'

(async function main() {
  const app = express()
  app.use(express.json())

  app.use('/files', express.static('tmp'))
  app.use('/assets', express.static('assets'))

  makeTeamsAmpqWacher()
    .then((watcher: MessageReader) => {
      watcher.read()
    })
    .then(() => {
      app.get('/', async (_req, res) => res.end('Ok'))
      app.post('/api/messages', messagesController)
      app.get('/api/search', searchController)
    
      app.listen(Server.port, () => {
        console.log(`Example app listening at http://localhost:${Server.port}`)
      })
    })
  
})()

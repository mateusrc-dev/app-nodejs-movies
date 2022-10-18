//esse arquivo vai ter a missão de reunir todas as rotas da aplicação

const { Router } = require("express")

const usersRouter = require("./users.routes") //importando o arquivo que tem as rotas de users
const notesRouter = require("./notes.routes")
const tagsRouter = require("./tags.routes")
const sessionsRouter = require("./sessions.routes")

const routes = Router()

routes.use("/users", usersRouter) //toda vez que alguém for acessar a rota '/users' vai ser redirecionado para o usersRouter
routes.use("/notes", notesRouter)
routes.use("/tags", tagsRouter)
routes.use("/sessions", sessionsRouter)

module.exports = routes;//para exportar usamos module.exports - esse routes contém todas as rotas da nossa aplicação
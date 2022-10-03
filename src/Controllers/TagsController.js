const knex = require("../database/knex")
class TagsController {
  async index(request, response) { //função que vai ser responsável por listar todas as tags cadastradas do usuário
    const {user_id} = request.params //pegando o user_id do parâmetro
    const tags = await knex("movie_tags").where({user_id}) //indo nas tags e pegando apenas as tags que tem o user_id especificado
    return response.json(tags) //devolvendo as tags
  }
}

module.exports = TagsController;
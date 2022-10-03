const { hash, compare } = require("bcrypt") //pegando de dentro de bcrypt a função que gera a criptografia
const AppError = require("../utils/AppError") //importando o arquivo que tem o padrão de mensagem das exceções
const sqliteConnection = require("../database/sqlite") //importando o arquivo que faz a conexão com o banco de dados
class UsersController { //vamos usar class porque ela permite que dentro dela possamos criar várias funções e acessar várias funções depois
  /** - um controller pode ter no máximo 5 métodos (ou 5 funções):
   * index - método GET para listar vários registros
   * show - método GET para exibir um registro específico
   * create - método POST para criar um registro
   * update - método PUT para atualizar um registro
   * delete - método DELETE para remover um registro
   * - se precisar criar mais de 5 métodos, vale a pena criar um controller separado
  */
   async create(request, response) { //é aqui onde é processado as informações, a requisição do usuário e a resposta da requisição, não em rotes - aqui é onde o usuário é criado
    const { name, email, password } = request.body //desestruturando - estamos "pescando" as informações do body / no POST as informações são enviadas pelo body
    const database = await sqliteConnection() //await é para esperar, pois vamos lidar com requisições assíncronas, se conectar com banco de dados não ocorre imediatamente
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]) //onde tem interrogação vai ser substituído pela variável email - WHERE significa onde e seleciona apenas a linha da tabela que tiver o email específico - o get é pra pegar do database
    if (checkUserExists) { //criando exceção, caso o email não existir vai entrar nas chaves
      throw new AppError("Este e-mail já está em uso!")
    }

    const hashedPassword = await hash(password, 8) //na função de hash passamos dois parâmetros, senha e o salt (fator de complexidade do hash) - tem que colocar await pois a função hash é uma promessa /criptografando a senha

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]) //o run é pra executar uma inserção no database - como vamos inserir três valores para as respectivas colunas - colocamos três interrogações que vão receber as variáveis que estão no vetor (os dados dessas variáveis vão vim do usuário)

    return response.status(201).json()
    
    //response.send(`Usuário: ${name} - Email: ${email} - Senha: ${password}`); //precisamos usar o insomnia para obter essa resposta, pois o navegador trabalha apenas com o GET - ao usar 'send' para devolver as informações, essas informações são devolvidas como um html
    /*if(!name) { //se não existir o nome vai entrar nas chaves
      throw new AppError("Nome é obrigatório!") //fazendo uma excessão - o que está sendo digitado entre parenteses vai ser a message no construtor
    }
    response.status(201).json({name, email, password}) //se no lugar de 'send' usarmos 'json' essas informações vão ser devolvidas como json*/
  }

  async update(request, response) { //funcionalidade de atualização do usuário
    const { name, email, password, old_password } = request.body //pegando o corpo da requisição
    const { id } = request.params; //o id está sendo pego do caminho, pois ele foi colocado como parâmetro
    const database = await sqliteConnection() //fazendo conexão com o banco de dados
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]) //selecionando todos as colunas da linha que tem o respectivo id
    if (!user) { //caso o usuário não exista vai entrar nas chaves
      throw new AppError("Usuário não encontrado!")
    } 
    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]) //selecionando todas as colunas da linha que tem o respectivo email
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) { //verificando se a pessoa está tentando mudar um email pra outro que já usado por outra pessoa
    throw new AppError("Este e-mail já está em uso!")
    }
    user.name = name ?? user.name; //atualizando o nome do user que foi pego através do id - a interrogação significa que se não existir conteúdo dentro de name então vai ser utilizado o user.name - as interrogações é um null operator
    user.email = email ?? user.email; //atualizando o email do user

    if (password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha!")
    }

    if (password && old_password) { 
      const checkOldPassword = await compare(old_password, user.password) //comparando se a senha antiga inserida pelo usuário (old_password) é igual a que está no banco de dados (user.password) - compare é uma funcionalidade de bcrypt que serve para comparar senhas, é possível comparar a senha que está criptografada no banco de dados (user.password) com a senha que não está que foi inserida pelo usuário (old_password)
      if(!checkOldPassword) { //se caso a senha digitada pelo usuário não for igual a do banco de dados, vai entrar nas chaves
        throw new AppError("A senha antiga não confere!")
      }
      user.password = await hash(password, 8) //atualizando a senha caso passe por todas as verificações e criptografando ela com a função hash
    }

    await database.run(`
    UPDATE users SET 
    name = ?, 
    email = ?,
    password = ?, 
    update_at = DATETIME('now')
    WHERE id = ?`, 
    [user.name, user.email, user.password, id]); //aqui está sendo atualizado o banco de dados, são comandos SQL (UPDATE users SET) pra atualizar o banco de dados - WHERE é pra identificar a linha específica que será modificado o valor das colunas - DATETIME() é uma função do banco de dados que pega o momento atual (data e hora), estamos fazendo isso porque a função Date() do JS tem um padrão de escrever a data e hora diferente da função do banco de dados
    return response.json()
  }
}
module.exports = UsersController;
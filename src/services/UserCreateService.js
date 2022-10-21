const { hash } = require("bcrypt") //pegando de dentro de bcrypt a função que gera a criptografia
const AppError = require("../utils/AppError") //importando o arquivo que tem o padrão de mensagem das exceções
class UserCreateService {
  constructor(userRepository) { //não podemos ter dependências, vamos passar o UserRepository como um parâmetro ao instanciar essa class (UserCreateService) = construtor faz parte da class, ele tem que ficar no nível da class e não dentro da função
    this.userRepository = userRepository; //this significa que vai deixar o userRepository disponível para a classe como um todo
  }
  async execute({ name, email, password }) {
    //const userRepository = new UserRepository() //instanciando o UserRepository porque ele é uma class - como foi passado pelo constructor o userRepository não precisamos mais instanciar aqui
    //await é para esperar, pois vamos lidar com requisições assíncronas, se conectar com banco de dados não ocorre imediatamente
    const checkUserExists = await this.userRepository.findByEmail(email) //usar o await pois é assíncrono
    //const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]) //onde tem interrogação vai ser substituído pela variável email - WHERE significa onde e seleciona apenas a linha da tabela que tiver o email específico - o get é pra pegar do database
    if (checkUserExists) { //criando exceção, caso o email não existir vai entrar nas chaves
      throw new AppError("Este e-mail já está em uso!")
    }

    const hashedPassword = await hash(password, 8) //na função de hash passamos dois parâmetros, senha e o salt (fator de complexidade do hash) - tem que colocar await pois a função hash é uma promessa /criptografando a senha

    const userCreated = await this.userRepository.create({ name, email, password: hashedPassword })
    //await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]) //o run é pra executar uma inserção no database - como vamos inserir três valores para as respectivas colunas - colocamos três interrogações que vão receber as variáveis que estão no vetor (os dados dessas variáveis vão vim do usuário)
    return userCreated
  }

}

module.exports = UserCreateService;
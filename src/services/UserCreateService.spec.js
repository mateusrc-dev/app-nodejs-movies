const UserCreateService = require("./UserCreateService")
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory")
const AppError = require("../utils/AppError") //importando porque vamos usar no teste
describe("UserCreateService", () => { //nomeando o nosso grupo - testes de usuário
  let userRepositoryInMemory = null;
  let userCreateService = null;
  beforeEach(() => { //essa função vai ser executada pra cada teste
  userRepositoryInMemory = new UserRepositoryInMemory() //vamos usar o UserRepositoryInMemory porque ele vai cadastrar as informações de usuário em um vetor (in memory) - teste independente do banco de dados
  userCreateService = new UserCreateService(userRepositoryInMemory) //enviando banco de dados para a lógica de usuários pelo parâmetro
  })  //vamos colocar aqui dentro da arrow function o que queremos que seja rodado antes de cada teste
  it("user should br create", async () => { //vamos colocar o async pra podermos usar o await
    const user = { //colocando abaixo dados de exemplo de um usuário
      name: "User Test",
      email: "user@email.com",
      password: "123"
    }
    const userCreated = await userCreateService.execute(user) //vamos passar para a função de execute (que tem a lógica de criar o usuário) os dados do usuário
    expect(userCreated).toHaveProperty("id") //vamos dizer que nossa expectativa é receber uma propriedade 'id' do retorno da função de criar um usuário 
  })
  it("user not should be create with exists email ", async () => { //outro teste dentro desse grupo de testes de usuário - cada teste é feito de forma independente, nosso vetor no RepositoryInMemory vai estar vazio
    const user1 = {
      name: 'User Test 1',
      email: 'user@test.com', //colocando dois emails iguais pra testar a validação de emails
      password: '123'
    }
    const user2 = {
      name: 'User Test 1',
      email: 'user@test.com', //colocando dois emails iguais pra testar a validação de emails
      password: '456'
    }
    await userCreateService.execute(user1) //cadastrando primeiro usuário
    await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError("Este e-mail já está em uso!")) //cadastrando segundo usuário - testar se a validação de email está funcionando (email do segundo usuário é igual ao do primeiro) - expectativa é que apareça um erro
  }) //estamos usando um banco de dados que guarda dados em memória, então não é assíncrono, mas como no cenário real usamos await, deixamos o await aqui
})
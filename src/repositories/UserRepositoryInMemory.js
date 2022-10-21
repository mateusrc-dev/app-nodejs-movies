class UserRepositoryInMemory {
  users = []
  async create({ email, name, password }) { //vai ser async pra ser compatível com o método do banco de dados que também é async - os testes tem que ser como no cenário real
    const user = {
      id: Math.floor(Math.random() * 1000) + 1, //criando um id aleatório
      email,
      name,
      password
    }
    this.users.push(user) //usar o this porque o users está no escopo global da class - push é o método pra adicionar elementos dentro do array
    return user
  }
  async findByEmail(email) {
    return this.users.find(user => user.email === email) //verificando se o email passado no parâmetro é o mesmo email de user
  }
}
module.exports = UserRepositoryInMemory
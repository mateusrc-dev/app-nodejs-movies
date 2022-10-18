//nesse arquivo vai ficar as rotas de usuário

const {Router} = require("express");//precisamos importar pra expor aqui o express
const multer = require("multer")
const uploadConfig = require("../configs/uploads")
const UsersController = require("../Controllers/UsersController")//importando o controller
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const UserAvatarController = require("../Controllers/UserAvatarController")
const usersController = new UsersController()//instanciando, ou seja, reservando um espaço na memória para a class
const userAvatarController = new UserAvatarController()

const usersRoutes = Router() //é preciso trazer o Router (expor o Router) para podermos usar abaixo no post
const upload = multer(uploadConfig.MULTER)
usersRoutes.post("/", usersController.create) //precisamos chamar o controller equivalente toda a vez que essa rota for chamada - podemos colocar nas rotas que desejamos fazer uma interceptação o middleware, no caso o middleware vai pegar a requisição e resposta da rota pra fazer algum tratamento, verificação na função
usersRoutes.put("/", ensureAuthenticated, usersController.update) //temos que passar um id como parâmetro, porque isso vai ser esperado, o resto, name e email, vai ser pego do corpo da requisição
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update)
module.exports = usersRoutes;//para expor a rota (userRoutes) para o server.js utilizar -> exportando o 'usersRoutes' para quem desejar poder utilizar

/*app.get("/message/:id/:user", (request, response) => {
  const {id, user} = request.params; //"pescando" de dentro de params o id e user - desestruturar
  response.send(`Id da mensagem: ${id}. Nome do usuário: ${user}.`) //id mostra o parâmetro que foi passado após /message/
})*/ //colocar entre aspas o endereço da rota - barra é a raiz da API - Express nos ajuda a gerenciar as requisições HTTP (como a GET) - request é a requisição que foi feita e response o recurso que posso utilizar pra fazer a resposta - colocando dois pontos depois de /message/ para indicar que será colocado um valor/parâmetro, e não um caminho - id é um parâmetro - podemos colocar quantos parâmetros desejar - no caso do route params é obrigatório na rota passar os parâmetros para a aplicação funcionar

/*app.get("/", (request, response) => {
  //const {page, limit} = request.query; //no query params não precisamos colocar no caminho os valores dos parâmetros - não é obrigatório na rota (no navegador) passar os valores de page e limit para a aplicação funcionar
  //response.send(`Página: ${page}. Mostrar: ${limit}.`);
});*/

/*function MyMiddleware(request, response, next) { //conseguimos extrair da função middleware a requisição, resposta e o destino da requisição
  console.log("Você passou pelo Middleware!")
  if (!request.body.isAdmin) { //teste lógico que verifica se o usuário é admin, se não for, vai entrar nas chaves - o next não vai ser executadox
    return response.json({message: "user unauthorized!"});
  }
  next(); //função do middleware que chama o destino (chama a próxima função a ser executada na pilha do middleware - que no caso é a função de criar o usuário) 
}*/
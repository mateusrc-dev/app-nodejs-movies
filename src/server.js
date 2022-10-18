require("express-async-errors"); //importação da biblioteca que lida com erros
const migrationsRun = require("./database/sqlite/migrations") //importando o banco de dados
const AppError = require("./utils/AppError") //vamos precisar desse AppError aqui nesse arquivo
const express = require("express") //Putting all the features that are in the express folder inside the express constant
const uploadConfig = require("./configs/uploads")
const cors = require("cors")

//const usersRoutes = require("./routes/users.rotes") //aqui estamos exportando do arquivo 'users.rotes' a rota  (usersRoutes) para ela ser exposta aqui ao server
const routes = require("./routes")//colocamos todas as rotas em um arquivo index para simplificar, colocando apenas routes no caminho em require, pois por padrão se não especificamos o arquivo será carregado o arquivo index

migrationsRun(); //executando o banco de dados

const app = express(); //initializing express to be able to use express
app.use(cors())

app.use(express.json()) //estamos dizendo para a aplicação que as requisições do body no POST vão ser do tipo object Json

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes); //expondo as rotas - aplicação vai usar essas rotas

app.use((error, request, response, next) => { //extraindo os parametros que vamos precisar pra mostrar o erro
  if(error instanceof AppError) {//erro que é gerado do lado do cliente
    return response.status(error.statusCode).json({status: "error", message: error.message})
  }
  return response.status(500).json({status: "error", message: "Internal server error"}) //se caso o error for no servidor, se no if acima for falso
})

const PORT = 3333; //saying which port, which address it will wait for requests, requests and return responses

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`)); //listen - keep watching, listening to the door - the function is to say what will be done when the application starts
exports.up = knex => knex.schema.createTable("movie_tags", table => { //processo de criar a tabela chamada movie_notes
  table.increments("id"); //dentro da tabela vamos ter um campo incremental chamado id
  table.text("name").notNullable(); //dentro da tabela vamos ter a coluna nome, um campo do tipo texto - notNullable é que não vai ser aceito valores nulos
  table.integer("user_id").references("id").inTable("users"); //criando um campo do tipo inteiro chamado user.id que faz referência ao id que existe dentro da tabela do usuário - ou seja, só existe uma tag se existir o usuário, porque a tag vai estar vínculada ao usuário
  table.integer("note_id").references("id").inTable("movie_notes").onDelete("CASCADE"); //onDelete("CASCADE") significa que se for deletado a nota a qual a tag está vínculada, a tag vai ser deletada também
}); 
exports.down = knex => knex.schema.dropTable("movie_tags"); //processo de deletar a tabela 
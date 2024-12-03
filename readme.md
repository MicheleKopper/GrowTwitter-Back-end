# Final de módulo - Banco de dados II | GrowTwitter

Este projeto é uma API que simula um Twitter. A aplicação permite que usuários façam login, criem, leiam, atualizem, curtam e excluam tweets. O sistema utiliza Node.js com o framework Express e a biblioteca Prisma para interação com o banco de dados.

![drawio](/src/assets/Final%20de%20modulo%20-%20Banco%20de%20dados%20II.drawio.png)

## Login

- Login da aplicação: POST /login
  ![0](/src/assets/0.jpg)

## Usuários

- Criar um novo: POST /usuarios
  ![01](/src/assets/01.jpg/)

- Listar todos: GET /usuarios
  ![02](/src/assets/02.jpg)

- Buscar por ID: GET /usuarios/:id_usuario
  ![03](/src/assets/03.jpg)

- Atualizar informações pelo ID: PUT /usuarios/:id_usuario
  ![04](/src/assets/04.jpg)

- Deletar pelo ID: DELETE /usuarios/:id_usuario
  ![05](/src/assets/05.jpg)

## Tweets

- Criar um tweet ou reply: POST /tweets
  ![06](/src/assets/06.jpg)

- Listar todos: GET /tweets
  ![07](/src/assets/07.jpg)

- Buscar pelo ID: GET /tweets/:id_usuario
  ![08](/src/assets/08.jpg)

- Atualizar um tweet: PUT /tweets/:id_usuario
  ![09](/src/assets/09.jpg)

- Deletar um tweet: /tweets/:id_usuario
  ![10](/src/assets/10.jpg)

## Likes

- Curtir um tweet: POST /likes
  ![11](/src/assets/11.jpg)

- Listar todos os likes de um tweet: GET /likes
  ![12](/src/assets/12.jpg)

- Buscar pelo ID: GET /likes/:id_usuario
  ![13](/src/assets/13.jpg)

- Atualizar pelo ID: PUT /likes/:id_like
  ![14](/src/assets/14.jpg)

- Deletar um like: /likes/:id_like
  ![15](/src/assets/15.jpg)

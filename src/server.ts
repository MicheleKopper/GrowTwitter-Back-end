import "dotenv/config";
import cors from "cors";
import express from "express";

// Servidor express
const app = express();
const porta = process.env.PORTA;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota padrão
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Api Prisma 💛",
  });
});

// Rota Prisma client
// app.get("/", async (req, res) => {
//   const nome_tabela = await repository.nome_tabela.findMany();

//   res.status(200).json({ 
//     ok: true, 
//     message: "💛", dado: nome_tabela });
// });

// Iniciar o servidor
app.listen(porta, () => {
  console.log(`Servidor rodando na porta: ${porta} 💛`);
});

import "dotenv/config";
import cors from "cors";
import express from "express";
import { PrismaClient, TweetType } from "@prisma/client";

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
    message: "Api GrowTwitter 💛",
  });
});

//DATABASE CONECTION
export const prisma = new PrismaClient();


// ROTAS
app.post("/usuarios", async (req, res) => {});

app.post("/tweets", async (req, res) => {
  const { conteudo, type, idUsuario, idTweetPai } = req.body;

  // VALIDAÇÃO DE DADOS
  if (!conteudo) {
    res.status(400).json({
      ok: false,
      message: "Preencha o conteúdo!",
    });
    return;
  }

  if (!TweetType) {
    res.status(400).json({
      ok: false,
      message: "Preencha o tweet!",
    });
    return;
  }

  if (!idUsuario) {
    res.status(400).json({
      ok: false,
      message: "Preencha o ID do usuário!",
    });
    return;
  }

  // VALIDAÇÃO TIPO DE DADO
  if (typeof conteudo !== "string") {
    res.status(400).json({
      ok: false,
      message: "Conteúdo inválido!",
    });
  }

  if (type === "R" && !idTweetPai) {
    res.status(400).json({
      ok: false,
      message: "Reply deve referenciar ao Tweet original!",
    });
  }

  if (type !== "T" && type !== "R") {
    res.status(400).json({
      ok: false,
      message: "Tweet precisa ser do tipo 'T' ou 'R'!",
    });
  }

  // CRIAÇÃO NO BANCO DE DADOS
  const tweetCriado = await prisma.tweet.create({
    data: {
      conteudo: conteudo,
      type: type,
      idUsuario: idUsuario,
      idTweetPai: idTweetPai,
    },
  });

  res.status(201).json({
    ok: true,
    message: "Tweet criado com sucesso!",
    data: tweetCriado,
  });
});

// Iniciar o servidor
app.listen(porta, () => {
  console.log(`Servidor rodando na porta: ${porta} 💛`);
});

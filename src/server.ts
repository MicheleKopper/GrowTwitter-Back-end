import "dotenv/config";
import { createServer } from "./express.server";

const porta = process.env.PORTA;

// Importar do `express.server` que criamos
const app = createServer();

// Iniciar o servidor
app.listen(porta, () => {
  console.log(`Servidor rodando na porta: ${porta} 💛`);
});

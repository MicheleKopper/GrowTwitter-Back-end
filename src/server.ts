import "dotenv/config";
import { createServer } from "./express.server";


const porta = process.env.PORT || 3000; 

const app = createServer();

app.listen(porta, () => {
  console.log(`Servidor rodando na porta: ${porta} 💛`);
});

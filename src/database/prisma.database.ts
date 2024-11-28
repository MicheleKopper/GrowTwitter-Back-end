// database: Contém a configuração de conexão e inicialização do banco de dados, além de interações diretas com o Prisma.

import { PrismaClient } from "@prisma/client";

//DATABASE CONECTION
export const prisma = new PrismaClient();

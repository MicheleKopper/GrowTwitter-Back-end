-- CreateTable
CREATE TABLE "seguidores" (
    "id_seguidor" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,

    CONSTRAINT "seguidores_pkey" PRIMARY KEY ("id_seguidor")
);

-- AddForeignKey
ALTER TABLE "seguidores" ADD CONSTRAINT "seguidores_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

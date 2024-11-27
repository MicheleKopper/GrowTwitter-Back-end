-- CreateTable
CREATE TABLE "replys" (
    "id_reply" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_tweet" UUID NOT NULL,

    CONSTRAINT "replys_pkey" PRIMARY KEY ("id_reply")
);

-- AddForeignKey
ALTER TABLE "replys" ADD CONSTRAINT "replys_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replys" ADD CONSTRAINT "replys_id_tweet_fkey" FOREIGN KEY ("id_tweet") REFERENCES "tweets"("id_tweet") ON DELETE RESTRICT ON UPDATE CASCADE;

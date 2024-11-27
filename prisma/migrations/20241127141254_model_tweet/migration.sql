-- CreateEnum
CREATE TYPE "TweetType" AS ENUM ('T', 'R');

-- CreateTable
CREATE TABLE "tweets" (
    "id_tweet" UUID NOT NULL,
    "conteudo" TEXT NOT NULL,
    "type" "TweetType" NOT NULL DEFAULT 'T',
    "id_usuario" UUID NOT NULL,

    CONSTRAINT "tweets_pkey" PRIMARY KEY ("id_tweet")
);

-- AddForeignKey
ALTER TABLE "tweets" ADD CONSTRAINT "tweets_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

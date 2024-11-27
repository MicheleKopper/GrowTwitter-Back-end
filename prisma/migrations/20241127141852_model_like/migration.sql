-- CreateTable
CREATE TABLE "likes" (
    "id_like" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_tweet" UUID NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id_like")
);

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_id_tweet_fkey" FOREIGN KEY ("id_tweet") REFERENCES "tweets"("id_tweet") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column ` auth_token` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the `seguidores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "seguidores" DROP CONSTRAINT "seguidores_id_usuario_fkey";

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN " auth_token",
ADD COLUMN     "auth_token" TEXT;

-- DropTable
DROP TABLE "seguidores";

-- CreateTable
CREATE TABLE "follows" (
    "id_follow" UUID NOT NULL,
    "follower_id" UUID NOT NULL,
    "following_id" UUID NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id_follow")
);

-- CreateIndex
CREATE UNIQUE INDEX "follows_follower_id_following_id_key" ON "follows"("follower_id", "following_id");

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

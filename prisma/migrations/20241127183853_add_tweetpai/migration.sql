-- AlterTable
ALTER TABLE "tweets" ADD COLUMN     "id_tweet_pai" UUID;

-- AddForeignKey
ALTER TABLE "tweets" ADD CONSTRAINT "tweets_id_tweet_pai_fkey" FOREIGN KEY ("id_tweet_pai") REFERENCES "tweets"("id_tweet") ON DELETE SET NULL ON UPDATE CASCADE;

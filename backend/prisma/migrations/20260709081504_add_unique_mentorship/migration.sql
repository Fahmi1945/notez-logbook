/*
  Warnings:

  - A unique constraint covering the columns `[user_id,mentor_id]` on the table `mentorships` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mentorships_user_id_mentor_id_key" ON "mentorships"("user_id", "mentor_id");

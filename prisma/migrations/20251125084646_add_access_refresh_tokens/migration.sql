/*
  Warnings:

  - You are about to drop the column `api_key` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_user_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "api_key",
DROP COLUMN "user_id",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

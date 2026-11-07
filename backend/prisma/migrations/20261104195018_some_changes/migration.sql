/*
  Warnings:

  - Changed the type of `sexo` on the `Cliente` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "sexo",
ADD COLUMN     "sexo" "Gender" NOT NULL;

-- DropEnum
DROP TYPE "Sex";

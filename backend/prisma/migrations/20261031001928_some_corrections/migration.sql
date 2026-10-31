/*
  Warnings:

  - You are about to drop the column `id_usuario` on the `Ejercicio` table. All the data in the column will be lost.
  - The primary key for the `Inscripcion_Programa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_usuario` on the `Inscripcion_Programa` table. All the data in the column will be lost.
  - The primary key for the `Puede_Generar_Rutina` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_usuario` on the `Puede_Generar_Rutina` table. All the data in the column will be lost.
  - The primary key for the `Puede_Validar_Rutina` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_usuario` on the `Puede_Validar_Rutina` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario` on the `Rutina` table. All the data in the column will be lost.
  - The primary key for the `Solicitud_Ajuste` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rutina` on the `Solicitud_Ajuste` table. All the data in the column will be lost.
  - The primary key for the `Validar_Rutina` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_usuario` on the `Validar_Rutina` table. All the data in the column will be lost.
  - Added the required column `id_creador` to the `Ejercicio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_cliente` to the `Inscripcion_Programa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_entrenador` to the `Puede_Generar_Rutina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_entrenador` to the `Puede_Validar_Rutina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_creador` to the `Rutina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_rutina` to the `Solicitud_Ajuste` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_validador` to the `Validar_Rutina` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ejercicio" DROP CONSTRAINT "Ejercicio_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Inscripcion_Programa" DROP CONSTRAINT "Inscripcion_Programa_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Puede_Generar_Rutina" DROP CONSTRAINT "Puede_Generar_Rutina_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Puede_Validar_Rutina" DROP CONSTRAINT "Puede_Validar_Rutina_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Rutina" DROP CONSTRAINT "Rutina_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud_Ajuste" DROP CONSTRAINT "Solicitud_Ajuste_rutina_fkey";

-- DropForeignKey
ALTER TABLE "Validar_Rutina" DROP CONSTRAINT "Validar_Rutina_id_usuario_fkey";

-- AlterTable
ALTER TABLE "Ejercicio" DROP COLUMN "id_usuario",
ADD COLUMN     "id_creador" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Inscripcion_Programa" DROP CONSTRAINT "Inscripcion_Programa_pkey",
DROP COLUMN "id_usuario",
ADD COLUMN     "id_cliente" INTEGER NOT NULL,
ADD CONSTRAINT "Inscripcion_Programa_pkey" PRIMARY KEY ("id_cliente", "id_programa");

-- AlterTable
ALTER TABLE "Puede_Generar_Rutina" DROP CONSTRAINT "Puede_Generar_Rutina_pkey",
DROP COLUMN "id_usuario",
ADD COLUMN     "id_entrenador" INTEGER NOT NULL,
ADD CONSTRAINT "Puede_Generar_Rutina_pkey" PRIMARY KEY ("id_entrenador", "id_programa");

-- AlterTable
ALTER TABLE "Puede_Validar_Rutina" DROP CONSTRAINT "Puede_Validar_Rutina_pkey",
DROP COLUMN "id_usuario",
ADD COLUMN     "id_entrenador" INTEGER NOT NULL,
ADD CONSTRAINT "Puede_Validar_Rutina_pkey" PRIMARY KEY ("id_entrenador", "id_programa");

-- AlterTable
ALTER TABLE "Rutina" DROP COLUMN "id_usuario",
ADD COLUMN     "id_creador" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Solicitud_Ajuste" DROP CONSTRAINT "Solicitud_Ajuste_pkey",
DROP COLUMN "rutina",
ADD COLUMN     "id_rutina" INTEGER NOT NULL,
ADD CONSTRAINT "Solicitud_Ajuste_pkey" PRIMARY KEY ("id_cliente", "id_entrenador", "id_rutina");

-- AlterTable
ALTER TABLE "Validar_Rutina" DROP CONSTRAINT "Validar_Rutina_pkey",
DROP COLUMN "id_usuario",
ADD COLUMN     "id_validador" INTEGER NOT NULL,
ADD CONSTRAINT "Validar_Rutina_pkey" PRIMARY KEY ("id_validador", "id_rutina");

-- AddForeignKey
ALTER TABLE "Puede_Generar_Rutina" ADD CONSTRAINT "Puede_Generar_Rutina_id_entrenador_fkey" FOREIGN KEY ("id_entrenador") REFERENCES "Entrenador"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puede_Validar_Rutina" ADD CONSTRAINT "Puede_Validar_Rutina_id_entrenador_fkey" FOREIGN KEY ("id_entrenador") REFERENCES "Entrenador"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rutina" ADD CONSTRAINT "Rutina_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "Entrenador"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validar_Rutina" ADD CONSTRAINT "Validar_Rutina_id_validador_fkey" FOREIGN KEY ("id_validador") REFERENCES "Jefe_de_sala"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ejercicio" ADD CONSTRAINT "Ejercicio_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "Entrenador"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion_Programa" ADD CONSTRAINT "Inscripcion_Programa_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud_Ajuste" ADD CONSTRAINT "Solicitud_Ajuste_id_rutina_fkey" FOREIGN KEY ("id_rutina") REFERENCES "Rutina"("id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

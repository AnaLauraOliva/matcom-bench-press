-- CreateEnum
CREATE TYPE "Type" AS ENUM ('FUERZA', 'CARDIO', 'FLEXIBILIDAD');

-- AlterEnum
ALTER TYPE "Sex" ADD VALUE 'OTRO';

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "fecha_registro" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "Programa_de_Entrenamiento" (
    "id_programa" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "objetivo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Programa_de_Entrenamiento_pkey" PRIMARY KEY ("id_programa")
);

-- CreateTable
CREATE TABLE "Puede_Generar_Rutina" (
    "id_usuario" INTEGER NOT NULL,
    "id_programa" INTEGER NOT NULL,

    CONSTRAINT "Puede_Generar_Rutina_pkey" PRIMARY KEY ("id_usuario","id_programa")
);

-- CreateTable
CREATE TABLE "Puede_Validar_Rutina" (
    "id_usuario" INTEGER NOT NULL,
    "id_programa" INTEGER NOT NULL,

    CONSTRAINT "Puede_Validar_Rutina_pkey" PRIMARY KEY ("id_usuario","id_programa")
);

-- CreateTable
CREATE TABLE "Rutina_Pertenece_Programa" (
    "id_programa" INTEGER NOT NULL,
    "id_rutina" INTEGER NOT NULL,

    CONSTRAINT "Rutina_Pertenece_Programa_pkey" PRIMARY KEY ("id_programa","id_rutina")
);

-- CreateTable
CREATE TABLE "Rutina" (
    "id_rutina" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proporcion_fuerza" DECIMAL(65,30) NOT NULL,
    "proporcion_fexibilidad" DECIMAL(65,30) NOT NULL,
    "proporcion_cardio" DECIMAL(65,30) NOT NULL,
    "cantidad_ejercicios" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Rutina_pkey" PRIMARY KEY ("id_rutina")
);

-- CreateTable
CREATE TABLE "Validar_Rutina" (
    "id_usuario" INTEGER NOT NULL,
    "id_rutina" INTEGER NOT NULL,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aprobada" BOOLEAN NOT NULL,
    "observaciones" TEXT NOT NULL,

    CONSTRAINT "Validar_Rutina_pkey" PRIMARY KEY ("id_usuario","id_rutina")
);

-- CreateTable
CREATE TABLE "Ejercicio" (
    "id_ejercicio" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Ejercicio_pkey" PRIMARY KEY ("id_ejercicio")
);

-- CreateTable
CREATE TABLE "Tipo_Ejercicio" (
    "id_tipo" SERIAL NOT NULL,
    "nombre" "Type" NOT NULL,

    CONSTRAINT "Tipo_Ejercicio_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "Clasificacion_por_Tipo" (
    "id_ejercicio" INTEGER NOT NULL,
    "id_tipo" INTEGER NOT NULL,

    CONSTRAINT "Clasificacion_por_Tipo_pkey" PRIMARY KEY ("id_ejercicio","id_tipo")
);

-- CreateTable
CREATE TABLE "Programa_Cubre_Grupo" (
    "id_programa" INTEGER NOT NULL,
    "id_grupo" INTEGER NOT NULL,

    CONSTRAINT "Programa_Cubre_Grupo_pkey" PRIMARY KEY ("id_programa","id_grupo")
);

-- CreateTable
CREATE TABLE "Clasificacion_por_Grupo_Muscular" (
    "id_ejercicio" INTEGER NOT NULL,
    "id_grupo" INTEGER NOT NULL,

    CONSTRAINT "Clasificacion_por_Grupo_Muscular_pkey" PRIMARY KEY ("id_ejercicio","id_grupo")
);

-- CreateTable
CREATE TABLE "Inscripcion_Programa" (
    "id_usuario" INTEGER NOT NULL,
    "id_programa" INTEGER NOT NULL,
    "fecha_inscripcion" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Inscripcion_Programa_pkey" PRIMARY KEY ("id_usuario","id_programa")
);

-- CreateTable
CREATE TABLE "Grupo_Muscular" (
    "id_grupo" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Grupo_Muscular_pkey" PRIMARY KEY ("id_grupo")
);

-- CreateTable
CREATE TABLE "Solicitud_Ajuste" (
    "id_cliente" INTEGER NOT NULL,
    "id_entrenador" INTEGER NOT NULL,
    "rutina" INTEGER NOT NULL,
    "resultado" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Solicitud_Ajuste_pkey" PRIMARY KEY ("id_cliente","id_entrenador","rutina")
);

-- CreateTable
CREATE TABLE "Inlcluye_Ejercicio" (
    "id_ejercicio" INTEGER NOT NULL,
    "id_rutina" INTEGER NOT NULL,

    CONSTRAINT "Inlcluye_Ejercicio_pkey" PRIMARY KEY ("id_ejercicio","id_rutina")
);

-- CreateTable
CREATE TABLE "Rutina_Asignada" (
    "id_cliente" INTEGER NOT NULL,
    "id_rutina" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Rutina_Asignada_pkey" PRIMARY KEY ("id_cliente","id_rutina")
);

-- CreateTable
CREATE TABLE "Sesion" (
    "id_sesion" INTEGER NOT NULL,
    "observaciones" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "duracion" TIME NOT NULL,
    "id_rutina" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,

    CONSTRAINT "Sesion_pkey" PRIMARY KEY ("id_sesion","id_cliente","id_rutina")
);

-- CreateIndex
CREATE UNIQUE INDEX "Validar_Rutina_id_rutina_key" ON "Validar_Rutina"("id_rutina");

-- CreateIndex
CREATE UNIQUE INDEX "Ejercicio_descripcion_key" ON "Ejercicio"("descripcion");

-- CreateIndex
CREATE UNIQUE INDEX "Ejercicio_nombre_key" ON "Ejercicio"("nombre");

-- AddForeignKey
ALTER TABLE "Puede_Generar_Rutina" ADD CONSTRAINT "Puede_Generar_Rutina_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Entrenador"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puede_Generar_Rutina" ADD CONSTRAINT "Puede_Generar_Rutina_id_programa_fkey" FOREIGN KEY ("id_programa") REFERENCES "Programa_de_Entrenamiento"("id_programa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puede_Validar_Rutina" ADD CONSTRAINT "Puede_Validar_Rutina_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Entrenador"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puede_Validar_Rutina" ADD CONSTRAINT "Puede_Validar_Rutina_id_programa_fkey" FOREIGN KEY ("id_programa") REFERENCES "Programa_de_Entrenamiento"("id_programa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rutina_Pertenece_Programa" ADD CONSTRAINT "Rutina_Pertenece_Programa_id_programa_fkey" FOREIGN KEY ("id_programa") REFERENCES "Programa_de_Entrenamiento"("id_programa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rutina_Pertenece_Programa" ADD CONSTRAINT "Rutina_Pertenece_Programa_id_rutina_fkey" FOREIGN KEY ("id_rutina") REFERENCES "Rutina"("id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rutina" ADD CONSTRAINT "Rutina_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Entrenador"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validar_Rutina" ADD CONSTRAINT "Validar_Rutina_id_rutina_fkey" FOREIGN KEY ("id_rutina") REFERENCES "Rutina"("id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validar_Rutina" ADD CONSTRAINT "Validar_Rutina_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Jefe_de_sala"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ejercicio" ADD CONSTRAINT "Ejercicio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Entrenador"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clasificacion_por_Tipo" ADD CONSTRAINT "Clasificacion_por_Tipo_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "Ejercicio"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clasificacion_por_Tipo" ADD CONSTRAINT "Clasificacion_por_Tipo_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "Tipo_Ejercicio"("id_tipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programa_Cubre_Grupo" ADD CONSTRAINT "Programa_Cubre_Grupo_id_programa_fkey" FOREIGN KEY ("id_programa") REFERENCES "Programa_de_Entrenamiento"("id_programa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programa_Cubre_Grupo" ADD CONSTRAINT "Programa_Cubre_Grupo_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "Grupo_Muscular"("id_grupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clasificacion_por_Grupo_Muscular" ADD CONSTRAINT "Clasificacion_por_Grupo_Muscular_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "Ejercicio"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clasificacion_por_Grupo_Muscular" ADD CONSTRAINT "Clasificacion_por_Grupo_Muscular_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "Grupo_Muscular"("id_grupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion_Programa" ADD CONSTRAINT "Inscripcion_Programa_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Cliente"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion_Programa" ADD CONSTRAINT "Inscripcion_Programa_id_programa_fkey" FOREIGN KEY ("id_programa") REFERENCES "Programa_de_Entrenamiento"("id_programa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud_Ajuste" ADD CONSTRAINT "Solicitud_Ajuste_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud_Ajuste" ADD CONSTRAINT "Solicitud_Ajuste_id_entrenador_fkey" FOREIGN KEY ("id_entrenador") REFERENCES "Entrenador"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud_Ajuste" ADD CONSTRAINT "Solicitud_Ajuste_rutina_fkey" FOREIGN KEY ("rutina") REFERENCES "Rutina"("id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inlcluye_Ejercicio" ADD CONSTRAINT "Inlcluye_Ejercicio_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "Ejercicio"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inlcluye_Ejercicio" ADD CONSTRAINT "Inlcluye_Ejercicio_id_rutina_fkey" FOREIGN KEY ("id_rutina") REFERENCES "Rutina"("id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rutina_Asignada" ADD CONSTRAINT "Rutina_Asignada_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rutina_Asignada" ADD CONSTRAINT "Rutina_Asignada_id_rutina_fkey" FOREIGN KEY ("id_rutina") REFERENCES "Rutina"("id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_id_cliente_id_rutina_fkey" FOREIGN KEY ("id_cliente", "id_rutina") REFERENCES "Rutina_Asignada"("id_cliente", "id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Administrador" (
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Entrenador" (
    "id_usuario" INTEGER NOT NULL,
    "especialidad" TEXT NOT NULL,

    CONSTRAINT "Entrenador_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Jefe_de_sala" (
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Jefe_de_sala_pkey" PRIMARY KEY ("id_usuario")
);

-- AddForeignKey
ALTER TABLE "Administrador" ADD CONSTRAINT "Administrador_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrenador" ADD CONSTRAINT "Entrenador_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jefe_de_sala" ADD CONSTRAINT "Jefe_de_sala_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Entrenador"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

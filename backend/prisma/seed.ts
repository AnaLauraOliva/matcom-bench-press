// Datos iniciales de la base de datos

import 'dotenv/config'
import { createPrismaClient } from '../src/infrastructure/database/prisma-client.js'
import { Sex, Type } from '../src/infrastructure/database/generated/enums.js'
import { BcryptPasswordHasher } from '../src/infrastructure/security/bcrypt-password-hasher.js'

function required(name: string): string {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

/**
 * Resincroniza la secuencia autoincremental de una tabla con el máximo id existente.
 * Necesario porque los seeds insertan varias filas con ids explícitos (p. ej. {idUser: 5}),
 * lo que deja la secuencia por detrás: el próximo INSERT tomaría un id ya ocupado y
 * fallaría con una violación de clave primaria (P2002).
 *
 * Ojo: pg_get_serial_sequence NO distingue mayúsculas a menos que el nombre lleve
 * comillas dobles embebidas, por eso se pasan como '"Sede"' y no como 'Sede'.
 */
async function resetSequence(tableName: string, idColumn: string): Promise<void> {
    await prisma.$executeRawUnsafe(
        `SELECT setval(
            pg_get_serial_sequence('"${tableName}"', '${idColumn}'),
            COALESCE((SELECT MAX("${idColumn}") FROM "${tableName}"), 0) + 1,
            false
        )`
    );
}

const prisma = createPrismaClient(required('DATABASE_URL'));

try{
    await main()
} finally{
    await prisma.$disconnect();
}

async function main(){
    await seedLocations();
    await seedUsers();
    await seedAdmins();
    await seedTrainers();
    await seedHeadTrainer();
    await seedClients();
    await seedExerciseTypes();
    await seedMuscleGroups();
    await seedExercises();
    await seedClassificationByType();
    await seedClassificationByMuscleGroups();
    await seedTrainingPrograms();
    await seedProgramCoversGroups();
    await seedGenerateRoutinePermissions();
    await seedValidateRoutinePermissions();
    await seedProgramEnrollments();
    await seedRoutines();
    await seedRoutineBelongPrograms();
    await seedIncludesExercises();
    await seedValidateRoutines();
    await seedAssignedRoutines();
    await seedSessions();
    await seedAdjustmentRequests();
}

//===Añadiendo sedes===
async function seedLocations(){
    if (await prisma.location.count() === 0) {
        await prisma.location.createMany({
            data:[
                {name: "Sede Centro", address: "Calle 23, esquina a L, Plaza"},
                {name: "Sede Este"  , address: "Avenida del Puerto 120, Habana del Este"}
            ],
            skipDuplicates:true,
        });
        console.log("Datos de la tabla Sede añadidos correctamente")
    }
    await resetSequence('Sede', 'id_sede');
}

async function seedUsers(){
    if (await prisma.user.count() === 0) {
        const hasher = new BcryptPasswordHasher(12);
        const password = await hasher.hash('WeWillRockYou2026!')
        await prisma.user.createMany({
            data:[
                // ==Administradores==
                {idUser:1 , name: "Diana Martínez"    , email: "diana.admin@gym.test"    , phone: "55501010", active:true, password: await hasher.hash('Dimoon2!')},
                {idUser:2 , name: "José Antonio Bello", email: "jose.admin@gym.test"     , phone: "55501011", active:true, password: await hasher.hash('jotaBello1!')},
                {idUser:3 , name: "Andriu Ferreyra"   , email: "andriu.admin@gym.test"   , phone: "55501012", active:true, password: await hasher.hash('drewds3!')},
                {idUser:4 , name: "Yisell Velázquez"  , email: "yisell.admin@gym.test"   , phone: "55501014", active:true, password: await hasher.hash('G153ll3!')},
                {idUser:5 , name: "Ana Laura Oliva"   , email: "ana.admin@gym.test"      , phone: "55501015", active:true, password: await hasher.hash('Black_witch06')},

                // ==Entrenadores==
                {idUser:6 , name: "Satoru Gojo"       , email: "satoru.trainer@gym.test" , phone: "55501016", active:true, password},
                {idUser:7 , name: "Anthony Stark"     , email: "ironman.trainer@gym.test", phone: "55501017", active:true, password},
                {idUser:8 , name: "Escanor Lion"      , email: "escanor.trainer@gym.test", phone: "55501018", active:true, password},

                // ==Clientes
                {idUser:9 , name: "Light Yagami"      , email: "light.client@gym.test"   , phone: "55501019", active:true, password},
                {idUser:10, name: "Derek Hale"        , email: "derek.client@gym.test"   , phone: "55501020", active:true, password},
                {idUser:11, name: "Ace Portgas"       , email: "firefist.client@gym.test", phone: "55501021", active:true, password},
            ],
            skipDuplicates:true,
        });
        console.log("Datos de la tabla Usuario añadidos correctamente")
    }
    await resetSequence('Usuario', 'id_usuario');
}

async function seedAdmins() {
    if(await prisma.admin.count()>0) return;
    await prisma.admin.createMany({
        data: [
            {idUser:1},
            {idUser:2},
            {idUser:3},
            {idUser:4},
            {idUser:5},
        ],
        skipDuplicates:true,
    })
    console.log("Datos de la tabla Administrador añadidos correctamente")
}

//===Rellenando roles de entrenadores===
async function seedTrainers(){
    if(await prisma.trainer.count()>0) return;
    await prisma.trainer.createMany({
        data:[
            {idUser:6, specialty:"Fuerza e hipertrofia"},
            {idUser:7, specialty:"Acondicionamiento físico"},
            {idUser:8, specialty:"Movilidad y flexibilidad"},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Entrenador añadidos correctamente")
}

//===Jefe de sala===
async function seedHeadTrainer(){
    if(await prisma.headTrainer.count()>0) return;
    await prisma.headTrainer.createMany({
        data:[
            {idUser:6},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Jefe_de_sala añadidos correctamente")
}

//===Rellenando roles de clientes===
async function seedClients(){
    if(await prisma.client.count()>0) return;
    await prisma.client.createMany({
        data:[
            {idUser:9 , age:23, sex:Sex.MASCULINO, idLocation:1},
            {idUser:10, age:24, sex:Sex.MASCULINO, idLocation:1},
            {idUser:11, age:20, sex:Sex.MASCULINO, idLocation:2},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Cliente añadidos correctamente")
}

//===Tipos de ejercicio===
async function seedExerciseTypes(){
    if (await prisma.exerciseType.count() === 0) {
        await prisma.exerciseType.createMany({
            data:[
                {idType:1, name:Type.FUERZA},
                {idType:2, name:Type.CARDIO},
                {idType:3, name:Type.FLEXIBILIDAD},
            ],
            skipDuplicates:true,
        });
        console.log("Datos de la tabla Tipo_Ejercicio añadidos correctamente")
    }
    await resetSequence('Tipo_Ejercicio', 'id_tipo');
}

//===Grupos musculares===
async function seedMuscleGroups(){
    if(await prisma.muscleGroup.count()>0) return;
    await prisma.muscleGroup.createMany({
        data:[
            {idGroup:1 , name:"Pectorales"},
            {idGroup:2 , name:"Espalda"},
            {idGroup:3 , name:"Hombros"},
            {idGroup:4 , name:"Bíceps"},
            {idGroup:5 , name:"Tríceps"},
            {idGroup:6 , name:"Cuádriceps"},
            {idGroup:7 , name:"Isquiotibiales"},
            {idGroup:8 , name:"Glúteos"},
            {idGroup:9 , name:"Abdominales"},
            {idGroup:10, name:"Pantorrillas"},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Grupo_Muscular añadidos correctamente")
}

//===Ejercicios creados por los entrenadores===
async function seedExercises(){
    if (await prisma.exercise.count() === 0) {
        await prisma.exercise.createMany({
            data:[
                // Gojo
                {name:"Press de banca"                , description:"Empuje horizontal con barra en banco plano"                        , idCreator:6},
                {name:"Sentadilla"                    , description:"Flexión de rodillas y cadera con barra"                            , idCreator:6},
                {name:"Remo con mancuerna"            , description:"Tracción unilateral de mancuerna hacia la cadera"                  , idCreator:6},
                {name:"Curl de bíceps"                , description:"Flexión de codo con mancuernas"                                    , idCreator:6},
                // Stark
                {name:"Caminata rápida"               , description:"Desplazamiento continuo a ritmo elevado"                           , idCreator:7},
                {name:"Bicicleta estática"            , description:"Pedaleo continuo en bicicleta estacionaria"                        , idCreator:7},
                {name:"Plancha Abdominal"             , description:"Sostener el cuerpo alineado sobre antebrazos y pies"               , idCreator:7},
                // Escanor
                {name:"Estiramiento de isquiotibiales", description:"Flexión de tronco controlada con piernas extendidas"               , idCreator:8},
                {name:"Estiramiento de pectoral"      , description:"Apertura del brazo apoyado contra una pared"                       , idCreator:8},
                {name:"Movilidad de cadera"           , description:"Rotaciones controladas de cadera en posición de pie"               , idCreator:8},
            ],
            skipDuplicates:true,
        });
        console.log("Datos de la tabla Ejercicio añadidos correctamente")
    }
    await resetSequence('Ejercicio', 'id_ejercicio');
}

//===Clasificación de tipo de los ejercicios===
async function seedClassificationByType(){
    if(await prisma.classificationByType.count()>0) return;
    await prisma.classificationByType.createMany({
        data:[
            {idExercise:1 , idType:1},
            {idExercise:2 , idType:1},
            {idExercise:3 , idType:1},
            {idExercise:4 , idType:1},
            {idExercise:5 , idType:2},
            {idExercise:6 , idType:2},
            {idExercise:7 , idType:1},
            {idExercise:8 , idType:3},
            {idExercise:9 , idType:3},
            {idExercise:10, idType:3},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Clasificacion_por_Tipo añadidos correctamente")
}

//===Clasificación por grupos musculares===
async function seedClassificationByMuscleGroups(){
    if(await prisma.classificationByMuscleGroup.count()>0) return;
    await prisma.classificationByMuscleGroup.createMany({
        data:[
            // Press de banca
            {idExercise:1 , idGroup:1}, {idExercise:1 , idGroup:5}, {idExercise:1 , idGroup:3},
            // Sentadilla
            {idExercise:2 , idGroup:6}, {idExercise:2 , idGroup:8}, {idExercise:2 , idGroup:7},
            // Remo con mancuerna
            {idExercise:3 , idGroup:2}, {idExercise:3 , idGroup:4},
            // Curl de bíceps
            {idExercise:4 , idGroup:4},
            // Caminata rápida
            {idExercise:5 , idGroup:6}, {idExercise:5 , idGroup:8}, {idExercise:5 , idGroup:10},
            // Bicicleta estática
            {idExercise:6 , idGroup:6}, {idExercise:6 , idGroup:7}, {idExercise:6 , idGroup:10},
            // Plancha Abdominal
            {idExercise:7 , idGroup:9},
            // Estiramiento de isquiotibiales
            {idExercise:8 , idGroup:7},
            // Estiramiento de pectoral
            {idExercise:9 , idGroup:1},
            // Movilidad de cadera
            {idExercise:10, idGroup:8}, {idExercise:10, idGroup:6},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Clasificacion_por_Grupo_Muscular añadidos correctamente")
}

//===Programas de entrenamiento===
async function seedTrainingPrograms(){
    if (await prisma.trainingProgram.count() === 0) {
        await prisma.trainingProgram.createMany({
            data:[
                {
                    name:"Hipertrofia inicial",
                    active:true,
                    objetive:"Aumentar fuerza y masa muscular con progresión gradual",
                    desciption:"Programa orientado a principiantes que desean desarrollar su musculatura mediante ejercicios de fuerza básicos y una progresión de carga controlada.",
                },
                {
                    name:"Resistencia general",
                    active:true,
                    objetive:"Mejorar capacidad cardiovascular y resistencia muscular",
                    desciption:"Programa centrado en actividades aeróbicas continuas y ejercicios de tonificación para elevar la resistencia física general.",
                },
                {
                    name:"Movilidad y Bienestar",
                    active:true,
                    objetive:"Mejorar movilidad articular y flexibilidad",
                    desciption:"Programa basado en estiramientos y ejercicios de movilidad articular para mejorar la flexibilidad y prevenir lesiones.",
                },
            ],
            skipDuplicates:true,
        });
        console.log("Datos de la tabla Programa_de_Entrenamiento añadidos correctamente")
    }
    await resetSequence('Programa_de_Entrenamiento', 'id_programa');
}

//===Grupos cubiertos por cada programa===
async function seedProgramCoversGroups(){
    if(await prisma.programCoversGroup.count()>0) return;
    await prisma.programCoversGroup.createMany({
        data:[
            // Hipertrofia inicial cubre pectorales, espalda, bíceps, tríceps, cuádriceps y glúteos
            {idProgram:1, idGroup:1}, {idProgram:1, idGroup:2}, {idProgram:1, idGroup:4},
            {idProgram:1, idGroup:5}, {idProgram:1, idGroup:6}, {idProgram:1, idGroup:8},
            // Resistencia general cubre cuádriceps, abdominales y pantorrillas
            {idProgram:2, idGroup:6}, {idProgram:2, idGroup:9}, {idProgram:2, idGroup:10},
            // Movilidad y bienestar cubre pectorales, isquiotibiales y glúteos
            {idProgram:3, idGroup:1}, {idProgram:3, idGroup:7}, {idProgram:3, idGroup:8},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Programa_Cubre_Grupo añadidos correctamente")
}

//===Permisos para generar rutinas===
async function seedGenerateRoutinePermissions(){
    if(await prisma.generateRoutinePermission.count()>0) return;
    await prisma.generateRoutinePermission.createMany({
        data:[
            {idTrainer:6, idProgram:1},
            {idTrainer:7, idProgram:2},
            {idTrainer:8, idProgram:3},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Puede_Generar_Rutina añadidos correctamente")
}

//===Permisos para validar rutinas===
async function seedValidateRoutinePermissions(){
    if(await prisma.validateRoutinePermission.count()>0) return;
    await prisma.validateRoutinePermission.createMany({
        data:[
            {idTrainer:6, idProgram:1},
            {idTrainer:6, idProgram:2},
            {idTrainer:6, idProgram:3},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Puede_Validar_Rutina añadidos correctamente")
}

//===Inscripciones a programas===
async function seedProgramEnrollments(){
    if(await prisma.programEnrollment.count()>0) return;
    await prisma.programEnrollment.createMany({
        data:[
            {idClient:9 , idProgram:1, registrationDate:new Date('2026-10-01'), state:"Activo"},
            {idClient:10, idProgram:2, registrationDate:new Date('2026-10-03'), state:"Activo"},
            {idClient:11, idProgram:3, registrationDate:new Date('2026-10-05'), state:"Activo"},
            {idClient:9 , idProgram:2, registrationDate:new Date('2026-10-10'), state:"Activo"},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Inscripcion_Programa añadidos correctamente")
}

//===Rutinas===
async function seedRoutines(){
    if (await prisma.routine.count() === 0) {
        await prisma.routine.createMany({
            data:[
                {idRoutine:1, name:"Fuerza cuerpo completo", strength:1.00, cardio:0.00, flexibility:0.00, exercisesNumber:5, idCreator:6},
                {idRoutine:2, name:"Resistencia básica"    , strength:0.50, cardio:0.50, flexibility:0.00, exercisesNumber:4, idCreator:7},
                {idRoutine:3, name:"Movilidad general"     , strength:0.00, cardio:0.00, flexibility:1.00, exercisesNumber:3, idCreator:8},
            ],
            skipDuplicates:true,
        });
        console.log("Datos de la tabla Rutina añadidos correctamente")
    }
    await resetSequence('Rutina', 'id_rutina');
}

//===Rutina pertenece a programas===
async function seedRoutineBelongPrograms(){
    if(await prisma.routineBelongProgram.count()>0) return;
    await prisma.routineBelongProgram.createMany({
        data:[
            {idProgram:1, idRoutine:1},
            {idProgram:2, idRoutine:1},
            {idProgram:2, idRoutine:2},
            {idProgram:3, idRoutine:3},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Rutina_Pertenece_Programa añadidos correctamente")
}

//===Rutinas incluyen ejercicios===
async function seedIncludesExercises(){
    if(await prisma.includesExercise.count()>0) return;
    await prisma.includesExercise.createMany({
        data:[
            // Fuerza cuerpo completo
            {idRoutine:1, idExercise:1}, {idRoutine:1, idExercise:2}, {idRoutine:1, idExercise:3},
            {idRoutine:1, idExercise:4}, {idRoutine:1, idExercise:7},
            // Resistencia básica
            {idRoutine:2, idExercise:5}, {idRoutine:2, idExercise:6}, {idRoutine:2, idExercise:7},
            {idRoutine:2, idExercise:2},
            // Movilidad general
            {idRoutine:3, idExercise:8}, {idRoutine:3, idExercise:9}, {idRoutine:3, idExercise:10},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Incluye_Ejercicio añadidos correctamente")
}

//===Validación de rutinas===
async function seedValidateRoutines(){
    if(await prisma.validateRoutine.count()>0) return;
    await prisma.validateRoutine.createMany({
        data:[
            {idValdidator:6, idRoutine:1, date:new Date('2026-10-12'), approved:true , observations:"Rutina revisada; carga inicial adecuada"},
            {idValdidator:6, idRoutine:2, date:new Date('2026-10-13'), approved:true , observations:"Distribución equilibrada de actividades"},
            {idValdidator:6, idRoutine:3, date:new Date('2026-10-14'), approved:false, observations:"Ajustar selección de ejercicios y volver a presentar"},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Validar_Rutina añadidos correctamente")
}

//===Asignación de rutinas===
async function seedAssignedRoutines(){
    if(await prisma.assignedRoutine.count()>0) return;
    await prisma.assignedRoutine.createMany({
        data:[
            {idClient:9 , idRoutine:1, state:"Activo"},
            {idClient:10, idRoutine:2, state:"Activo"},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Rutina_Asignada añadidos correctamente")
}

//===Sesiones de entrenamiento===
async function seedSessions(){
    if(await prisma.session.count()>0) return;
    await prisma.session.createMany({
        data:[
            // Light con la rutina de fuerza
            {idSession:1, idClient:9 , idRoutine:1, date:new Date('2026-10-15'), duration:new Date(Date.UTC(1970, 0, 1, 1, 15)), observations:"Primera sesión de la rutina; técnica correcta en press de banca"},
            {idSession:2, idClient:9 , idRoutine:1, date:new Date('2026-10-17'), duration:new Date(Date.UTC(1970, 0, 1, 1, 10)), observations:"Buena ejecución general; se aumentó la carga en sentadilla"},
            {idSession:3, idClient:9 , idRoutine:1, date:new Date('2026-10-19'), duration:new Date(Date.UTC(1970, 0, 1, 1, 20)), observations:"Sesión completa; plancha abdominal sostenida un minuto"},
            // Derek con la rutina de resistencia
            {idSession:4, idClient:10, idRoutine:2, date:new Date('2026-10-16'), duration:new Date(Date.UTC(1970, 0, 1, 0, 45)), observations:"Caminata rápida y bicicleta completadas sin molestias"},
            {idSession:5, idClient:10, idRoutine:2, date:new Date('2026-10-18'), duration:new Date(Date.UTC(1970, 0, 1, 0, 50)), observations:"Mejoró la resistencia; plancha sostenida durante 40 segundos"},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Sesion añadidos correctamente")
}

//===Solicitudes de ajustes===
async function seedAdjustmentRequests(){
    if(await prisma.adjustmentRequest.count()>0) return;
    await prisma.adjustmentRequest.createMany({
        data:[
            {idClient:9 , idTrainer:6, idRoutine:1, date:new Date('2026-10-16'), state:"Resuelta", result:"Se aumentó el peso del press de banca y de la sentadilla"},
        ],
        skipDuplicates:true,
    });
    console.log("Datos de la tabla Solicitud_Ajuste añadidos correctamente")
}

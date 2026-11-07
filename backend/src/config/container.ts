import { UserAccessChecker } from "../application/services/user-access-checker.js";
import { DeactivateUserInteractor } from "../application/use-cases/deactivate-user/deactivate-user-interactor.js";
import { DeleteUserInteractor } from "../application/use-cases/delete-user/delete-user-interactor.js";
import { GetUserInteractor } from "../application/use-cases/get-user/get-user-interactor.js";
import { ListLocationsInteractor } from "../application/use-cases/list-locations/list-locations-interactor.js";
import { LoginInteractor } from "../application/use-cases/login/login-interactor.js";
import { RegisterUserInteractor } from "../application/use-cases/register-user/register-user-interactor.js";
import { RegistrationPolicy } from "../domain/policies/registration-policy.js";
import { UserAccessPolicy } from "../domain/policies/user-access-policy.js";
import { createPrismaClient } from "../infrastructure/database/prisma-client.js";
import { PrismaLocationDataSource } from "../infrastructure/database/prisma-location-data-source.js";
import { PrismaUserDataSource } from "../infrastructure/database/prisma-user-data-source.js";
import { PrismaUserProfileDataSource } from "../infrastructure/database/prisma-user-profile-data-source.js";
import { DeactivateUserController } from "../interfaces/controllers/deactivate-user-controller.js";
import { DeleteUserController } from "../interfaces/controllers/delete-user-controller.js";
import { GetUserController } from "../interfaces/controllers/get-user-controller.js";
import { ListLocationsController } from "../interfaces/controllers/location-controller.js";
import { LoginController } from "../interfaces/controllers/login-controller.js";
import { RegisterUserController } from "../interfaces/controllers/register-user-controller.js";
import { BcryptPasswordHashGateway } from "../interfaces/gateways/bcrypt-password-hash-gateway.js";
import { JwtTokenGateway } from "../interfaces/gateways/jwt-token-gateway.js";
import { LocationGatewayImpl } from "../interfaces/gateways/location-gateway-impl.js";
import { UserGatewayImpl } from "../interfaces/gateways/user-gateway-impl.js";
import { UserProfileGatewayImpl } from "../interfaces/gateways/user-profile-gateway-impl.js";
import { SessionResolver } from "../interfaces/http/session-resolver.js";
import { env } from "./env.js";
// Aquí (y solo aquí) se eligen las piezas concretas y se conectan entre sí,
// de afuera hacia adentro.
export function createContainer() {
    // Círculo 4: la base de datos.
    const prisma = createPrismaClient(env.DATABASE_URL);
    // Círculo 3: los gateways, con sus fuentes de datos.
    const userGateway = new UserGatewayImpl(new PrismaUserDataSource(prisma));
    const userProfileGateway = new UserProfileGatewayImpl(
        new PrismaUserProfileDataSource(prisma),
    );
    const locationGateway = new LocationGatewayImpl(
        new PrismaLocationDataSource(prisma),
    );
    const passwordHasher = new BcryptPasswordHashGateway(env.BCRYPT_ROUNDS);
    const tokenGateway = new JwtTokenGateway(
        env.JWT_SECRET,
        env.JWT_EXPIRES_IN_SECONDS,
    );
    // Círculo 1: las reglas de negocio.
    const registrationPolicy = new RegistrationPolicy();
    const userAccessPolicy = new UserAccessPolicy(registrationPolicy);
    // Círculo 2: los casos de uso.
    const accessChecker = new UserAccessChecker(
        userProfileGateway,
        userAccessPolicy,
    );
    const login = new LoginInteractor(
        userGateway,
        passwordHasher,
        tokenGateway,
    );
    const registerUser = new RegisterUserInteractor(
        userGateway,
        locationGateway,
        passwordHasher,
        registrationPolicy,
    );
    const listLocations = new ListLocationsInteractor(locationGateway);
    const getUser = new GetUserInteractor(accessChecker);
    const deleteUser = new DeleteUserInteractor(
        accessChecker,
        userProfileGateway,
    );
    const deactivateUser = new DeactivateUserInteractor(
        accessChecker,
        userProfileGateway,
    );
    // Círculo 3: los controladores.
    const sessions = new SessionResolver(tokenGateway, userProfileGateway);
    return {
        prisma,
        controllers: {
            login: new LoginController(login),
            registerUser: new RegisterUserController(registerUser, sessions),
            listLocations: new ListLocationsController(listLocations),
            getUser: new GetUserController(sessions, getUser),
            deleteUser: new DeleteUserController(sessions, deleteUser),
            deactivateUser: new DeactivateUserController(
                sessions,
                deactivateUser,
            ),
        },
    };
}

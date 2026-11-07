import type { IUser } from "../../../domain/entities/user.js";
import type { RegistrationPolicy } from "../../../domain/policies/registration-policy.js";
import { EmailAlreadyExistsError, LocationNotFoundError, RegistrationNotAllowedError, PhoneAlreadyExistsError } from "../../errors/application-errors.js";
import type { ILocationGateway } from "../../gateways/location-gateway.js";
import type { IPasswordHashGateway } from "../../gateways/password-hash-gateway.js";
import type { IUserGateway } from "../../gateways/user-gateway.js";
import { toUserResponse } from "../../models/user-response.js";
import type { IRegisterUserInputBoundary, IRegisterUserOutputBoundary, IRegisterUserRequest } from "./register-user-boundaries.js";

export class RegisterUserInteractor implements IRegisterUserInputBoundary {
    constructor(
        private readonly users: IUserGateway,
        private readonly locations: ILocationGateway,
        private readonly passwordHasher: IPasswordHashGateway,
        private readonly registrationPolicy: RegistrationPolicy
    ){}

    async execute({actorRole, data}: IRegisterUserRequest, output: IRegisterUserOutputBoundary): Promise<void> {
        if (!this.registrationPolicy.canRegister(actorRole, data.role)){
            output.presentFailure(new RegistrationNotAllowedError(actorRole, data.role));
            return;
        }

        if (await this.users.findByEmail(data.email)){
            output.presentFailure(new EmailAlreadyExistsError());
            return;
        }

        if ( data.role === 'CLIENT' && !(await this.locations.existsById(data.idLocation))){
            output.presentFailure(new LocationNotFoundError(data.idLocation));
            return;
        }

        const { password, ...rest } = data;
        const passwordHash = await this.passwordHasher.hash(password);

        let created: IUser;
        try {
            created = await this.users.create({...rest, passwordHash});
        } catch(error){
            if(error instanceof EmailAlreadyExistsError || error instanceof PhoneAlreadyExistsError) {
                output.presentFailure(error);
                return;
            }
            throw error;
        }
        
        output.presentSuccess({user: toUserResponse(created)});
    }

}
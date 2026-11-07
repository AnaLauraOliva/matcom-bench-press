import type { IUser } from '../../../domain/entities/user.js';
import { InactiveUserError, InvalidCredentialsError } from '../../errors/application-errors.js';
import type { IPasswordHashGateway } from '../../gateways/password-hash-gateway.js';
import type { ITokenGateway } from '../../gateways/token-gateway.js';
import type { IUserGateway } from '../../gateways/user-gateway.js';
import { toUserResponse } from '../../models/user-response.js';
import type { LoginIdentifier, ILoginInputBoundary, ILoginOutputBoundary, ILoginRequest } from './login-boundaries.js';

type UserLookup = 
| {readonly kind: 'found'; readonly user: IUser}
| {readonly kind: 'not-found'};

export class LoginInteractor implements ILoginInputBoundary{
    constructor(
        private readonly users: IUserGateway,
        private readonly passwordHasher: IPasswordHashGateway,
        private readonly tokens: ITokenGateway
    ){}
    async execute(req: ILoginRequest, output: ILoginOutputBoundary): Promise<void> {
        const lookup = await this.lookUpUser(req.identifier);

        if(lookup.kind==='not-found') {
            output.presentFailure(new InvalidCredentialsError());
            return;
        }

        const { user } = lookup;
        const passwordMatches = await this.passwordHasher.compare(req.password, user.passwordHash);
        if(!passwordMatches) {
            output.presentFailure(new InvalidCredentialsError());
            return;
        }

        if(!user.active) {
            output.presentFailure(new InactiveUserError());
            return;
        }

        const token = this.tokens.generate({idUser: user.idUser, role: user.role});
        output.presentSuccess({token, user: toUserResponse(user)});
    }
    private async lookUpUser(identifier: LoginIdentifier): Promise<UserLookup> {
        const user = await this.users.findByEmail(identifier.email);
        return user ? {kind:'found', user} : {kind: 'not-found'};    
    }
}

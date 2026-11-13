
export class CreateUserCommand {
    constructor(readonly firstName: string, readonly lastName: string, readonly email: string) { }
}
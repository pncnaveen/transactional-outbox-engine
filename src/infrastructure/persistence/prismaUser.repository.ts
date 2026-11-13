import { Injectable } from "@nestjs/common";
import { User } from "../../domain/entities/user.entity.js";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async save(user: User): Promise<User> {
        try {
            return await this.prisma.user.create({
                data: user
            })
        } catch (error) {
            throw error;
        }
    }
}
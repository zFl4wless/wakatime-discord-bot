import { prismaClient } from '../prisma';
import { UserDto } from './user.dto';

/**
 * Saves a user to the database.
 *
 * @param UserDto The user to save.
 */
export async function saveUser({ userId, accessToken, refreshToken }: UserDto) {
    prismaClient.user.create({
        data: {
            userId: userId,
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
    });
}

/**
 * Checks if a user with the given id exists.
 *
 * @param userId The user id to check.
 * @returns Whether the user exists or not.
 */
export async function isUser(userId: string) {
    const user = await prismaClient.user.findUnique({
        where: {
            userId: userId,
        },
    });

    return user !== null;
}

import { prismaClient } from '../prisma';

export async function saveUser(userId: string, accessToken: string, refreshToken: string) {
    prismaClient.user
        .create({
            data: {
                userId: userId,
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function isUser(userId: string) {
    const user = await prismaClient.user.findUnique({
        where: {
            userId: userId,
        },
    });

    return user !== null;
}

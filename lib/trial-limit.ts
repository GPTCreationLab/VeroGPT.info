import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

import { MAX_FREE_QUESTIONS } from "@/constants";

export const increaseTrialLimit = async () => {
    const {userId} = auth();

    if (!userId) {
        return;
    }

    const userTrialLimit = await prismadb.userTrialLimit.findUnique({
        where: {
            userId
        }
    })

    if (userTrialLimit) {
        await prismadb.userTrialLimit.update({
            where: {userId: userId},
            data: {count: userTrialLimit.count + 1},
        });
    } else {
        await prismadb.userTrialLimit.create({
            data: {userId: userId, count: 1}
        })
    }
}

export const checkTrialLimit = async () => {
    const {userId} = auth();

    if (!userId) {
        return false;
    }

    const userTrialLimit = await prismadb.userTrialLimit.findUnique({
        where: {
            userId: userId
        }
    })

    if (!userTrialLimit || userTrialLimit.count < MAX_FREE_QUESTIONS) {
        return true;
    } else {
        return false;
    }
}

export const getTrialLimitCount = async() => {
    const {userId} = auth();
    if (!userId) {
        return 0
    }

    const userTrialLimit = await prismadb.userTrialLimit.findUnique({
        where:{
            userId
        }
    })

    if (!userTrialLimit) {
        return 0
    }

    return userTrialLimit.count;
}
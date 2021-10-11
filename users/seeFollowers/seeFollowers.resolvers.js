import client from "../../client";

export default {
    Query: {
        seeFollowers: async (_, { username, page }) => {
            const user = await client.user.findUnique({
                where: { username },
                select: { id: true },
            });

            if (!user) {
                return {
                    ok: false,
                    error: "User not found",
                };
            }
            const followers = await client.user
                .findUnique({
                    where: {
                        username,
                    },
                })
                .followers({
                    take: 5,
                    skip: (page - 1) * 5,
                });

            const totalFollowers = await client.user.count({
                where: {
                    followings: { some: { username } },
                },
            });
            console.log(totalFollowers);
            return {
                ok: true,
                followers,
                totalPages: Math.ceil(totalFollowers / 5),
            };
        },
    },
};
export const createUserID = (user: { username: string; id: string }) => {
    return user.username + "@" + user.id;
};

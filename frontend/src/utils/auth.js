import userUtils from './user';

/**
 * Check if the user is logged in by fetching user data.
 * @returns {Promise<boolean>} - True if the user is logged in, false otherwise.
 */
async function isLoggedIn() {
    const userData = await userUtils.fetchUserData();
    return userData && userData.user && userData.user.token ? true : false;
}

/**
 * Check if the user is an admin by fetching user data.
 * @returns {Promise<boolean>} - True if the user is an admin, false otherwise.
 */
async function isAdmin() {
    const userData = await userUtils.fetchUserData();
    return userData && userData.user && userData.user.isAdmin ? true : false;
}

export default {
    isLoggedIn,
    isAdmin,
};

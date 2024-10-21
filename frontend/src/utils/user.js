import axios from 'axios';

/**
 * Fetch user data
 * @returns {Promise<Object>} - The user data.
 */
async function fetchUserData() {
  try {
    const response = await axios.get('/api/user/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Get the username from user data.
 * @param {Object} userData - The user data returned from the API.
 * @returns {string|null} - The username or null if not found.
 */
function getUsername(userData) {
  return userData && userData.user ? userData.user.username : null;
}

export default {
  fetchUserData,
  getUsername,
};

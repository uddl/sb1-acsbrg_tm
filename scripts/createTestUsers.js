import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const createUser = async (username, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      password,
      role
    });
    console.log(`${role} user created:`, username);
  } catch (error) {
    console.error(`Error creating ${role} user:`, error.response?.data?.message || error.message);
  }
};

const createTestUsers = async () => {
  await createUser('publisher1', 'publisherpass', 'publisher');
  await createUser('user1', 'userpass', 'user');
};

createTestUsers().catch(error => console.error('Error in createTestUsers:', error.message));
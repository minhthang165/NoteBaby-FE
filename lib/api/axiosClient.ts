import axios from "axios";

//For deployment
const API_BASE_URL = 'https://notby-be-8q9y.onrender.com';

//For testing
//const API_BASE_URL = 'http://localhost:5010';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Export the base URL for non-axios usage
export const API_URL = API_BASE_URL;

// // Add auth token interceptor
// export const setAuthToken = (token) => {
//   if (token) {
//     axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     localStorage.setItem('authToken', token);
//   } else {
//     delete axiosClient.defaults.headers.common['Authorization'];
//     localStorage.removeItem('authToken');
//   }
// };

// // Initialize auth header from localStorage
// const token = localStorage.getItem('authToken');
// if (token) {
//   setAuthToken(token);
// }

export default axiosClient;
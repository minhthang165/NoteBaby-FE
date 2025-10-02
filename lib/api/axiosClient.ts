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

// Configure axios to handle multipart/form-data requests properly
axiosClient.interceptors.request.use(config => {
  // If the request contains FormData, remove the Content-Type header
  // so that the browser can set it automatically with the correct boundary
  if (
    config.data instanceof FormData ||
    Object.prototype.toString.call(config.data) === '[object FormData]'
  ) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  
  // Add auth token from localStorage if available
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  
  return config;
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
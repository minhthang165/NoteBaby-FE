import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
  
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwtToken');
    Cookies.remove("jwtToken");
  }
}

export function getDataFromJWT() {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      console.log("Found token in URL parameters");
      localStorage.setItem('jwtToken', urlToken);
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
    
    const token = urlToken || localStorage.getItem('jwtToken') || Cookies.get('jwtToken');
    
    if (!token) {
      console.log("No token found in URL, localStorage, or cookies");
      return null;
    }
    
    try {
      const decoded = jwtDecode(token);
      console.log("Successfully decoded JWT:", decoded);
      return decoded;
    } catch (e) {
      console.error("Error decoding JWT:", e);
      return null;
    }
  }
  
  return null;
}

/**
 * Extract the user ID from the JWT token
 * @returns The user ID from the JWT token
 * @throws Error if authentication token is not found or if user ID cannot be extracted
 */
export function getAuthorId(): string {
  try {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('jwtToken') || Cookies.get('jwtToken');
    
    if (!token) {
      throw new Error("Authentication token not found");
    }
    
    // Parse the token payload (assumes token is in format: header.payload.signature)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Return the user ID from the token
    const userId = payload.id || payload._id || payload.userId || payload.sub;
    
    if (!userId) {
      throw new Error("User ID not found in token");
    }
    
    return userId;
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    throw new Error("Failed to get author ID");
  }
  
  return null;
}
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
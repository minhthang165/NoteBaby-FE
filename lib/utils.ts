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
  const token = Cookies.get('jwtToken'); // replace with your cookie name
  if (!token) return null;
  try {
    var decoded = jwtDecode(token); // returns the payload object
    console.log("Decoded JWT:", decoded);
    return decoded;
  } catch (e) {
    return null;
  }
}

export function getDataFromJWT() {
  const token = Cookies.get('jwtToken'); // replace with your cookie name
  console.log("📋 JWT token found:", token ? "Yes" : "No");
  if (!token) {
    return null;
  }
  try {
    var decoded = jwtDecode(token); // returns the payload object
    console.log("🔓 Decoded JWT:", decoded);
    return decoded;
  } catch (e) {
      return null;
  }
}
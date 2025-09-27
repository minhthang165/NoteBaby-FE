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
    return jwtDecode(token); // returns the payload object
  } catch (e) {
    return null;
  }
}
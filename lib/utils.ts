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
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    localStorage.setItem('jwtToken', token);
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}
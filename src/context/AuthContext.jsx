import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const ID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

function decodeToken(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return {
      token,
      role: decoded[ROLE_CLAIM] || null,
      userId: decoded[ID_CLAIM] || null,
    };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => decodeToken(localStorage.getItem("token")));

  const login = useCallback((token) => {
    localStorage.setItem("token", token);
    setAuth(decodeToken(token));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setAuth(null);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "token") {
        setAuth(decodeToken(e.newValue));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: auth?.token || null,
        role: auth?.role || null,
        userId: auth?.userId || null,
        isAuthenticated: !!auth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);

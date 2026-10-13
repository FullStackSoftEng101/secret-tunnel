import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  async function signup(username) {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(username),
      });
      const result = await response.json();
      // Something like this, depends on the API, but they'll send back a token
      //return

      setToken(result.token);
      setLocation("TABLET");
    } catch (e) {
      console.error(e);
    }
  }
  // TODO: authenticate
  async function authenticate(username) {
    try {
      if (!token) {
        throw new Error("token is not found");
      }
      const response = await fetch(API + "/authenticate", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("authentication failed");
      }

      setLocation("TUNNEL");
    } catch (e) {
      console.error(e);
    }
  }
  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}

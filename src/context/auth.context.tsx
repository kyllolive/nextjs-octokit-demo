import React, { createContext, useContext, useState } from "react";

interface AuthContext {
  accessToken: string | null;
  setAccessToken: (value: string) => void;
}

const AuthContext = createContext<AuthContext>({
  accessToken: null,
  setAccessToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children
}) => {

  const readStoredUser = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return {
        token,
        username: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        roles: JSON.parse(localStorage.getItem("roles") || "[]"),
      };
    } catch (e) {
      return null;
    }
  };

  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    const username =
      localStorage.getItem(
        "username"
      );

    const email =
      localStorage.getItem(
        "email"
      );

    const roles =
      JSON.parse(
        localStorage.getItem(
          "roles"
        ) || "[]"
      );

    if (token) {

      setUser({
        token,
        username,
        email,
        roles
      });
    }

  }, []);

  const login = (
    loginResponse
  ) => {

    localStorage.setItem(
      "token",
      loginResponse.token
    );

    localStorage.setItem(
      "username",
      loginResponse.username
    );

    localStorage.setItem(
      "email",
      loginResponse.email
    );

    localStorage.setItem(
      "roles",
      JSON.stringify(
        loginResponse.authorities
      )
    );

    setUser({
      token:
        loginResponse.token,
      username:
        loginResponse.username,
      email:
        loginResponse.email,
      roles:
        loginResponse.authorities
    });
  };

  const logout = () => {

    localStorage.clear();

    setUser(null);

    window.location.href =
      "/login";
  };

  const hasRole = (
    role
  ) => {

    return (
      user?.roles?.includes(
        `ROLE_${role}`
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =
  () => useContext(AuthContext);
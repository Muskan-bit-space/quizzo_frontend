import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import Auth_Handler from "../api/Auth_Handler";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


    // Restore user after application starts / refresh
    useEffect(() => {

        async function restoreUser() {

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const response = await Auth_Handler.me(token);

                setUser(response.data);

            } catch (error) {

                console.log("Could not restore authentication");

                localStorage.removeItem("token");

                setToken(null);
                setUser(null);

            } finally {

                setLoading(false);

            }
        }

        restoreUser();

    }, [token]);


    // Called after successful signin
    function login(newToken) {

        localStorage.setItem("token", newToken);

        setToken(newToken);
    }


    // Called during logout
    function logout() {

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
    }


    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(AuthContext);

}
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {

    const [theme, setTheme] = useState(() => {

        const savedTheme =
            localStorage.getItem("theme");

        return savedTheme === "dark"
            ? "dark"
            : "light";

    });

    useEffect(() => {

        const root =
            document.documentElement;

        root.classList.remove(
            "light",
            "dark"
        );

        root.classList.add(theme);

        localStorage.setItem(
            "theme",
            theme
        );

    }, [theme]);


    const toggleTheme = () => {

        setTheme(currentTheme => {

            return currentTheme === "dark"
                ? "light"
                : "dark";

        });

    };


    const darkMode =
        theme === "dark";


    return (

        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                darkMode,
                toggleTheme
            }}
        >

            {children}

        </ThemeContext.Provider>

    );

}


export function useTheme() {

    const context =
        useContext(ThemeContext);

    if (!context) {

        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );

    }

    return context;

}
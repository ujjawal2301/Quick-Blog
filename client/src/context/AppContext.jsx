import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();

    const [adminToken, setAdminToken] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null);

    const [blogs, setBlogs] = useState([]);
    const [input, setInput] = useState("");

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get("/api/blog/all");
            data.success ? setBlogs(data.blogs) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchBlogs();

        const savedAdminToken = localStorage.getItem("adminToken");
        const savedUserToken = localStorage.getItem("userToken");
        const savedUser = localStorage.getItem("user");

        if (savedAdminToken) {
            setAdminToken(savedAdminToken);
            axios.defaults.headers.common["Authorization"] = savedAdminToken;
        } 
        else if (savedUserToken) {
            setUserToken(savedUserToken);
            setUser(savedUser ? JSON.parse(savedUser) : null);
            axios.defaults.headers.common["Authorization"] = savedUserToken;
        }

    }, []);

    const value = {
        axios,
        navigate,
        adminToken,
        setAdminToken,
        userToken,
        setUserToken,
        user,
        setUser,
        blogs,
        setBlogs,
        input,
        setInput
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
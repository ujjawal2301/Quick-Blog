import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function Register() {

    const { axios, setUserToken, setUser, navigate } = useAppContext();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("/api/user/register", {
                name,
                email,
                password
            });

            if (data.success) {
                setUserToken(data.token);
                setUser(data.user);

                localStorage.setItem("userToken", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                axios.defaults.headers.common["Authorization"] = data.token;

                toast.success("Account created successfully!");
                navigate("/");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-sm p-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">

                <div className="text-center py-6">
                    <h1 className="text-3xl font-bold">Create Account</h1>
                    <p className="font-light">Join QuickBlog and share your stories</p>
                </div>

                <form onSubmit={handleSubmit} className="w-full text-gray-600">

                    <div className="flex flex-col">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Your name"
                            className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Your email"
                            className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="Create a password"
                            className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
                    >
                        Register
                    </button>

                </form>
            </div>
        </div>
    );
}
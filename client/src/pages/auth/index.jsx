import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "@/utils/constant";
import { apiClient } from "@/lib/api-client";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
const Auth = () => {
    const navigate = useNavigate();
    const { setUserInfo } = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required!");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required!");
            return false;
        }
        return true;
    };

    const validateRegister = () => {
        if (!email.length) {
            toast.error("Email is required!");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required!");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Password and confirm password do not match!");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (validateLogin()) {
            const response = await apiClient.post(
                LOGIN_ROUTE,
                { email, password },
                { withCredentials: true }
            );
            if (response.data.user.id) {
                setUserInfo(response.data.user);
                if (response.data.user.profileSetup) {
                    navigate("/chat");
                } else {
                    navigate("/profile");
                }
            }
            console.log(response);
        }
    };
    const handleRegister = async () => {
        if (validateRegister()) {
            const response = await apiClient.post(
                REGISTER_ROUTE,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );
            if (response.statusCode === 201) {
                setUserInfo(response.data.user);
                navigate("/profile");
            }
            console.log(response);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white border-2 border-white text-opacity-90 shadow-2xl rounded-3xl grid md:grid-cols-2 overflow-hidden">
                <div className="flex flex-col gap-6 items-center justify-center p-6 md:p-10">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                                Welcome
                            </h1>
                            <img
                                src={Victory}
                                alt=""
                                className="h-12 md:h-16 lg:h-20"
                            />
                        </div>
                        <p className="font-medium text-sm md:text-base">
                            Fill in the details to get started with the best
                            chat app!
                        </p>
                    </div>
                    <div className="w-full max-w-md">
                        <Tabs className="w-full" defaultValue="login">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger
                                    value="login"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                >
                                    Login
                                </TabsTrigger>
                                <TabsTrigger
                                    value="register"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                >
                                    Register
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent
                                className="flex flex-col gap-4 mt-6"
                                value="login"
                            >
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-4 md:p-5"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-4 md:p-5"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <Button
                                    className="rounded-full p-4 md:p-5"
                                    onClick={handleLogin}
                                >
                                    Login
                                </Button>
                            </TabsContent>
                            <TabsContent
                                className="flex flex-col gap-4 mt-6"
                                value="register"
                            >
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-4 md:p-5"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-4 md:p-5"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <Input
                                    placeholder="Confirm Password"
                                    type="password"
                                    className="rounded-full p-4 md:p-5"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                                <Button
                                    className="rounded-full p-4 md:p-5"
                                    onClick={handleRegister}
                                >
                                    Register
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden md:flex justify-center items-center">
                    <img
                        src={Background}
                        className="h-auto object-contain"
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
};

export default Auth;

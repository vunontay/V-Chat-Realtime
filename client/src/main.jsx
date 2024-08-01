import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "@/components/ui/sonner.jsx";
import { SocketProvider } from "@/contexts/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <SocketProvider>
        <App />
        <Toaster closeButton />
    </SocketProvider>
    // </React.StrictMode>
);

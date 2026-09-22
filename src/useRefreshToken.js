import axios from 'axios';
import { useAuth } from './authContext';
const BASE_URL = process.env.REACT_APP_MATHE_API;
import { useNavigate } from "react-router-dom";

const useRefreshToken = () => {
    const { setToken, logout } = useAuth();
    const navigate = useNavigate();

    const refresh = async () => {
        try {
            const response = await axios.post(BASE_URL + 'auth/refreshToken', {}, {
                withCredentials: true
            });

            if (response.status === 401) {
                logout();
                navigate("/", { replace: true });
                window.location.reload();
                throw new Error("Unauthorized"); // Throw an error if the response status is 401
            }

            setToken(response.data.accessToken);
            return response.data.accessToken;
        } catch (error) {
            logout();
            navigate("/", { replace: true });
            window.location.reload();
            console.error("Failed to refresh token:", error);
            throw error; 
        }
    }

    return refresh;
}

export default useRefreshToken;
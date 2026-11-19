import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type" : "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.includes("/auth/login");
        if(error.response?.status === 403) {
            console.error("403 Forbidden:", error.config?.url);
            return Promise.reject(error);
        }
        if(error.response?.status === 401 && !isLoginRequest){
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('name');
            sessionStorage.removeItem('email');
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
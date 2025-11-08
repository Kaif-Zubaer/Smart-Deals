import axios from "axios";
import useAuth from "./useAuth";
import { useEffect } from "react";
// import { useNavigate } from "react-router";

const instance = axios.create({
    baseURL: 'https://smart-deals-eight.vercel.app',
})

const useAxiosSecure = () => {
    const { user, userLogOut } = useAuth();
    // const navigate = useNavigate();

    useEffect(() => {
        // request interceptor
        const requestinterceptor = instance.interceptors.request.use((config) => {
            const token = user.accessToken;

            if (token) {
                config.headers.authorization = `Bearer ${token}`;
            }

            return config;
        })

        // response interceptor
        const responseInterceptor = instance.interceptors.response.use(res => {
            return res;
        }, err => {
            // console.log(err);

            const status = err.status;
            if (status === 401 || status === 403) {
                console.log('log out user for bad request')
                userLogOut()
                    .then(() => {
                        // navigate('/register')
                    })
            }
        })

        return () => {
            instance.interceptors.request.eject(requestinterceptor);
            instance.interceptors.response.eject(responseInterceptor);
        }
    }, [user, userLogOut])

    return instance;
}

export default useAxiosSecure;
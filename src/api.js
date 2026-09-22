import axios from 'axios';
import { useAuth } from './authContext';
import { useEffect } from 'react';
import useRefreshToken from 'useRefreshToken';
const BASE_URL = process.env.REACT_APP_MATHE_API;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const useApi = () => {
  const { token } = useAuth();
  const refresh = useRefreshToken();
  

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
        config => {
            if(token && !config.headers[`Authorization`]){
                config.headers[`Authorization`] = `Bearer ${token}`;
            }
            return config;
        }, (error) => Promise.reject(error)
    )



    const responseIntercept = api.interceptors.response.use(
        response => response,
        async (error) =>{
            const prevRequest = error.config;
            if(error.response.status == 403 && !prevRequest.sent){
                prevRequest.sent = true;
                const newAccessToken = await refresh();
                prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(prevRequest);
            }
            return Promise.reject(error);
        }
    );

    return () => {
        api.interceptors.response.eject(requestIntercept);
        api.interceptors.response.eject(responseIntercept);
    }
  }, [token, refresh])
  return api;
};

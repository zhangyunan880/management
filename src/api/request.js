import axios from "axios";

import nprogress from "nprogress";
import "nprogress/nprogress.css"
const request = axios.create({
    // baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    baseURL: 'https://lianghj.top:8888/api/private/v1/',
  
    timeout: 3000,
 
});
  

request.interceptors.request.use(function (config) {
 
config.headers.Authorization=window.sessionStorage.getItem('token')
     //进度条开始动   
     nprogress.start();
    return config;
  }, function (error) {
    
    return Promise.reject(error);
  });

// 添加响应拦截器
request.interceptors.response.use(function (response) {
         //进度条结束
        nprogress.done()
    return response;
  }, function (error) {

    return Promise.reject(error);
});
  
export default request;
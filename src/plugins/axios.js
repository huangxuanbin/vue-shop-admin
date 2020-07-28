import axios from 'axios';
import { Loading } from 'element-ui';
// Loading实例
let loading;
axios.defaults.baseURL = 'http://localhost:3003';
axios.interceptors.request.use(function (config) {
    // 开启loading
    loading = Loading.service({ background: "rgba(0,0,0,0.3)" });
    // 获取token
    let token = sessionStorage.token;
    // 有token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, function (error) {
    return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
    let { data } = response;
    // 关闭loading
    loading.close();
    return data;
}, function (error) {
    return Promise.reject(error);
});
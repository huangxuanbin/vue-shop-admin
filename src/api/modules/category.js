import axios from 'axios';
// 获取所有树形分类
let loadTree = (data) => axios.get('/api/category/all', { params: data });
// 获取子分类
let loadChild = (data) => axios.get('api/category/sub', { params: data });
// 更新子分类
let update = (data) => axios.put('/api/category', data);
//添加子分类
let add = (data) => axios.post('/api/category', data);
// 删除分类
let remove = (data) => axios.delete('/api/category', { params: data });
//获取所有省份
let getProvince = (data) => axios.get('/api/pcct/province', { params: data });
//根据省份获取城市
let getCity = (data) => axios.get('/api/pcct/city', { params: data });
// 根据市区获取县区
let getCounty = (data) => axios.get('/api/pcct/county', { params: data });
export default {
    loadTree,
    loadChild,
    update,
    add,
    remove,
    getProvince,
    getCity,
    getCounty

}
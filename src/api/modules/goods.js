import axios from 'axios';
//获取商品列表
let list = (data) => axios.get('/api/admin/goods/list', { params: data });
//删除商品
let remove = (data) => axios.delete('/api/admin/goods', { params: data });
//发布商品
let release = (data) => axios.post('/api/admin/goods', data);
//获取商品详情
let getGoods = (data) => axios.get('/api/admin/goods', { params: data });
//编辑商品
let edit = (data) => axios.put('/api/admin/goods', data);
//删除图片
let removeImg = (data) => axios.delete('/api/upload', { params: data });
export default {
    list,
    remove,
    release,
    getGoods,
    edit,
    removeImg
}
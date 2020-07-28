import axios from 'axios';
// 获取角色列表
let list = (data) => axios.get('/api/role/list', { params: data });
// 添加角色
let add = (data) => axios.post('/api/role', data);
//编辑角色
let edit = (data) => axios.put('/api/role', data);
//删除角色
let remove = (data) => axios.delete('/api/role', { params: data });
//获取角色菜单
let getMenu = (data) => axios.get('/api/role/config', { params: data });
//指定角色添加菜单
let addMenu = (data) => axios.post('/api/role/menu', data);
//指定角色删除菜单
let removeMenu = (data) => axios.delete('/api/role/menu', { params: data });
export default {
    list,
    add,
    edit,
    remove,
    getMenu,
    addMenu,
    removeMenu
}
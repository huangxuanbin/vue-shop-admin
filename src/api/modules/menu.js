import axios from 'axios';
// 获取子菜单
let loadChild = (data) => axios.get('/api/menu/sub', { params: data });
// 获取侧边栏菜单
let loadMenu = (data) => axios.get('/api/menu/tree', { params: data });
//编辑子菜单
let edit = (data) => axios.put('/api/menu', data);
//添加子菜单
let add = (data) => axios.post('/api/menu', data);
//删除子菜单
let remove = (data) => axios.delete('/api/menu', { params: data });
//获取所有图标
let iconList = (data) => axios.get('/api/admin/icon/list', { params: data });
//更新图标
let editIcon = (data) => axios.put('/api/menu/icon', data);
export default {
    loadChild,
    loadMenu,
    edit,
    add,
    remove,
    iconList,
    editIcon
}
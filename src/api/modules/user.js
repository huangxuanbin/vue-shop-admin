import axios from 'axios';
// 获取个人资料
let info = (data) => axios.get('/api/admin', { params: data });
// 修改个人资料
let edit = (data) => axios.put('/api/admin', data);
//获取管理员列表
let list = (data) => axios.get('/api/admin/list', { params: data });
// 删除账号
let remove = (data) => axios.delete('/api/admin', { params: data });
export default {
    info,
    edit,
    list,
    remove
}
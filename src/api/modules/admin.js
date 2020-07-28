import axios from 'axios';
let login = (data) => axios.post('/api/admin/login', data);
let register = (data) => axios.post('/api/admin/register',data);
export default {
    login,
    register,
}
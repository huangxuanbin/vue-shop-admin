import axios from 'axios';
let list = (data) => axios.get('/api/admin/order/list', { params: data });
export default {
    list
}
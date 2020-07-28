<template>
    <el-card class="box">
        <div slot="header" class="clearfix">
            <span>订单列表</span>
        </div>
        <!-- table -->
        <el-table :data="tableData">
            <el-table-column prop="id" label="#" width="50"></el-table-column>
            <el-table-column width="600">
                <template slot-scope="scope">
                    <el-table :data="scope.row.goodsList">
                        <el-table-column prop="name" label="商品" width="400">
                            <template slot-scope="scope">
                                <div class="goods-box">
                                    <div class="img-box">
                                        <img :src="scope.row.img_md" />
                                    </div>
                                    <div>
                                        <span>{{scope.row.name}}</span>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="goods_price" label="单价"></el-table-column>
                        <el-table-column prop="goods_num" label="数量"> </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column prop="payment" label="付款总额"></el-table-column>
            <el-table-column prop="create_time" sortable label="下单时间" width="180"></el-table-column>
            <el-table-column prop="status" sortable label="状态"></el-table-column>
            <el-table-column label="操作">
                <template>
                    <el-button type="primary" icon="el-icon-edit" plain></el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>
<script>
import { Order } from '@/api/index';
export default {
    created() {
        document.title = "订单列表";
        this.loadList();
    },
    data() {
        return {
            tableData: [],
        }
    },
    methods: {
        async loadList() {
            let { status, data } = await Order.list({ status: 'all' });
            if (status) {
                data.forEach(function (item) {
                    item.create_time = new Date(item.create_time).toLocaleString();
                });
                this.tableData = data;
            }
        }
    }
}
</script>
<style lang="less" scope>
.goods-box {
    display: flex;
    align-items: center;

    .img-box {
        margin-right: 10px;
        border: 1px solid #eee;

        img {
            width: 80px;
            display: block;
        }
    }
}
</style>
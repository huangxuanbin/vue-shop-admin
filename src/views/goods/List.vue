<template>
    <el-card class="box">
        <div slot="header" class="clearfix">
            <span>商品列表</span>
        </div>
        <!-- 表格 -->
        <el-table :data="tableData" style="width:100%">
            <el-table-column fixed label="商品名称" width="550">
                <template slot-scope="scope">
                    <div class="goods-name">
                        <div class="img-box">
                            <img :src="scope.row.img_md">
                        </div>
                        <div class="name">
                            <span>{{scope.row.name}}</span><br>
                            <span>商品货号：{{scope.row.articleNo}}</span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column sortable prop="price" label="价格"></el-table-column>
            <el-table-column sortable prop="inventory" label="库存"> </el-table-column>
            <el-table-column sortable prop="create_time" label="发布时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-link :href="`#/goods/edit/${scope.row.id}`" style="margin-right:10px">
                        <el-button type="primary" plain icon="el-icon-edit"></el-button>
                    </el-link>
                    <el-button type="danger" icon="el-icon-delete" plain @click="handleRemove(scope.row.id)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <br>
        <!-- 分页器 -->
        <el-pagination :page-sizes="[4,8,16,32]" :page-size="pageSize" :total="total" @size-change="pageSizeChange"
            @current-change="currentChange" background layout="->,prev,pager,next,sizes,total" class="am-margin-top-sm">
        </el-pagination>
    </el-card>
</template>
<script>
import { Goods } from '@/api/index';
export default {
    created() {
        this.loadList(0);
        document.title = "商品列表";
    },
    data() {
        return {
            tableData: [],
            total: 0,
            pageSize: 4,
            pageIndex: 1,
        };
    },
    methods: {
        async loadList() {
            let pageSize = this.pageSize;
            let pageIndex = this.pageIndex;
            let { status, goods, total } = await Goods.list({ pageSize, pageIndex });
            if (status) {
                this.tableData = goods;
                this.total = total
            }
        },
        handleRemove(id) {
            this.$confirm('确定要删除该商品吗?', {
                type: 'warning'
            })
                .then(async () => {
                    let { status, msg } = await Goods.remove({ id });
                    if (status) {
                        this.$message.success('删除成功！');
                        this.loadList();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });
        },
        pageSizeChange(i) {
            this.pageSize = i;
            this.loadList();
        },
        currentChange(i) {
            this.pageIndex = i;
            this.loadList();
        }
    },
}
</script>
<style lang="less" scoped>
.goods-name {
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

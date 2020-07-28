<template>
    <el-card class="box">
        <div slot="header">
            <span>商品分类</span>
        </div>
        <el-tree ref="tree" :default-expanded-keys="[1]" lazy node-key="id" :load="loadNode" :props="defaultProps">
            <div class="node-box" slot-scope="{ node, data }">
                <span class="node-name">{{ node.label }}</span>
                <span>
                    <el-button type="text" icon="el-icon-edit-outline" size="mini" :disabled="data.id==1"
                        @click.stop="openEditModal(node,data)">
                        编辑
                    </el-button>
                    <el-button type="text" icon="el-icon-plus" size="mini" @click.stop="openAddModal(node,data)">
                        添加
                    </el-button>
                    <el-button type="text" icon="el-icon-delete" size="mini" :disabled="data.id==1"
                        @click.stop="openDeleteModal(node,data)">
                        删除
                    </el-button>
                </span>
            </div>
        </el-tree>
        <!-- 编辑Modal -->
        <el-dialog title="编辑节点" :visible="editModalShow" :before-close="handleEditClose">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="img">
                    <upload-img :url.sync="editForm.img" ref="editImg" :actionUrl="actionUrl">
                    </upload-img>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editModalShow = false; $refs.editImg.firstDel = true;">取 消</el-button>
                <el-button type="primary" @click="handleEditUpdate">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加Modal -->
        <el-dialog title="添加节点" :visible="addModalShow" :before-close="handleAddClose">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="img">
                    <upload-img :url.sync="addForm.img" ref="addImg" :actionUrl="actionUrl"></upload-img>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addModalShow = false;$refs.addImg.firstDel = true;">取 消</el-button>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
import { Category } from '@/api/index';
import UploadImg from '@/components/SingleUpload.vue';
export default {
    components: {
        UploadImg,
    },
    created() {
        document.title = "商品分类";
    },
    data() {
        return {
            actionUrl: '/api/upload/common',
            editModalShow: false,
            addModalShow: false,
            editNodeData: '',
            addNodeData: '',
            defaultProps: {
                label: 'name',
            },
            headers: {
                Authorization: `Bearer ${sessionStorage.token}`
            },
            editForm: {
                name: "",
                id: '',
                img: ''
            },
            addForm: {
                name: "",
                pId: '',
                img: '',
            },
            rules: {
                name: [
                    { required: true, message: '分类名称不能为空', trigger: 'blur' },
                ],
                img: [
                    { required: true, message: '图片不能为空', trigger: 'blur' },
                ]
            },
        }
    },
    methods: {
        // 懒加载节点
        async loadNode(node, resolve) {
            if (node.level === 0) {
                let { data } = await Category.loadChild({ pId: 0 });
                return resolve(data);
            }
            let { data } = await Category.loadChild({ pId: node.data.id });
            return resolve(data);
        },
        // 编辑
        openEditModal(node, data) {
            this.editModalShow = true;
            this.editForm = { ...data };
            this.editNodeData = node;
        },
        handleEditClose() {
            this.$refs.editImg.firstDel = true;
            this.editModalShow = false;
        },
        handleEditUpdate() {
            this.$refs.editForm.validate(async (valid) => {
                if (!valid) { return false };
                let { status, msg } = await Category.update({ ...this.editForm });
                if (status) {
                    this.$message.success('编辑成功');
                    this.editModalShow = false;
                    var isdelUrl = this.$refs.editImg.delUrl;
                    if (isdelUrl !== '') {
                        this.$refs.editImg.delImgSrc();
                        this.$refs.editImg.firstDel = true;
                    }
                    // 更新DOM
                    this.editNodeData.data = { ...this.editForm };
                }
            });
        },
        // 添加
        openAddModal(node, data) {
            this.addModalShow = true;
            this.addForm.pId = data.id;
            this.addNodeData = node;
        },
        handleAddClose() {
            this.$refs.addImg.firstDel = true;
            this.addModalShow = false;
        },
        handleAdd() {
            this.$refs.addForm.validate(async (valid) => {
                if (!valid) { return false };
                let { status, data } = await Category.add({ ...this.addForm });
                if (status) {
                    this.$message.success('添加成功');
                    this.addModalShow = false;
                    var isdelUrl = this.$refs.addImg.delUrl;
                    if (isdelUrl !== '') {
                        this.$refs.addImg.delImgSrc();
                        this.$refs.addImg.firstDel = true;
                    }
                    // 更新DOM
                    this.$refs.tree.append({ ...this.addForm, ...data }, this.addNodeData);
                    // 4.清空表单
                    this.addForm = { name: "", pId: '', img: '' };
                }
            });
        },
        // 删除
        openDeleteModal(node, data) {
            this.$confirm('是否永久删除该分类?', {
                type: 'warning',
            })
                .then(async () => {
                    let { status } = await Category.remove({ id: data.id });
                    if (status) {
                        node.remove();
                        this.$message.success('删除成功!');
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });
        },
    },
}
</script>
<style lang="less" scope>
.node-box {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;

    .node-name {
        font-size: 14px;
    }
}
</style>
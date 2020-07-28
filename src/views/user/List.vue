<template>
    <el-card class="box">
        <div slot="header" class="clearfix">
            <span>用户列表</span>
        </div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="#">
            </el-table-column>
            <el-table-column sortable label="头像">
                <template slot-scope="scope">
                    <img class="img" :src="scope.row.avatar">
                </template>
            </el-table-column>
            <el-table-column prop="username" sortable label="账号">
            </el-table-column>
            <el-table-column prop="fullname" sortable label="姓名">
            </el-table-column>
            <el-table-column prop="sex" sortable label="性别">
            </el-table-column>
            <el-table-column prop="tel" sortable label="手机">
            </el-table-column>
            <el-table-column prop="role_name" sortable label="角色">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.role===1?'danger':''">{{scope.row.role_name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="login_time" width="160" sortable label="上次登录">
            </el-table-column>
            <el-table-column prop="login_count" sortable label="登录次数">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="showEditModal(scope.row)" plain icon="el-icon-edit" type="primary"></el-button>
                    <el-button @click="showDeleteModal(scope.row.id)" :disabled="scope.row.id==1" icon="el-icon-delete"
                        plain type="danger"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--编辑数据-->
        <el-dialog title="修改信息" :visible="editModalShow" :before-close="handleEditClose">
            <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="80px">
                <el-form-item label="姓名" prop="fullname">
                    <el-input v-model="form.fullname" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="form.sex">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机" prop="tel">
                    <el-input v-model="form.tel" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="role">
                    <el-select v-model="form.role" placeholder="请选择账户">
                        <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <upload-img :url.sync="form.avatar" ref="uploadimg" :actionUrl="actionUrl">
                    </upload-img>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editModalShow = false; $refs.uploadimg.firstDel = true;">取 消</el-button>
                <el-button type="primary" @click="handleEdit">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
import UploadImg from '@/components/SingleUpload.vue';
import { User, Role } from '@/api/index';
export default {
    components: {
        UploadImg
    },
    created() {
        document.title = "用户列表";
        this.loadList();
    },
    data() {
        return {
            actionUrl: '/api/upload/avatar',
            editModalShow: false,
            tableData: [],
            roleOptions: [],
            form: {
                id: "",
                fullname: "",
                sex: "",
                tel: "",
                role: "",
                avatar: "",
            },
            rules: {
                fullname: [
                    { required: true, type: 'string', message: '姓名不能为空', trigger: 'blur' },
                    { pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/, message: '请输入正确的姓名', trigger: 'change' }
                ],
                sex: [
                    { required: true, message: '性别不能为空', trigger: 'blur' },
                ],
                tel: [
                    { required: true, message: '手机号不能为空', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号", trigger: 'change' }
                ],
                role: [
                    { required: true, message: '账户角色不能为空', trigger: 'blur' },
                ],
                avatar: [
                    { required: true, message: '头像不能为空', trigger: 'blur' },
                ],
            }
        }
    },
    methods: {
        async loadList() {
            let { status, data } = await User.list();
            if (status) {
                this.tableData = data;
            }
        },
        async loadRoleList() {
            let { status, data } = await Role.list();
            if (status) {
                this.roleOptions = data;
            }
        },
        // 编辑
        showEditModal(row) {
            this.editModalShow = true;
            this.form = { ...row };
            this.loadRoleList();
        },
        handleEditClose() {
            this.$refs.uploadimg.firstDel = true;
            this.editModalShow = false;
        },

        handleEdit() {
            this.$refs.form.validate(async (valid) => {
                if (!valid) { return false };
                let { status, msg } = await User.edit({ ...this.form });
                if (status) {
                    this.editModalShow = false;
                    this.$message.success(msg);
                    this.loadList();
                }
            })
        },
        // 删除
        showDeleteModal(id) {
            this.$confirm('是否永久删除该账户?', { type: 'warning' })
                .then(async () => {
                    let { status, msg } = await User.remove({ id });
                    if (status) {
                        this.$message.success('删除成功！');
                        this.loadList();
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
.img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
</style>
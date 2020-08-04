<template>
    <el-card class="box">
        <div slot="header">
            <span>账户信息</span>
        </div>
        <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="demo-ruleForm">
            <el-form-item label="账户:" required>
                <el-input v-model="form.username" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="姓名:" prop="fullname">
                <el-input v-model="form.fullname"></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
                <el-radio-group v-model="form.sex">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="手机:" prop="tel">
                <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item label="权限:" prop="role">
                <el-select v-model="form.role">
                    <el-option v-for="(item) in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <upload-img :url.sync="form.avatar" ref="uploadimg" :actionUrl="actionUrl">
                </upload-img>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="userEdit('form')">保存修改</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script>
import UploadImg from '@/components/SingleUpload.vue';
import axios from 'axios';
import { Role,User } from '@/api/index';
export default {
    components: {
        UploadImg
    },
    async created() {
        document.title = "账户信息";
        let id = sessionStorage.uid;
        if (id) {
            this.form = {...this.$store.state.UserData.profile};
            this.options = await this.loadRoleList();
        }
    },
    data() {
        return {
            actionUrl: '/api/upload/avatar',
            options: [],
            form: {
                avatar: '',
                email: null,
                fullname: '',
                id: '',
                role: '',
                sex: '',
                tel: '',
                username: ''
            },
            rules: {
                sex: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                fullname: [
                    { required: true, type: 'string', message: "请输入姓名", trigger: "blur" },
                    { type: 'string', pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/, message: '请输入正确的姓名', trigger: 'change' }
                ],
                tel: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号", trigger: 'change' }
                ],
                avatar: [
                    { required: true, message: "头像不能为空", trigger: "blur" },
                ],
                role: [
                    { required: true, message: "权限不能为空", trigger: "blur" },
                ]
            },
        }
    },
    methods: {
        async loadRoleList() {
            let { status, data } = await Role.list();
            if (status) {
                return data;
            }
        },
        userEdit(form) {
            this.$refs[form].validate(async valid => {
                if (!valid) return false;
                let { status, msg } = await User.edit({ ...this.form });
                if (status) {
                    this.$message.success(msg);
                    this.$store.commit('UserData/editProfile',{...this.form});
                    this.$router.push('/user/list');
                } else {
                    this.$message.error(msg);
                }
                var isdelUrl = this.$refs.uploadimg.delUrl;
                if (isdelUrl == '') return;
                if (isdelUrl.indexOf('default') == -1) {
                    this.$refs.uploadimg.delImgSrc();
                }
            });
        }
    },
}
</script>
<style lang="less" scope>
.demo-ruleForm {
    width: 70%;
    margin: 0 auto;
}
</style>
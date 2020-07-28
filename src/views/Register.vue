<template>
    <div class="registerbox">
        <div class="container">
            <el-card>
                <div class="login" slot="header">注册</div>
                <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form">
                    <el-form-item prop="username" label="账户: ">
                        <el-input type="text" placeholder="请输入账号" prefix-icon="el-icon-user" v-model="form.username">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码:">
                        <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-key" v-model="form.password"
                            autocomplete="off" show-password></el-input>
                    </el-form-item>
                    <el-form-item prop="checkpass" label="确认密码:">
                        <el-input type="password" placeholder="请再次输入密码" prefix-icon="el-icon-key"
                            v-model="form.checkpass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="fullname" label="姓名:">
                        <el-input placeholder="请输入昵称" prefix-icon="el-icon-postcard" v-model="form.fullname"></el-input>
                    </el-form-item>
                    <el-form-item label="性别:" prop="sex">
                        <el-radio-group v-model="form.sex">
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="tel" label="手机:">
                        <el-input placeholder="请输入手机号" prefix-icon="el-icon-mobile-phone" v-model="form.tel"></el-input>
                    </el-form-item>
                    <el-form-item prop="agree">
                        <el-checkbox label="同意本站用户协议" v-model="form.agree"></el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="register('form')">注册</el-button>
                    </el-form-item>
                </el-form>
                <div class="login-foot">
                    <span>
                        <router-link to="/login">登录账户</router-link>
                    </span>
                    <span>
                        <router-link to="/login">忘记密码?</router-link>
                    </span>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { Admin } from '@/api/index';
export default {
    created() {
        document.title = "注册";
        
    },
    mounted() {
        window.addEventListener('keydown', this.keyDown);
    },
    destroyed() {
        window.removeEventListener('keydown', this.keyDown, false);
    },
    data() {
        var handleCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            form: {
                username: "",
                password: "",
                checkpass: "",
                fullname: "",
                sex: "男",
                tel: "",
                agree: "",
            },
            rules: {
                username: [
                    { required: true, type: 'string', message: "请输入账号", trigger: "blur" },
                    { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "change" }
                ],
                password: [
                    { required: true, type: 'string', message: '请输入密码', trigger: 'blur' },
                    { pattern: /^\d{3,}$/, message: "至少3位数字", trigger: 'change' }
                ],
                checkpass: [
                    { validator: handleCheck, trigger: 'blur' }
                ],
                fullname: [
                    { required: true, type: 'string', message: "请输入姓名", trigger: "blur" },
                    { type: 'string', pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/, message: '请输入正确的姓名', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                tel: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号", trigger: 'change' }
                ],
                agree: [
                    { required: true, message: '请同意用户协议', trigger: 'blur' }
                ],
            },
        };
    },
    methods: {
        keyDown(e) {
            if (e.keyCode == 13) {
                this.register('form');
            }
        },
        register(form) {
            this.$refs[form].validate(async valid => {
                if (!valid) return false;
                let { status, msg, data } = await Admin.register({ ...this.form });
                if (status) {
                    // 储存token uid role
                    sessionStorage.token = data.token;
                    sessionStorage.uid = data.id;
                    sessionStorage.role = data.role;
                    this.$message.success(msg);
                    this.$router.push('/user/info');
                } else {
                    this.$message.error(msg);
                }
            });
        }
    }
};
</script>
<style lang="less" scope>
.registerbox {
    height: 100%;
    background: url("../assets/images/login-bg.jpg") no-repeat top center;
    background-size: cover;
    font-size: 14px;

    .container {
        position: fixed;
        top: 50%;
        right: 0;
        transform: translate(-30px, -50%);
        background-color: white;
        border-radius: 5px;
        width: 400px;

        .login-foot {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
<template>
    <div class="loginbox">
        <div class="container">
            <el-card>
                <div slot="header" class="login">欢迎登录</div>
                <el-form :model="form" :rules="rules" ref="form" label-width="60px" class="form">
                    <el-form-item prop="username" label="账户:">
                        <el-input type="text" v-model="form.username" placeholder="账号"
                            prefix-icon="iconfont el-icon-user">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码:">
                        <el-input prefix-icon="iconfont el-icon-key" v-model="form.password" placeholder="密码"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login('form')">登录</el-button>
                    </el-form-item>
                </el-form>
                <div class="login-foot">
                    <span>
                        <router-link to="/register">注册账户</router-link>
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
import { Admin } from '@/api/index';
export default {
    created() {
        document.title = "登录";

    },
    mounted() {
        //绑定事件
        window.addEventListener('keydown', this.keyDown);
    },
    destroyed() {
        window.removeEventListener('keydown', this.keyDown, false);
    },
    data() {
        return {
            form: {
                username: "",
                password: ""
            },
            rules: {
                username: [
                    { required: true, type: 'string', message: "请输入账号", trigger: "blur" },
                ],
                password: [
                    { required: true, type: 'string', message: '请输入密码', trigger: 'blur' },
                ],
            }
        };
    },
    methods: {
        keyDown(e) {
            if (e.keyCode == 13) {
                this.login('form');
            }
        },
        login(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (!valid) return false;
                let { status, msg, data } = await Admin.login({ ...this.form });
                if (status) {
                    // 储存token uid role
                    sessionStorage.token = data.token;
                    sessionStorage.uid = data.id;
                    sessionStorage.role = data.role;
                    this.$message.success(msg);
                    // 判断是否有redirect参数
                    let { redirect } = this.$route.query;
                    if (redirect) {
                        // 如果有参数,跳转到指定页面
                        this.$router.replace(redirect);
                    } else {
                        // 如果没有参数,跳转到默认页面
                        this.$router.replace('/goods/list');
                    }
                } else {
                    this.$message.error(msg);
                }
            });
        },
    },
}
</script>
<style lang="less" scoped>
.loginbox {
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
        width: 350px;

        .login-foot {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
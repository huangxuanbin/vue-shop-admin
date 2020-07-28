<template>
    <div class="navbar">
        <div class="nav-left">
            <img src="../assets/images/logo.png" alt />
            <i class="el-icon-s-fold" @click="$emit('collapse')"></i>
        </div>
        <div class="nav-right">
            <el-menu class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff"
                active-text-color="#ffd04b">
                <el-submenu index="1">
                    <template slot="title">
                        <img :src="circleUrl" alt="">
                        <span style="margin-left:15px">{{username}}</span>
                    </template>
                    <el-menu-item>消息</el-menu-item>
                    <el-menu-item>设置</el-menu-item>
                    <el-menu-item @click="logout">退出</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
    </div>
</template>

<script>
import { User } from '@/api/index';
import axios from 'axios';
export default {
    created() {
        // 拿到个人id
        let id = sessionStorage.uid;
        if (id) {
            this.loadInfo(id);
        }
    },
    data() {
        return {
            username: '',
            circleUrl: ""
        }
    },
    methods: {
        async loadInfo(id) {
            let { data, status } = await User.info({ id });
            if (status) {
                this.username = data.username;
                this.circleUrl = data.avatar;
            }
        },
        // 退出登录
        logout() {
            sessionStorage.clear();
            this.$router.replace('/login');
            setTimeout(() => {
                this.$message.success('退出成功')
            })
        }
    },
};
</script>
<style lang="less" scope>
.navbar {
    background-color: #31404e;
    color: white;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 15px;
    .nav-left {
        img {
            height: 50px;
            width: 185px;
            vertical-align: middle;
        }
        i {
            cursor: pointer;
        }
    }
    .nav-right {
        .el-submenu__title {
            background-color: #31404e !important;

            img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        }
        .el-submenu__title:hover {
            background-color: rgb(39, 51, 62) !important;
        }
    }
}
</style>
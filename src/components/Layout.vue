<template>
    <el-container>
        <el-header>
            <NavBar></NavBar>
        </el-header>
        <el-container>
            <el-aside width="auto">
                <LeftMenu></LeftMenu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
import LeftMenu from "@/components/LeftMenu.vue";
export default {
    components: {
        NavBar,
        LeftMenu
    },
};
</script>
<style lang="less" scope>
    .el-header{
        padding: 0px !important;
    }
</style>
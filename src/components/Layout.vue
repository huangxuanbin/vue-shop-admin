<template>
    <el-container>
        <el-header>
            <NavBar @collapse="isCollapse = !isCollapse"></NavBar>
        </el-header>
        <el-container>
            <div>
                <LeftMenu :collapse="isCollapse"></LeftMenu>
            </div>
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
    data() {
        return {
            isCollapse:false,
        }
    },
};
</script>
<style lang="less" scope>
    .el-header{
        padding: 0px !important;
    }
</style>
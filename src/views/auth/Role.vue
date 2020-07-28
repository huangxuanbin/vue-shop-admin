<template>
    <el-row>
        <el-col :span="10">
            <el-card class="box-left">
                <div slot="header" class="clearfix">
                    <span>角色列表</span>
                    <el-button plain type="primary" style="float: right;" @click="addModalShow = true"
                        icon="el-icon-circle-plus-outline">添加角色
                    </el-button>
                </div>
                <el-table :data="tableData">
                    <el-table-column prop="id" label="#"></el-table-column>
                    <el-table-column label="角色">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.id===1?'danger':''">{{scope.row.name}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column width="180" label="操作">
                        <template slot-scope="scope">
                            <el-button :disabled="scope.row.id===1" type="primary" plain
                                @click="openEditModal(scope.row)" icon="el-icon-edit"></el-button>
                            <el-button :disabled="scope.row.id===1" type="danger" plain
                                @click="openRemoveModal(scope.row.id)" icon="el-icon-delete"></el-button>
                            <el-button type="primary" plain icon="el-icon-setting" @click="openRoleMenu(scope.row.id)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 添加角色 -->
                <el-dialog title="添加角色" :visible.sync="addModalShow">
                    <el-form label-width="80px" :model="addForm" :rules="rules" ref="addform">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="addForm.name"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="addModalShow = false">取 消</el-button>
                        <el-button type="primary" @click="handleAddRole">确 定</el-button>
                    </div>
                </el-dialog>
                <!-- 修改角色 -->
                <el-dialog title="修改角色" :visible.sync="editModalShow">
                    <el-form label-width="80px" :model="editForm" :rules="rules" ref="editform">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="editForm.name"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="editModalShow = false">取 消</el-button>
                        <el-button type="primary" @click="handleEditRole">确 定</el-button>
                    </div>
                </el-dialog>

            </el-card>
        </el-col>
        <el-col :span="14" class="box-right" v-show="roleMenuShow">
            <el-card v-for="(item) in roleMenu" :key="item.id">
                <div slot="header" class="menu-header">
                    <div class="menu-title">
                        <i class="el-icon-collection-tag"></i>
                        {{item.name}}
                    </div>
                    <el-switch @change="clickParent(item)" v-model="item.checked"></el-switch>
                </div>
                <el-row>
                    <el-col v-for="kid in item.children" :key="kid.id">
                        <div class="menu-box">
                            <div>{{kid.name}}</div>
                            <el-switch v-model="kid.checked" @change="clickChild(kid,item)"></el-switch>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
</template>
<script>
import { Role } from '@/api/index';
export default {
    created() {
        document.title = "用户角色";
        this.loadList();
    },
    data() {
        return {
            roleMenuShow: false,
            addModalShow: false,
            editModalShow: false,
            tableData: [],
            roleMenu: [],
            roleMenuId: '',
            addForm: { name: '' },
            editForm: { name: '' },
            rules: {
                name: [
                    { required: true, type: 'string', message: "角色名不能为空", trigger: "blur" },
                    { type: 'string', pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/, message: '请输入正确的姓名', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        async loadList() {
            let { status, data } = await Role.list();
            if (status) {
                this.tableData = data
            }
        },
        // 添加角色
        async handleAddRole() {
            this.$refs.addform.validate(async valid => {
                if (!valid) return false;
                let { status } = await Role.add({ ...this.addForm });
                if (status) {
                    this.$message.success('添加成功');
                    this.loadList();
                    this.addModalShow = false;
                }
            })
        },
        // 修改角色
        openEditModal(row) {
            this.editForm = { ...row };
            this.editModalShow = true;
        },
        async handleEditRole() {
            this.$refs.editform.validate(async valid => {
                if (!valid) return false;
                let { status } = await Role.edit({ ...this.editForm });
                if (status) {
                    this.$message.success('修改成功');
                    this.loadList();
                    this.editModalShow = false;
                }
            })
        },
        // 删除角色
        openRemoveModal(id) {
            this.$confirm('是否永久删除该角色?', {
                type: "warning"
            }).then(async () => {
                let { status } = await Role.remove({ id });
                if (status) {
                    this.$message.success('删除成功');
                    this.loadList();
                }
            }).catch(() => {
                this.$message.info('已取消删除');
            })
        },
        // 角色菜单
        async openRoleMenu(id) {
            this.roleMenuShow = true;
            let { status, data } = await Role.getMenu({ id });
            if (status) {
                this.roleMenu = data;
                this.roleMenuId = id;
            }
        },
        async clickParent({ id, checked, children }) {
            if (checked) {
                let { status } = await Role.addMenu({ role_id: this.roleMenuId, menu_id: id });
                children.forEach(async (item) => {
                    let { status } = await Role.addMenu({ role_id: this.roleMenuId, menu_id: item.id });
                    item.checked = checked;
                })
            } else {
                let { status } = await Role.removeMenu({ role_id: this.roleMenuId, menu_id: id });
                children.forEach(async (item) => {
                    let { status } = await Role.removeMenu({ role_id: this.roleMenuId, menu_id: item.id });
                    item.checked = checked;
                })
            }
        },
        async clickChild({ checked, id }, parent) {
            if (checked) {
                let { status } = await Role.addMenu({ role_id: this.roleMenuId, menu_id: id });
                if (!parent.checked) {
                    let { status } = await Role.addMenu({ role_id: this.roleMenuId, menu_id: parent.id });
                    parent.checked = checked;
                }
            } else {
                let { status } = await Role.removeMenu({ role_id: this.roleMenuId, menu_id: id });
                var isclick = parent.children.every((item) => item.checked == false);
                if (isclick) {
                    let { status } = await Role.removeMenu({ role_id: this.roleMenuId, menu_id: parent.id });
                    parent.checked = checked;
                }
            }
        }
    },
}
</script>
<style lang="less" scope>
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}
.box-right {
    padding-left: 20px;

    .el-card {
        margin-bottom: 10px;
    }
    .menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .menu-title {
            font-size: 14px;
            color: #409eff;
        }
    }

    .menu-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #909399;
        font-size: 12px;
        margin-bottom: 8px;
    }
}
</style>
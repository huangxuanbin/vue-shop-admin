<template>
    <el-card class="box">
        <div slot="header">
            <span>菜单权限</span>
        </div>
        <el-alert title="Tips" class="alert" type="warning" description="设置后台管理系统的左侧菜单,目前至多支持两层菜单,三层以上菜单将不会显示"
            show-icon>
        </el-alert>
        <el-tree ref="tree" :default-expanded-keys="[1]" lazy node-key="id" :load="loadNode" :props="defaultProps">
            <div class="node-box" slot-scope="{ node, data }">
                <span class="node-name">{{ node.label }}</span>
                <span>
                    <span class="node-icon">
                        <el-popover placement="left" width="150" trigger="hover">
                            <i :class="'el-icon-' + data.icon" class="iconbox"></i>
                            <el-button slot="reference" type="text" :icon="'el-icon-' + data.icon" size="mini"
                                :disabled="data.id==1" @click.stop="openIconModal(node,data)">
                                图标
                            </el-button>
                        </el-popover>
                    </span>
                    <el-button type="text" icon="el-icon-edit-outline" size="mini" :disabled="data.id==1"
                        @click.stop="openEditModal(node,data)">
                        编辑
                    </el-button>
                    <el-button type="text" icon="el-icon-plus" size="mini" @click.stop="openAddModal(node,data)">
                        添加
                    </el-button>
                    <el-button type="text" icon="el-icon-delete" size="mini" :disabled="data.id==1"
                        @click.stop="openDeleteModal(node,data.id)">
                        删除
                    </el-button>
                    <span class="node-order">显示序号:<el-tag>{{data.order}}</el-tag></span>
                </span>
            </div>
        </el-tree>
        <!-- 编辑 -->
        <el-dialog title="编辑节点" :visible.sync="editModalShow">
            <el-form label-width="80px" :model="editForm" :rules="rules" ref="editForm">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="链接地址">
                    <el-input v-model="editForm.path" placeholder="指定此菜单的链接地址,选填"></el-input>
                </el-form-item>
                <el-form-item label="显示顺序" prop="order">
                    <el-input v-model="editForm.order"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editModalShow = false">取 消</el-button>
                <el-button type="primary" @click="handleEditNode">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加节点 -->
        <el-dialog title="添加节点" :visible.sync="addModalShow">
            <el-form label-width="80px" :model="addForm" :rules="rules" ref="addForm">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="链接地址">
                    <el-input v-model="addForm.path" placeholder="指定此菜单的链接地址,选填"></el-input>
                </el-form-item>
                <el-form-item label="显示顺序" prop="order">
                    <el-input v-model="addForm.order" placeholder="显示顺序按照数字从小到大,如2001"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addModalShow = false">取 消</el-button>
                <el-button type="primary" @click="handleAddNode">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 图标节点 -->
        <el-dialog title="选择图标" :visible.sync="iconModalShow" width="72%">
            <ul class="icon-ul-box">
                <li :class="{checked:item.checked}" v-for="(item) in iconData" :key="item.id" @click="clickIcon(item)">
                    <i :class="'el-icon-' + item.name"></i>
                    <span class="icon-font">{{`el-icon-${item.name}`}}</span>
                </li>
            </ul>
            <!-- 分页器 -->
            <el-pagination :page-size="pageSize" :total="iconTotal" @current-change="currentChange" background
                layout="->,prev,pager,next">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click="iconModalShow = false">取 消</el-button>
                <el-button type="primary" @click="handleIconNode">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
import { Menu } from '@/api/index';
export default {
    created() {
        document.title = "菜单权限";
        this.loadIcon(1);
    },
    data() {
        return {
            defaultProps: {
                label: 'name',
            },
            editModalShow: false,
            addModalShow: false,
            iconModalShow: false,
            editNodeData: '',
            addNodeData: '',
            pageSize: 30,
            pageIndex: 1,
            iconTotal: 0,
            iconNodeData:'',
            clickMenuId: '',
            clickIconId: '',
            clickIconName:'',
            editForm: '',
            iconData: '',
            addForm: {
                name: "",
                pId: '',
                path: '',
                order: ''
            },
            rules: {
                name: [
                    { required: true, type: 'string', message: "角色名不能为空", trigger: "blur" },
                    { type: 'string', pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/, message: '请输入正确的菜单名', trigger: 'change' }
                ],
                order: [
                    { required: true, message: "显示序号不能为空弄", trigger: "blur" },
                    { pattern: /^[0-9]*$/, message: '请输入正确的序号', trigger: 'change' }

                ]
            }

        }
    },
    methods: {
        // 懒加载节点
        async loadNode(node, resolve) {
            if (node.level === 0) {
                let { data } = await Menu.loadChild({ pId: 0 });
                return resolve(data);
            }
            let { data } = await Menu.loadChild({ pId: node.data.id });
            return resolve(data);
        },
        async loadIcon(i) {
            var pageSize = this.pageSize;
            var pageIndex = this.pageIndex = i;
            let { status, icons, total } = await Menu.iconList({ pageSize, pageIndex });
            if (status) {
                icons.map((item) => item.checked = false);
                this.iconData = icons;
                this.iconTotal = total;
            }
        },
        // 编辑节点
        openEditModal(node, data) {
            console.log(data);
            this.editModalShow = true;
            this.editForm = { ...data };
            this.editNodeData = node;

        },
        handleEditNode() {
            this.$refs.editForm.validate(async (valid) => {
                if (!valid) { return false };
                let { status } = await Menu.edit({ ...this.editForm });
                if (status) {
                    this.$message.success('编辑成功');
                    this.editModalShow = false;
                    // 更新DOM
                    this.editNodeData.data = { ...this.editForm };
                }
            })
        },
        // 添加节点
        openAddModal(node, data) {
            this.addModalShow = true;
            this.addForm.pId = data.id;
            this.addNodeData = node;
        },
        handleAddNode() {
            this.$refs.addForm.validate(async (valid) => {
                if (!valid) { return false };
                let { status, data } = await Menu.add({ ...this.addForm });
                if (status) {
                    this.$message.success('添加成功');
                    this.addModalShow = false;
                    // 更新DOM
                    this.$refs.tree.append({ ...this.addForm, ...data }, this.addNodeData);
                    // 有序号不能同步排序问题
                    // 4.清空表单
                    this.addForm = { name: '', pId: '', path: '', order: '' };
                }
            });
        },
        // 删除节点
        openDeleteModal(node, id) {
            this.$confirm('是否永久删除该菜单', {
                type: 'warning',
            })
                .then(async () => {
                    let { status } = await Menu.remove({ id });
                    if (status) {
                        node.remove();
                        this.$message.success('删除成功!');
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });
        },
        // 编辑图标
        openIconModal(node, data) {
            console.log(node);
            this.iconModalShow = true;
            this.clickMenuId = data.id;
            this.iconNodeData = node;
        },
        clickIcon(data) {
            this.iconData.map((item) => item == data ? item.checked = true : item.checked = false);
            this.clickIconId = data.id;
            this.clickIconName = data.name;
        },
        currentChange(i) {
            this.loadIcon(i);
        },
        async handleIconNode() {
            let { status } = await Menu.editIcon({ id: this.clickMenuId, icon: this.clickIconId });
            if (status) {
                this.$message.success('修改图标成功');
                this.iconModalShow = false;
                // 修改图标
                this.iconNodeData.data.icon = this.clickIconName;
            }
        },
    },
}
</script>
<style lang="less" scope>
.alert {
    margin-bottom: 20px;
}
.iconbox {
    font-size: 25px;
}
.node-box {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;

    .node-icon {
        margin-right: 10px;
    }
    .node-name {
        font-size: 14px;
    }
    .node-order {
        font-size: 12px;
        margin-left: 10px;

        .el-tag {
            width: 50px;
            text-align: center;
            margin-left: 5px;
        }
    }
}
.icon-ul-box {
    overflow: hidden;
    list-style: none;
    padding: 0 !important;
    border: 1px solid #eaeefb;
    border-radius: 4px;
    margin-bottom: 15px;

    li {
        float: left;
        width: 10%;
        text-align: center;
        height: 100px;
        color: #666;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        margin-right: -1px;
        margin-bottom: -1px;
        font-size: 28px;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;

        i {
            margin: 15px 0px 18px;
            color: #606266;
            transition: color 0.15s linear;
        }
        .icon-font {
            font-size: 10px;
            transition: color 0.15s linear;
        }
    }
    .checked:hover,
    .checked {
        background-color: rgb(92, 182, 255);
        span,
        i {
            color: white;
        }
    }
    li:hover {
        span,
        i {
            color: rgb(92, 182, 255);
        }
    }
}
</style>
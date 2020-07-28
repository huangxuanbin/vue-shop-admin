<template>
    <div>
        <el-card class="box">
            <div slot="header">
                <span>发布新商品</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="120px">
                <el-form-item label="商品分类" required>
                    <el-select v-model="form.cate_1st" placeholder="请选择分类" class="goods-select">
                        <el-option v-for="item in cate_1st_options" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="form.cate_2nd" placeholder="请选择分类" class="goods-select">
                        <el-option v-for="item in cate_2nd_options" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="form.cate_3rd" placeholder="请选择分类" class="goods-select">
                        <el-option v-for="item in cate_3rd_options" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称" prop="name">
                    <el-col :span="14">
                        <el-input v-model="form.name"></el-input>
                    </el-col>
                    <el-col :span="24" class="pb-font">商品标题名称长度至少3个字符，最长200个汉字</el-col>
                </el-form-item>
                <el-form-item label="商品卖点" prop="hotPoint">
                    <el-col :span="14">
                        <el-input type="textarea" v-model="form.hotPoint"></el-input>
                    </el-col>
                    <el-col :span="24" class="pb-font">商品卖点不能超过140个汉字</el-col>
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                    <el-col :span="4">
                        <el-input v-model.number="form.price">
                            <template slot="append">元</template>
                        </el-input>
                    </el-col>
                    <el-col :span="24" class="pb-font">价格必须是0-999999之间的数字，且不能高于市场价</el-col>
                    <el-col :span="24" class="pb-font">此价格为商品实际销售价格，如果商品存在规格，改价格显示最低价格</el-col>
                </el-form-item>
                <el-form-item label="市场价" prop="marketPrice">
                    <el-col :span="4">
                        <el-input v-model.number="form.marketPrice">
                            <template slot="append">元</template>
                        </el-input>
                    </el-col>
                    <el-col :span="24" class="pb-font">价格必须是0-999999之间的数字，此价格仅为市场参考价，请根据实际情况认真填写</el-col>
                </el-form-item>
                <el-form-item label="成本价" prop="cost">
                    <el-col :span="4">
                        <el-input v-model.number="form.cost">
                            <template slot="append">元</template>
                        </el-input>
                    </el-col>
                    <el-col :span="24" class="pb-font">价格必须是0-999999之间的数字，此价格为商户对所销售的商品的实际成本价进行备注记录，非必填选项，不会在前台销售页面中显示
                    </el-col>
                </el-form-item>
                <el-form-item label="折扣" required>
                    <el-col :span="4">
                        <el-input readonly v-model="discount">
                            <template slot="append">折</template>
                        </el-input>
                    </el-col>
                    <el-col :span="24" class="pb-font">根据销售价与市场价比例自动生成不需要编辑</el-col>
                </el-form-item>
                <el-form-item label="商品库存" prop="inventory">
                    <el-col :span="4">
                        <el-input v-model.number="form.inventory">
                            <template slot="append">件</template>
                        </el-input>
                    </el-col>
                    <el-col :span="24" class="pb-font">价格必须是0-999999之间的整数</el-col>
                    <el-col :span="24" class="pb-font">若启动了库存配置，则系统自动计算商品的总数，此处无需卖家填写</el-col>
                </el-form-item>
                <el-form-item label="商品货号" prop="articleNo">
                    <el-col :span="4">
                        <el-input v-model="form.articleNo"></el-input>
                    </el-col>
                    <el-col :span="24" class="pb-font">商品货号是商家管理商品的编号，买家不可见</el-col>
                    <el-col :span="24" class="pb-font">最多输入20个字符，只支持输入中文、字母、数字、_、/、-和小数点</el-col>
                </el-form-item>
                <el-form-item label="商品主图" prop="img_md">
                    <upload-img :url.sync="form.img_md" :lg-img.sync="form.img_lg" ref="mainImg"
                        :actionUrl="actionMainUrl">
                    </upload-img>
                    <el-col :span="24" class="pb-font">
                        上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
                        800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中
                    </el-col>
                </el-form-item>
                <el-form-item label="商品轮播图" prop="slider">
                    <el-upload action="/api/upload/slider" :file-list="fileList" :limit="6" :headers="headers"
                        list-type="picture-card" :before-upload="handleBeforeUpload" :on-success="handleSuccess"
                        :on-error="handleError" :on-remove="handleRemove" :on-preview="handlePreview">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                    <el-col :span="24" class="pb-font">
                        上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
                        800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中
                    </el-col>
                </el-form-item>
                <div class="goods-title">商品详情描述</div>
                <el-form-item label="商品品牌">
                    <el-col :span="14">
                        <el-input v-model="form.brand"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="商品描述">
                    <div ref="editor"></div>
                </el-form-item>
                <div class="goods-title">商品物流信息</div>
                <el-form-item label="所在地" required>
                    <el-select v-model="form.province" placeholder="请选择活动区域" class="goods-select">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        <el-option label="区域三" value="beijing"></el-option>
                    </el-select>
                    <el-select v-model="form.city" placeholder="请选择活动区域" class="goods-select">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        <el-option label="区域三" value="beijing"></el-option>
                    </el-select>
                    <el-select v-model="form.area" placeholder="请选择活动区域" class="goods-select">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        <el-option label="区域三" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运费" prop="freight">
                    <el-col :span="3">
                        <el-input v-model="form.freight">
                            <template slot="append">元</template>
                        </el-input>
                    </el-col>
                    <el-col :span="24" class="pb-font">运费设为0，前台商品将显示免运费</el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="handleEdit">提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
import E from "wangeditor";
import UploadImg from '@/components/Upload.vue';
import { Category, Goods } from '@/api/index';
export default {
    components: {
        UploadImg
    },
    props: ["id"],
    created() {
        document.title = "编辑商品";

    },
    async mounted() {
        // 获取一级分类
        this.cate_1st_options = await this.loadSubcate(1);
        this.form.cate_1st = this.cate_1st_options[0].id;
        // 获取商品信息
        this.form = await this.loadGoods(this.id);
        var List = this.form.slider.split(',');
        this.fileList = List.map((item) => {
            var obj = {};
            obj.url = item;
            return obj;
        })
        var editor = new E(this.$refs.editor);
        // 配置图片上传API接口
        editor.customConfig.uploadImgServer = 'http://localhost:3003/api/upload/editor/';
        // 配置上传fileName
        editor.customConfig.uploadFileName = 'file';
        // 自定义header头部信息
        editor.customConfig.uploadImgHeaders = {
            Authorization: `Bearer ${sessionStorage.token}`,
        }
        editor.customConfig.onchange = html => {
            this.form.detail = html;
        };
        editor.create();
        editor.txt.html(this.form.detail);
    },
    watch: {
        "form.cate_1st"(val) {
            this.loadSubcate(val).then((data) => {
                if (data.length == 0) {
                    this.cate_2nd_options = [];
                    this.form.cate_2nd = "";
                    return false
                }
                this.cate_2nd_options = data;
                this.form.cate_2nd = data[0].id
            });
        },
        "form.cate_2nd"(val) {
            if (!val) {
                this.cate_3rd_options = [];
                this.form.cate_3rd = "";
                return false
            }
            this.loadSubcate(val).then((data) => {
                if (data.length == 0) {
                    this.cate_3rd_options = [];
                    this.form.cate_3rd = "";
                    return false
                }
                this.cate_3rd_options = data;
                this.form.cate_3rd = data[0].id
            });
        }
    },
    data() {
        return {
            actionMainUrl: '/api/upload/goods',
            dialogImageUrl: '',
            dialogVisible: false,
            headers: {
                Authorization: `Bearer ${sessionStorage.token}`
            },
            form: {
                cate_1st: "",
                cate_2nd: "",
                cate_3rd: "",
                name: "",
                hotPoint: "",
                price: "",
                marketPrice: "",
                cost: "",
                discount: "",
                inventory: 1000,
                articleNo: "",
                img_lg: "",
                img_md: "",
                slider: "",
                brand: "",
                detail: "",
                freight: "0",
                province: "山东省",
                city: "青岛市",
                area: "城阳区"
            },
            fileList: [],
            rules: {
                name: [
                    { required: true, message: '商品名称不能为空', trigger: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5]{3,200}$/, message: '请输入正确的商品名称', trigger: 'blur' }
                ],
                hotPoint: [
                    { required: true, message: '商品卖点不能为空', trigger: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5]{0,140}$/, message: '请输入正确的商品卖点内容', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '商品价格不能为空', trigger: 'blur' },
                    { pattern: /^[0-9]*$/, message: '请输入正确的商品价格', trigger: 'blur' }
                ],
                marketPrice: [
                    { required: true, message: '市场价不能为空', trigger: 'blur' },
                    { pattern: /^[0-9]*$/, message: '请输入正确的市场价格', trigger: 'blur' }
                ],
                cost: [
                    { required: true, message: '成本价不能为空', trigger: 'blur' },
                    { pattern: /^[0-9]*$/, message: '请输入正确的成本价', trigger: 'blur' }
                ],
                inventory: [
                    { required: true, message: '商品库存不能为空', trigger: 'blur' },
                    { pattern: /^[0-9]*$/, message: '请输入正确的商品库存', trigger: 'blur' }
                ],
                articleNo: [
                    { required: true, message: '商品货号不能为空', trigger: 'blur' },
                    { pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\-\/]{0,20}$/, message: '请输入正确的商品货号', trigger: 'blur' }
                ],
                img_md: [
                    { required: true, message: '商品主图不能为空', trigger: 'blur' },
                ],
                slider: [
                    { required: true, message: '商品轮播图不能为空', trigger: 'blur' },
                ],
                freight: [
                    { required: true, message: '运费不能为空', trigger: 'blur' },
                    { pattern: /^[0-9]*$/, message: '请输入正确的运费价格', trigger: 'blur' }
                ]
            },
            cate_1st_options: [],
            cate_2nd_options: [],
            cate_3rd_options: []
        }
    },
    computed: {
        discount() {
            let num = ((this.form.price / this.form.marketPrice) * 10).toFixed(2);
            // this.form.discount = parseInt(Number(num * 10).toFixed(1) + "%");
            this.form.discount = num
            if (isNaN(num) || num == "Infinity") {
                return '';
            }
            return num;
        }
    },
    methods: {
        //获取商品信息
        async loadGoods(id) {
            let { status, data } = await Goods.getGoods({ id });
            if (status) {
                return data;
            }
        },
        // 获取商品分类
        async loadSubcate(pId) {
            let { status, data } = await Category.loadChild({ pId });
            return data;
        },
        // 轮播图
        handleBeforeUpload(file) {
            let reg = /^image\/(jpe?g|png)$/;
            const isImg = reg.test(file.type);
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isImg) {
                this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isImg && isLt2M;
        },
        handleSuccess(res, file, fileList) {
            if (res.status) {
                var arrImg = [];
                fileList.forEach(function (item) {
                    arrImg.push(item.url);
                });
                this.form.slider = arrImg.join(",");
            }
        },
        handleError({ status, message }, file, fileList) {
            if (status == 400) {
                message = JSON.parse(message);
                this.$message.error(message.msg);
            }
        },
        handlePreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        async handleRemove(file, fileList) {
            var src = file.url.replace(/.+\/images/, "./images");
            let { status } = await Goods.removeImg({ src });
            if (status) {
                var arrImg = [];
                fileList.forEach(function (item) {
                    arrImg.push(item.url);
                });
                this.form.slider = arrImg.join(",");
            }
        },
        // 编辑商品
        async handleEdit() {
            this.$refs.form.validate(async valid => {
                if (!valid) return false;
                let { status } = await Goods.edit({ ...this.form });
                if (status) {
                    this.$message.success("修改商品成功！");
                    this.$router.push('/goods/list');
                }
            })
        }
    },
}
</script>
<style lang="less" scope>
.pb-font {
    font-size: 12px;
    color: #999;
}

.goods-title {
    background-color: #f5f5f5;
    padding: 10px;
    margin-bottom: 10px;
}
.w-e-text-container {
    min-height: 1500px;
    height: 1500px;
}
.goods-select {
    margin-right: 15px;
}
</style>
<template>
    <el-upload class="avatar-uploader" :action="actionUrl" :headers="headers"
        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
        :on-error="uploadError">
        <template v-if="url">
            <img :src="url" class="avatar">
            <i @click.stop="handleRemove" class="el-icon-delete avatar-uploader-remove"></i>
        </template>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
import axios from 'axios';
export default {
    props: ['url', 'actionUrl'],
    data() {
        return {
            firstDel: true,
            delUrl: '',
            headers: { Authorization: `Bearer ${sessionStorage.token}` },
        }
    },
    methods: {
        async handleRemove() {
            let isDefault = this.url.indexOf('default') >= 0;
            // 判断是否第一次删除
            if (this.firstDel) {
                this.delUrl = this.url;
                this.firstDel = !this.firstDel;
                this.$emit('update:url','');
                return false;
            } else {
                var src = this.url;
                let { status } = await axios.delete('/api/upload', { params: { src } });
                if (status) {
                    this.$emit('update:url','');
                }
            }
        },
        async delImgSrc() {
            var src = this.delUrl;
            let { status } = await axios.delete('/api/upload', { params: { src } });
        },
        //上传图片成功
        handleAvatarSuccess(res, file, fileList) {
            if (res.status) {
                this.$message.success(res.msg);
                this.$emit('update:url', res.src);
            }
        },
        // 上传图片失败
        uploadError({ status, message }, file, fileList) {
            if (status == 400) {
                message = JSON.parse(message);
                this.$message.error(message.msg);
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
    }
}
</script>

<style>
.avatar-uploader {
    width: 150px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader-icon,
.avatar-uploader-remove {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
}

.avatar {
    width: 150px;
    height: 150px;
    display: block;
}

.avatar-uploader:hover .avatar-uploader-remove {
    display: block;
}

.avatar-uploader-remove {
    position: absolute;
    left: 0;
    top: 0;
    color: white;
    background-color: rgba(0, 0, 0, 0.7);
    display: none;
    z-index: 10;
}
</style>

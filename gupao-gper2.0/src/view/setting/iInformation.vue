<template>

  <div class="person-nav">
    <div class="person-title">个人资料</div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <Row>
        <Col span="6">
          <div class="logo">
            <Avatar icon="ios-person" size="large" class="logo" :src="userAvatar"/>
          </div>
          <div class="upload">
            <Button type="primary" @click="openShearPlate">修改头像</Button>
          </div>
        </Col>
        <Col span="12">
          <Form :label-width="100">
            <FormItem label="用户名">
              <Input v-model="userinfo.name" :maxlength=20></Input>
            </FormItem>
            <FormItem label="性别">
              <RadioGroup v-model="userinfo.gender" size="large">
                <Radio label="1">男</Radio>
                <Radio label="2">女</Radio>
                <Radio label="0">保密</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="生日">
              <DatePicker type="date" v-model="userinfo.birthday" :clearable="false"></DatePicker>
            </FormItem>
            <FormItem label="所在城市">
              <Row>
                <Col span="9" style="padding-right:10px">
                  <Select v-model="userinfo.province" filterable @on-change="showProvince">
                    <Option v-for="item in province" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </Col>
                <Col span="3"><span style="font-size: 14px;">省/市</span></Col>
                <Col span="9" style="padding-right:10px">
                  <Select v-model="userinfo.city" filterable>
                    <Option v-for="item in citys" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </Col>
                <Col span="3"><span style="font-size: 14px;">市</span></Col>
              </Row>
            </FormItem>
            <FormItem label="身份职业">
              <Input v-model="userinfo.title" :maxlength=20></Input>
            </FormItem>
            <FormItem label="自我介绍">
              <Input v-model="userinfo.description" type="textarea" :autosize="{minRows: 4,maxRows: 5}"></Input>
            </FormItem>
            <FormItem label="打赏二维码">
             <!-- <div class="demo-upload-list" v-if="qrcodeUrl">
                <img :src="qrcodeUrl" style="vertical-align: top;">
              </div>-->
              <div class="ivu-upload" style="display: inline-block; width: 200px;">
                <div class="ivu-upload ivu-upload-drag">
                  <label for="qrcode" style="display: block;width: 200px;height: 230px;opacity: 0;"></label>
                  <input type="file" id ="qrcode" style="display: none" @change="uploadQR">
                  <div style="width: 200px; height: 230px; line-height: 230px;margin-top: -230px;">
                    <img :src="qrcodeUrl"  v-if="qrcodeUrl" style="width: 100%; height: 100%"/>
                    <i v-else class="ivu-icon ivu-icon-md-add" style="font-size: 20px;"></i>
                  </div>
                </div>
              </div>
            </FormItem>
            <FormItem>
              <Button long type="primary" @click="submitUserInfo">保存</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </div>


    <Modal v-model="avatarModel" title="修改头像" @on-ok="uploadAvatar">
      <div v-show="avatar.img" class="preview-box">
        <vueCropper
          ref="cropper3"
          :img = "avatar.img"
          :autoCrop = "avatar.autoCrop"
          :autoCropWidth = "avatar.autoCropWidth"
          :autoCropHeight = "avatar.autoCropHeight"
          :fixedBox = "avatar.fixedBox"
          @realTime = "realTime"
        ></vueCropper>
      </div>
      <div v-show="!avatar.img" class="ivu-upload ivu-upload-drag" style="display: inline-block;width: 488px; height: 400px;margin: auto;">
        <input type="file" style="display: block;width: 488px;height: 400px;opacity: 0;" @change="handleAvatar">
        <div style="padding: 164px 0px;margin-top: -400px;">
          <i class="ivu-icon ivu-icon-ios-cloud-upload" style="font-size: 52px; color: rgb(51, 153, 255);"></i>
          <p>点击选择图片上传</p>
        </div>
      </div>
    </Modal>
  </div>

</template>
<script>
  import vueCropper from 'vue-cropper'
  import lodash from "lodash"
  import axios from 'axios';
  import Vue from 'vue'
  Vue.use(vueCropper);

  export default {
    data () {
      return {
        userAvatar:'',
        qrcode:'',
        qrcodeUrl:'',
        userinfo:{},
        imageObj: {
          accept: 'image/gif, image/jpeg, image/png, image/jpg',
        },
        avatarModel:false,
        avatar: {
          img: '',
          autoCrop: true,
          autoCropWidth: 200,
          autoCropHeight: 200,
          fixedBox: true
        },
        previews:{}
      }
    },
    methods: {
      realTime (data) {
        this.previews = data;
      },
      showProvince(){
        this.userinfo.city = '';
        this.$store.state.person.queryCityListParams.provinceId = this.userinfo.province;
        this.$store.dispatch('queryCityList');
      },
      uploadQR(event){
        let img1 = event.target.files[0];
        let type = img1.type;
        let size = img1.size;
        if(this.imageObj.accept.indexOf(type) == -1){
          this.$Message.warning('请选择我们支持的图片格式！');
          return false;
        }
        if(size > 3145728){
          this.$Message.warning('请选择3M以内的图片！');
          return false;
        }
        let form = new FormData();
        form.append('file',img1,img1.name);
        form.append('type', 'QRCODES');
        this.$axios({
          method: 'post',
          url: '/img/upload',
          data: form,
          headers:this.getCustomHeader()
        }).then(res => {
          if(res.data.success){
            this.qrcode = res.data.data.imgName;
            this.qrcodeUrl = res.data.data.imgUrl;
          }else{
            this.$Message.error(res.data.message);
          }
        }).catch(error => {
          this.$Message.error('上传图片出错！');
        })
      },
      getCustomHeader(){
        var accessToken = this.$cookie.get('accessToken');
        var visitorToken = this.$cookie.get('visitorToken');
        if(accessToken){
          return {
            'Content-Type':'application/json;charset=UTF-8',
            'accessToken': accessToken
          };
        }else if(visitorToken){
          return {
            'Content-Type':'application/json;charset=UTF-8',
            'visitorToken': visitorToken
          };
        }
      },
      handleAvatar(){
        let reader = new FileReader();
        let img1 = event.target.files[0];
        reader.readAsDataURL(img1);
        var _this = this;
        reader.onload = function (e) {
          var result = reader.result;
          _this.avatar.img = result;
        }
      },
      uploadAvatar(){
        this.$refs.cropper3.getCropData((data) => {
          var file = this.dataURLtoFile(data,'avater.jpg');
          let form = new FormData();
          form.append('file', file, file.name);
          form.append('userId', this.userinfo.id);

          this.$axios({
            method: 'post',
            url: '/img/uploadAvatar',
            data: form,
            headers:this.getCustomHeader()
          }).then(res => {
          //this.$axios.post('/img/uploadAvatar',form).then(res => {
            if(res.data.success){
              this.$Message.success(res.data.message);
              this.avatarModel = false;
              this.userAvatar = res.data.data.imgUrl+'?time' + new Date().getTime();
              this.$store.dispatch('getUserInfo');
            }else{
              this.$Message.warning(res.data.message);
            }
          })
        });
      },
      dataURLtoFile(dataurl, filename) { //将base64转换为文件
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
      },
      submitUserInfo(){
        if(this.userinfo.name==''){
          this.$Message.warning("用户名不能为空");
          return;
        }
        this.usersParams.id = this.userinfo.id;
        this.usersParams.gender = this.userinfo.gender;
        this.usersParams.province = this.userinfo.province;
        this.usersParams.city = this.userinfo.city;
        this.usersParams.qrcode = this.qrcode;
        this.usersParams.mobile = this.userinfo.mobile;
        this.usersParams.title = this.userinfo.title;
        this.usersParams.description = this.userinfo.description;
        this.usersParams.name = this.userinfo.name;
        if (this.userinfo.birthday) {
          this.usersParams.birthday = this.$moment(this.userinfo.birthday).format('YYYY-MM-DD');
        } else {
          this.usersParams.birthday = ''
        }
        if (!this.usersParams.title) {
          this.usersParams.title = ' '
        }
        if (!this.usersParams.description) {
          this.usersParams.description = ' '
        }
        var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im, regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im, regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
        if(regEn.test(this.userinfo.name) || regCn.test(this.userinfo.name) || regStr.test(this.userinfo.name)) {
          this.$Message.warning('用户名不能包含特殊字符.');
          return;
        }
        console.log(this.usersParams);
        this.$store.dispatch('usersUpdata');
      },
      openShearPlate(){
        this.avatarModel = true;
        this.avatar.img = '';
      }
    },
    mounted () {
      this.$store.dispatch('getUserInfo');
      this.$store.dispatch('queryProvinceList');
    },
    computed:{
      usersParams(){
        return this.$store.state.person.usersUpdataParams
      },
      oldUser(){
        return lodash.cloneDeep(this.$store.state.login.userResult);
      },
      province(){
        return this.$store.state.person.queryProvinceListData;
      },
      citys(){
        return this.$store.state.person.queryCityListData;
      },
    },
    watch:{
      oldUser: {
        handler(curr, old) {
          if(curr.success){
            this.userinfo = curr.data;
            if (!this.userinfo.gender) {
              this.userinfo.gender = 0;
            }
            this.userinfo.gender = this.userinfo.gender + '';
            this.userAvatar = curr.data.avatarUrl+'?time'+new Date().getTime();
            this.qrcodeUrl = this.userinfo.qrcodeUrl;
            this.$store.state.person.queryCityListParams.provinceId = this.userinfo.province;
            this.$store.dispatch('queryCityList');
          }
        },
        deep: true
      }
    }
  }
</script>
<style>form label {font-size: 14px !important;}</style>
<style scoped>
  .person-title{margin-top:4px;font-size:20px;font-weight:400;height:37px;font-family:PingFang SC;color:#000000;border-bottom:1px dotted #e8e8e8;}
  .dotted-line{height: 1px;margin-top:1px;border-bottom:1px dotted #e8e8e8;}
  .person-content{min-height: 300px;margin:21px 0;width:100%;}
  .logo{display: block;margin:0 34px;height: 85px;width: 85px;border-radius: 50%;float:left;}
  .upload{display: inline-block;width: 100%;margin: 9px auto;text-align: center;}
  .demo-upload-list{display:inline-block;width:60px;height:60px;text-align:center;line-height:60px;border:1px solid transparent;border-radius:4px;overflow:hidden;background:#fff;position:relative;box-shadow:0 1px 1px rgba(0,0,0,.2);margin-right:4px}
  .demo-upload-list img{width:100%;height:100%}
  .demo-upload-list-cover{display:none;position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.6)}
  .demo-upload-list:hover .demo-upload-list-cover{display:block}
  .demo-upload-list-cover i{color:#fff;font-size:20px;cursor:pointer;margin:0 2px}
  .preview-box{width:488px;height:400px;border:solid 1px#ddd;}
</style>

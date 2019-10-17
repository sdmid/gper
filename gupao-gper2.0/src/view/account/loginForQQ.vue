<template>
  <div class="login-wrap">
    <div class="ms-login" v-if="bindState">
      <div class="ms-title">
        <Alert type="warning" show-icon style="margin: 30px 25px;padding: 8px 48px 8px 26px;">使用第三方社交账号首次登录需要完善资料信息</Alert>
        <span style="margin: 0 auto 30px;">账号关联</span>
      </div>
      <Form ref="formValidate">
        <FormItem>
          <Input prefix="ios-contact" size="large" v-model="formItem.name" placeholder="默认第三方登录昵称" required></Input>
        </FormItem>
        <span style="color: #2b85e4;margin-left: 5px;">VIP用户请使用QQ邮箱注册</span>
        <FormItem>
          <Input prefix="md-mail" size="large" v-model="formItem.email" placeholder="请输入邮箱" required></Input>
        </FormItem>
        <FormItem>
          <Input prefix="md-phone-portrait" size="large" v-model="formItem.mobile" placeholder="请输入手机号" required></Input>
        </FormItem>

        <FormItem class="imageCode">
          <Input size="large" v-model="formItem.captcha" placeholder="请输入图片验证码" required>
            <span slot="prepend">
              <Icon type="md-keypad" size="16" color="#808695"/>
            </span>
            <span slot="append" style="height: 32px;width: 92px;display: block;">
              <img :src="code_img" title="看不清，换一张" style="height: 32px;cursor: pointer;" @click="change_code">
            </span>
          </Input>
        </FormItem>
        <FormItem>
          <Input size="large" placeholder="输入短信验证码" v-model="formItem.verifyCode">
            <span slot="prepend">
              <Icon type="md-mail" size="16" color="#808695"/>
            </span>
            <span slot="append">
              <Button :disabled="sendmsg.disabled" @click="handleMobile">{{sendmsg.text}}</Button>
            </span>
          </Input>
        </FormItem>

        <FormItem>
          <Input prefix="md-lock" size="large" v-model="formItem.newPassword" placeholder="设置6至20位登录密码" required></Input>
        </FormItem>
        <FormItem prop="password">
          <Input prefix="md-lock" size="large" v-model="formItem.confirmPassword" placeholder="请再次输入密码" required></Input>
          <Checkbox v-model="formItem.agreement" style="margin-right: 0;">我已阅读并同意</Checkbox><a href="javascript:void(0)" @click="goUserAgreement">《用户协议和隐私条款》</a>
        </FormItem>
        <FormItem>
          <Button type="primary" long @click="handleSubmit()">登录</Button>
        </FormItem>
      </Form>
    </div>


    <div class="ms-login" v-if="!bindState">
      <div class="ms-title">
        <div class="spinner">
          <div class="rect1"></div>
          <div class="rect2"></div>
          <div class="rect3"></div>
          <div class="rect4"></div>
          <div class="rect5"></div>
        </div>
        <span>
          <span style="font-size:18px;font-weight:400;line-height:22px;margin: -30px auto 64px;">您正在使用QQ登录</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'loginForQQ',
    data: function(){
      return {
        bindState:false,
        updateCount:0,
        formItem: {
          openId:'',
          authType:'QQ',
          name: '',
          email: '',
          mobile: '',
          captcha:'',
          verifyCode: '',
          newPassword: '',
          confirmPassword: '',
          agreement:false
        },
        sendmsg:{
          time:120,
          text:'发送验证码',
          disabled:false
        }
      }
    },
    beforeRouteLeave (to, from, next) {//离开当前页监听事件
      if(this.updateCount > 1){ //更新次数大于1 说明用户修改过当前页数据 因为获取详情时会更新一次
        if(from.path.includes('qqcallback')){
          this.$Modal.confirm({
            title:'提示',
            content:'您还未保存页面内容，确定需要离开本页面吗?',
            okText:'确定',
            cancelText:'取消',
            onOk:()=>{next();}
          });
        }else{next();}
      }else{next();}
    },
    updated:function () {
      this.updateCount = this.updateCount + 1;
    },
    mounted() {
      this.change_code();
      /*setTimeout(() => {
        this.bindState = true;
      },1000);*/

      let params = this.$route.query;
      if(params && params.state == 'gper'){//登录
        this.qqLoginParams.authCode = params.code;
        this.$store.dispatch("qqLogin");
      }else if(params && params.state == 'bind'){//绑定
        this.bind_params.authCode = params.code;
        this.bind_params.userId = this.$cookie.get('userId');
        this.$store.dispatch("bind");
      }else if(!params || !params.state){
        this.$Message.error('参数异常，即将跳转登录页面');
        setTimeout(() =>{ this.$router.push({path:'/login'}) },1000);
      }
    },
    methods: {
      handleSubmit () {
        if(!this.formItem.name){
          this.$Message.error('请设置用户昵称');return;
        }
        if(!this.formItem.email){
          this.$Message.error('请输入邮箱');return;
        }
        if(!this.formItem.mobile){
          this.$Message.error('请输入手机号码');return;
        }
        if(!this.formItem.captcha){
          this.$Message.error('请输入图形验证码');return;
        }
        if(!this.formItem.verifyCode){
          this.$Message.error('请输入短信验证码');return;
        }
        if(!this.formItem.newPassword){
          this.$Message.error('请设置登录密码');return;
        }
        if(!this.formItem.confirmPassword){
          this.$Message.error('请再次输入登录密码');return;
        }
        if(this.formItem.newPassword != this.formItem.confirmPassword){
          this.$Message.error('两次输入密码不一致');return;
        }
        if(!this.formItem.agreement){
          this.$Message.error('请阅读并同意《用户协议和隐私条款》');return;
        }
        if(!this.$common.validateUserName(this.formItem.name)){
          this.$Message.error('用户昵称不能包含特殊字符');return;
        }
        if(!this.$common.validateEmail(this.formItem.email)){
          this.$Message.error('请输入正确的邮箱号码');return;
        }
        this.$store.dispatch("qqRegister",this.formItem);
      },
      handleMobile(){
        var mobile = this.formItem.mobile;
        var captcha = this.formItem.captcha;
        if(mobile){
          if(this.$common.isPhoneNum(mobile)){
            if(!captcha){
              this.$Message.error('请输入图形验证码');return;
            }
            this.sendMsg();
          }else{
            this.$Message.error('请输入正确的手机号码');
          }
        }else{
          this.$Message.error('请输入手机号码');
        }
      },
      goUserAgreement(){
        this.$common.clearCookies();
        let tempPage = window.open('', '_blank');
        axios({method: 'GET',url: 'genera/init'}).then(response=>{
          if(response.data.success){
            this.$cookie.set("userId","-1",{expires:30});
            this.$cookie.set('visitorToken',response.data.data.visitorToken,{expires:30});
            this.updateCount = 0;
            const {href} = this.$router.resolve({path: "/user_agreement"});
            tempPage.location = href;
          }
        }).catch(err=>{});
      },
      error900(cur){
        var str = cur.message + '';
        if(cur.errCode == '900'){
          this.$Message.error(str);
          this.updateCount = 0;
          setTimeout(() =>{
            this.$router.push({path:'/login'});
          },1000);
        }else{
          this.$Message.error(str);
        }
      },
      sendMsg(){
        this.$post('sendSms/send', {
          captcha: this.formItem.captcha,
          mobile: this.formItem.mobile,
          captchaKey: this.captchakey,
          sendType:'register'
        }).then((res) =>{
          if(res.data.success){
            this.$Message.success('短信验证码发送成功');
            this.countDown();
          }else{
            this.$Message.error(res.data.message);
            this.change_code();
          }
        });
      },
      countDown() {
        this.sendmsg.time = this.sendmsg.time - 1;
        this.sendmsg.disabled = true;
        this.sendmsg.text = this.sendmsg.time + '秒';
        if (this.sendmsg.time == 0) {
          this.sendmsg.time = 120;
          this.sendmsg.text = '重新发送';
          this.sendmsg.disabled = false;
          this.change_code();
          return;
        }
        setTimeout(() =>{
          this.countDown();
        },1000);
      },
      change_code(){//获取验证码
        this.$store.dispatch('get_code');
      },
    },
    computed: {
      qqLoginRes(){
        return this.$store.state.qqinfor.qqLoginRes
      },
      qqLoginParams(){
        return this.$store.state.qqinfor.qqLoginParams
      },
      qqRegisterRes(){
        return this.$store.state.qqinfor.qqRegisterRes
      },
      bind_params(){
        return this.$store.state.person.bind_params
      },
      bind_act_res(){
        return this.$store.state.person.bind_act_res
      },
      code_img(){
        var base64 = this.$store.state.action.code_res;
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(base64).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      },
      captchakey(){
        return this.$store.state.action.captchakey;
      }
    },
    watch: {
      qqLoginRes: {
        handler(cur, old) {
          if (cur.success) {
            if(cur.data.bindStatus == '1'){
              var loginHref = this.$cookie.get("login_back_href");
              this.$common.clearCookies();
              this.$cookie.set("userId",cur.data.user.id,{expires:30});
              this.$cookie.set("accessToken", cur.data.user.accessToken,{expires:30});
              this.$cookie.set('refreshToken', cur.data.user.refreshToken,{expires:30});
              this.updateCount = 0;
              if(loginHref){
                this.$router.push({path:loginHref});
              }else{
                this.$router.push({path:'/index'});
              }
            }else if(cur.data.bindStatus == 0){
              this.bindState = true;
              this.formItem.openId = cur.data.openId;
              this.formItem.name = cur.data.nickName;
            }
          }else{
            this.error900(cur);
          }
        },
        deep: true
      },
      qqRegisterRes: {
        handler(cur, old) {
          if (cur.success) {
            var loginHref = this.$cookie.get("login_back_href");
            this.$common.clearCookies();
            this.$cookie.set("userId",cur.data.id,{expires:30});
            this.$cookie.set("accessToken", cur.data.accessToken,{expires:30});
            this.$cookie.set('refreshToken', cur.data.refreshToken,{expires:30});
            this.$store.dispatch('getUserInfo');
            this.updateCount = 0;
            if(loginHref){
              this.$router.push({path:loginHref});
            }else{
              this.$router.push({path:'/index'});
            }
          }else{
            this.error900(cur);
          }
        },
        deep: true
      },
      bind_act_res: {
        handler(cur, old) {
          if (cur.success) {
            this.updateCount = 0;
            this.$router.push({
              path:'/personalData/bindingAccount',
              query:{userId:this.$cookie.get('userId')}
            });
            /*setTimeout(() => {
              window.location.reload();
            },100);*/
          }else{
            this.error900(cur);
          }
        },
        deep: true
      }
    }
  }
</script>
<style>
  .imageCode .ivu-input-group-append{padding:0 !important;}
</style>
<style scoped>
  @import './login.css';
  .spinner{margin: 94px auto 0px;width:50px;height:60px;text-align:center;font-size:10px}
  .spinner > div{background-color:#67CF22;height:100%;width:6px;display:inline-block;-webkit-animation:stretchdelay 1.2s infinite ease-in-out;animation:stretchdelay 1.2s infinite ease-in-out}
  .spinner .rect2{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}
  .spinner .rect3{-webkit-animation-delay:-1.0s;animation-delay:-1.0s}
  .spinner .rect4{-webkit-animation-delay:-0.9s;animation-delay:-0.9s}
  .spinner .rect5{-webkit-animation-delay:-0.8s;animation-delay:-0.8s}
  @-webkit-keyframes stretchdelay{
    0%,40%,100%{-webkit-transform:scaleY(0.4)}
    20%{-webkit-transform:scaleY(1.0)}
  }
  @keyframes stretchdelay{
    0%,40%,100%{transform:scaleY(0.4);-webkit-transform:scaleY(0.4)}
     20%{transform:scaleY(1.0);-webkit-transform:scaleY(1.0)}
  }
</style>

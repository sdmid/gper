<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">
        <span>手机号验证码登录</span>
      </div>
      <Form ref="formValidate">
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
        <FormItem prop="password">
          <Input size="large"  @on-enter="handleSubmit('formValidate')"  placeholder="输入短信验证码" v-model="formItem.verifyCode">
            <span slot="prepend">
              <Icon type="md-mail" size="16" color="#808695"/>
            </span>
            <span slot="append">
              <Button :disabled="sendmsg.disabled" @click="handleMobile">{{sendmsg.text}}</Button>
            </span>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" long :loading="loadingSubmit" @click="handleSubmit('formValidate')">登录</Button>
        </FormItem>
        <FormItem>
          <Button type="text" class="left" ghost @click="goLogin">账号密码登录</Button>
          <Button type="text" class="right" ghost @click="goRegister">新用户注册</Button>
        </FormItem>
      </Form>

    </div>
  </div>
</template>

<script>

  export default {
    name: 'loginForTel',
    data: function(){
      return {
        formItem: {
          mobile: '',
          verifyCode: '',
          captcha:'',
          captchaKey:'',
        },
        sendmsg:{
          time:120,
          text:'发送验证码',
          disabled:false
        },
        loadingSubmit:false
      }
    },
    mounted(){
      this.change_code();
    },
    methods: {
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
      sendMsg(){
        this.$post('sendSms/send', {
          captcha: this.formItem.captcha,
          captchaKey: this.captchakey,
          mobile: this.formItem.mobile,
          sendType:'login'
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
      handleSubmit (name) {
        if(!this.formItem.mobile){
          this.$Message.error('请输入手机号码');return;
        }
        if(!this.formItem.captcha){
          this.$Message.error('请输入图形验证码');return;
        }
        if(!this.formItem.verifyCode){
          this.$Message.error('请输入短信验证码');return;
        }
        this.loadingSubmit = true;
        var params = {};
        params.name = this.formItem.username;
        params.mobile = this.formItem.mobile;
        params.verifyCode = this.formItem.verifyCode;
        this.$post('auth/phoneLogin', params).then((response) =>{
          this.loadingSubmit = false;
          if(response.data.success){
            this.$Message.success("登录成功！");
            var loginHref = this.$cookie.get("login_back_href");
            this.$common.clearCookies();
            this.$cookie.set("userId",response.data.data.id,{expires:30});
            this.$cookie.set('accessToken', response.data.data.accessToken,{expires:30});
            this.$cookie.set('refreshToken', response.data.data.refreshToken,{expires:30});
            if(loginHref){
              this.$router.push({path:loginHref});
            }else{
              this.$router.push({path:'/index'});
            }
          }else{
            this.$Message.error(response.data.message);
            this.change_code();
          }
        });
      },
      goLogin(){
        this.$router.push({path:'/login'});
      },
      goRegister(){
        this.$router.push({path:'/register'});
      },
      change_code(){//获取验证码
        this.$store.dispatch('get_code');
      },
    },
    computed:{
      code_img(){
        var base64 = this.$store.state.action.code_res;
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(base64).reduce((data,byte)=>data + String.fromCharCode(byte),'')
        );
      },
      captchakey(){
        return this.$store.state.action.captchakey;
      }
    }
  }
</script>
<style>
  .imageCode .ivu-input-group-append{padding:0 !important;}
</style>
<style scoped>
  @import './login.css';
</style>

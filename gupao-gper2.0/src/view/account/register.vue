<template>
  <div id="register" class="login-wrap">
    <div class="ms-login" style="top: 20%;">
      <div class="ms-title">
        <span>用户注册</span>
      </div>
      <div style="text-align: center;">
        <Tabs :value="resetType" @on-click="tabClick">
          <TabPane label="手机注册" icon="md-phone-portrait" name="phone">
            <Form ref="formValidate" :model="formItem"  v-show="resetType == 'phone'">
              <FormItem>
                <Input size="large" v-model="formItem.username" placeholder="请设置用户昵称" required>
                  <span slot="prepend">
                    <Icon type="ios-contact" size="16" color="#808695"/>
                  </span>
                </Input>
              </FormItem>
              <FormItem>
                <Input size="large" v-model="formItem.mobile" placeholder="请输入手机号" required>
                  <span slot="prepend">
                    <Icon type="md-phone-portrait" size="16" color="#808695"/>
                  </span>
                </Input>
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
                <Input type="password" size="large" v-model="formItem.password" placeholder="设置6至20位登录密码" required>
                  <span slot="prepend">
                    <Icon type="md-lock" size="16" color="#808695"/>
                  </span>
                </Input>
              </FormItem>
              <FormItem>
                <Input type="password" size="large" v-model="formItem.confirmPassword" placeholder="请再次输入密码" required>
                  <span slot="prepend">
                    <Icon type="md-lock" size="16" color="#808695"/>
                  </span>
                </Input>
                <div style="text-align: left;">
                  <Checkbox style="margin-right: 0;" v-model="formItem.agreement">我已阅读并同意</Checkbox><a href="javascript:void(0)" @click="goUserAgreement">《用户协议和隐私条款》</a>
                </div>
              </FormItem>
              <FormItem>
                <Button type="primary" long @click="handleSubmit('formValidate')">注册</Button>
              </FormItem>

              <FormItem>
                <Button type="text" long @click="toLogin">已有账号，立即登录</Button>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane label="邮箱注册" icon="ios-mail" name="email">
            <Form ref="formValidate" :model="formItem1" v-show="resetType == 'email'">
              <FormItem>
                <Input size="large" v-model="formItem1.name" placeholder="请设置用户昵称" required>
                <span slot="prepend">
                    <Icon type="ios-contact" size="16" color="#808695"/>
                  </span>
                </Input>
              </FormItem>
              <div style="text-align: left;">
                <span style="color: #2b85e4;margin-left: 5px;">VIP用户请使用QQ邮箱注册</span>
              </div>
              <FormItem>
                <Input size="large" v-model="formItem1.email" placeholder="请输入邮箱" required>
                <span slot="prepend">
                    <Icon type="md-mail" size="16" color="#808695"/>
                  </span>
                </Input>
              </FormItem>
              <FormItem>
                <Input type="password" size="large" v-model="formItem1.password" placeholder="设置6至20位登录密码" required>
                <span slot="prepend">
                    <Icon type="md-lock" size="16" color="#808695"/>
                  </span>
                </Input>
              </FormItem>
              <FormItem>
                <Input type="password" size="large" v-model="formItem1.confirmPassword" placeholder="请再次输入密码" required>
                <span slot="prepend">
                    <Icon type="md-lock" size="16" color="#808695"/>
                  </span>
                </Input>
                <div style="text-align: left;">
                  <Checkbox style="margin-right: 0;" v-model="formItem1.agreement">我已阅读并同意</Checkbox><a href="javascript:void(0)" @click="goUserAgreement">《用户协议和隐私条款》</a>
                </div>
              </FormItem>
              <FormItem>
                <Button type="primary" long @click="handleSubmit1()">注册</Button>
              </FormItem>

              <FormItem>
                <Button type="text" long @click="toLogin">已有账号，立即登录</Button>
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'register',
    data: function(){
      return {
        resetType:'phone',
        updateCount:0,
        formItem: {
          mobile: '',
          username: '',
          verifyCode:'',
          password:'',
          confirmPassword:'',
          captcha:'',
          captchaKey:'',
          agreement:false
        },
        formItem1:{
          name:'',
          email:'',
          password:'',
          confirmPassword:'',
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
        if(from.path.includes('register')){
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
    mounted(){
      this.change_code();
    },
    methods: {
      handleSubmit (name) {
        if(!this.formItem.username){
          this.$Message.error('请设置用户昵称');return;
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
        if(!this.formItem.password){
          this.$Message.error('请设置登录密码');return;
        }
        if(!this.formItem.confirmPassword){
          this.$Message.error('请再次输入登录密码');return;
        }
        if(this.formItem.password != this.formItem.confirmPassword){
          this.$Message.error('两次输入密码不一致');return;
        }
        if(!this.formItem.agreement){
          this.$Message.error('请阅读并同意《用户协议和隐私条款》');return;
        }
        if(!this.$common.validateUserName(this.formItem.username)){
          this.$Message.error('用户昵称不能包含特殊字符');return;
        }
        var params = {};
        params.name = this.formItem.username;
        params.mobile = this.formItem.mobile;
        params.verifyCode = this.formItem.verifyCode;
        params.password = this.formItem.password;
        params.confirmPassword = this.formItem.confirmPassword;
        this.$post('auth/phoneRegister', params).then((response) =>{
          if(response.data.success){
            this.$common.clearCookies();
            this.$cookie.set("userId",response.data.data.id,{expires:30});
            this.$cookie.set('accessToken', response.data.data.accessToken,{expires:30});
            this.$cookie.set('refreshToken', response.data.data.refreshToken,{expires:30});
            this.updateCount = 0;
            this.$router.push({path:'/register_success'});
          }else{
            this.$Message.error(response.data.message);
            this.change_code();
          }
        });
      },
      handleSubmit1 () {
        if(!this.formItem1.name){
          this.$Message.error('请设置用户昵称');return;
        }
        if(!this.formItem1.email){
          this.$Message.error('请输入邮箱');return;
        }
        if(!this.formItem1.password){
          this.$Message.error('请设置登录密码');return;
        }
        if (this.formItem1.password.length < 6 || this.formItem1.password.length > 20) {
          this.$Message.error('请设置6至20位登录密码');return;
        }
        if(!this.formItem1.confirmPassword){
          this.$Message.error('请再次输入登录密码');return;
        }
        if(this.formItem1.password != this.formItem1.confirmPassword){
          this.$Message.error('两次输入密码不一致');return;
        }
        if(!this.$common.validateUserName(this.formItem1.name)){
          this.$Message.error('用户昵称不能包含特殊字符');return;
        }
        if(!this.$common.validateEmail(this.formItem1.email)){
          this.$Message.error('请输入正确的邮箱号码');return;
        }
        if(!this.formItem1.agreement){
          this.$Message.error('请阅读并同意《用户协议和隐私条款》');return;
        }
        this.$post('auth/register', this.formItem1).then((response) =>{
          if(response.data.success){
            this.updateCount = 0;
            this.$router.push({path:'/register_success'});
          }else{
            this.$Message.error(response.data.message);
          }
        });
      },
      toLogin(){
        this.$router.push({path:'/login'});
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
      checkCode(){//检查验证码
        return new Promise((resolve,reject) => {
          this.$get('/captcha/verity', {
            captchaKey: this.captchakey,
            captcha: this.formItem.captcha
          }).then((response) =>{
            resolve(response);
          }).catch((err) =>{
            reject(err);
          });
        });
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
      sendMsg(){
        this.$post('sendSms/send', {
          captcha: this.formItem.captcha,
          captchaKey: this.captchakey,
          mobile: this.formItem.mobile,
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
      tabClick(tabName){
        this.resetType = tabName;
        this.updateCount = 0;
      },
    },
    computed:{
      code_img(){
        var base64 = this.$store.state.action.code_res;
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(base64).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      },
      captchakey(){
        return this.$store.state.action.captchakey;
      },
      checke_coderes(){
        return this.$store.state.action.checke_coderes;
      }
    },
    watch:{
      check_code_res:{
        handler(curr){
          if(curr.success){

          }else{
            this.$Message.error('图形验证码输入错误,请重新填写');
          }
        },
        deep:true
      }
    }
  }
</script>
<style>
  #register .ivu-tabs-nav-prev,#register .ivu-tabs-nav-next{display: none;}
  #register .imageCode .ivu-input-group-append{padding:0 !important;}
  #register .ivu-tabs-nav .ivu-tabs-tab {width: 193px;margin-right: 0;}
</style>
<style scoped>
  @import './login.css';
</style>

<template>
  <div id="reset_password" class="login-wrap">
    <div class="ms-login" style="top: 20%;">
      <div class="ms-title">
        <span>找回密码</span>
      </div>

      <div style="text-align: center;">
        <Tabs :value="resetType" @on-click="tabClick">
          <TabPane label="通过手机找回密码" icon="md-phone-portrait" name="phone">
            <Form ref="formValidate" v-show="resetType == 'phone'">
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
              <FormItem prop="password">
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
                <Input type="password" size="large" v-model="formItem.newPassword" placeholder="设置6至20位登录密码" required>
                  <span slot="prepend">
                    <Icon type="md-lock" size="16" color="#808695"/>
                  </span>
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input type="password" size="large" v-model="formItem.confirmPassword" placeholder="请再次输入密码" required>
                  <span slot="prepend">
                    <Icon type="md-lock" size="16" color="#808695"/>
                  </span>
                </Input>
              </FormItem>
              <FormItem>
                <Button type="primary" long :loading="loadingSubmit" @click="handleSubmit('formValidate')">提交</Button>
              </FormItem>
              <FormItem>
                <Button type="text" long @click="goback">返回</Button>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane label="通过邮箱找回密码" icon="ios-mail" name="mobile">
            <Form ref="formValidate" v-show="resetType == 'mobile'">
              <FormItem>
                <Input size="large" v-model="formItem1.email" placeholder="请输入注册邮箱" required>
                  <span slot="prepend">
                    <Icon type="md-mail" size="16" color="#808695"/>
                  </span>
                </Input>
              </FormItem>
              <FormItem class="imageCode">
                <Input size="large" v-model="formItem1.captcha" placeholder="请输入图片中的字符" required>
                  <span slot="prepend">
                    <Icon type="md-keypad" size="16" color="#808695"/>
                  </span>
                  <span slot="append" style="height: 32px;width: 92px;display: block;">
                    <img :src="code_img" title="看不清，换一张" style="height: 32px;cursor: pointer;" @click="change_code">
                  </span>
                </Input>
              </FormItem>
              <FormItem>
                <Button type="primary" long :loading="loadingSubmit" @click="handleSubmit1()">提交</Button>
              </FormItem>
              <FormItem>
                <Button type="text" long @click="goback">返回</Button>
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
      </div>






    </div>
  </div>
</template>

<script>

  export default {
    name: 'reset_password',
    data: function(){
      return {
        resetType:'phone',
        formItem: {
          mobile: '',
          captcha:'',
          verifyCode: '',
          newPassword:'',
          confirmPassword:''
        },
        formItem1:{
          email:'',
          captcha:''
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
      tabClick(tabName){
        this.resetType = tabName;
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
          sendType:'reset'
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
        if(!this.formItem.newPassword){
          this.$Message.error('请输入新密码');return;
        }
        if (this.formItem.newPassword.length < 6 || this.formItem.newPassword.length > 20) {
          this.$Message.error('请设置6至20位登录密码');return;
        }
        if(!this.formItem.confirmPassword){
          this.$Message.error('请再次确认密码');return;
        }
        if(this.formItem.newPassword != this.formItem.confirmPassword){
          this.$Message.error('两次密码输入不一致');return;
        }
        this.loadingSubmit = true;
        var params = {};
        params.mobile = this.formItem.mobile;
        params.verifyCode = this.formItem.verifyCode;
        params.newPassword = this.formItem.newPassword;
        params.confirmPassword = this.formItem.confirmPassword;
        this.$post('auth/resetPassword', params).then((response) =>{
          this.loadingSubmit = false;
          if(response.data.success){
            this.$router.push({path:'/reset_password_success'});
          }else{
            this.$Message.error(response.data.message);
            this.change_code();
          }
        });
      },
      handleSubmit1(){
        if(!this.formItem1.email){
          this.$Message.error("邮箱不能为空");
          return;
        }
        if(!this.formItem1.captcha){
          this.$Message.error("验证码不能为空");
          return;
        }
        if (!this.$common.validateEmail(this.formItem1.email)) {
          this.$Message.error("请输入正确的邮箱号码");
          return;
        }
        this.formItem1.captchaKey = this.captchakey;
        this.loadingSubmit = true;
        this.$post('auth/forgetPassword', this.formItem1).then((response) =>{
          this.loadingSubmit = false;
          if(response.data.success){
            this.$router.push({path:'/reset_tips'});
          }else{
            this.$Message.error(response.data.message);
            this.change_code();
          }
        });
      },
      change_code(){//获取验证码
        this.$store.dispatch('get_code');
      },
      goback(){
        this.$router.back(-1);
      }
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
  #reset_password .ivu-tabs-nav-prev,#register .ivu-tabs-nav-next{display: none;}
  #reset_password .imageCode .ivu-input-group-append{padding:0 !important;}
  #reset_password .ivu-tabs-nav .ivu-tabs-tab {width: 193px;margin-right: 0;}
</style>
<style scoped>
  @import './login.css';
</style>

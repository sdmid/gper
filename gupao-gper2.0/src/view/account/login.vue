<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">
        <span>用户登录</span>
      </div>
      <Form ref="formValidate" :rules="ruleValidate" :model="formItem">
        <FormItem prop="email">
          <Input prefix="ios-contact" size="large" v-model="formItem.email" placeholder="邮箱或手机号码" required v-on:input ="handleOnInput"></Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password"  @keyup.enter="handleSubmit('formValidate')" prefix="md-lock" size="large" v-model="formItem.password" placeholder="密码不少于6位，包含数字和字母" required v-on:input ="handleOnInput" @keyup.enter.native="handleSubmit('formValidate')"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" long @click="handleSubmit('formValidate')" :disabled="disabledSubmit" :loading="loadingSubmit">登录</Button>
        </FormItem>
        <FormItem>
          <Button type="text" class="left" ghost @click="goResetPwd">忘记密码？</Button>
          <Button type="text" class="right" ghost @click="goRegister">新用户注册</Button>
        </FormItem>
        <Divider>其他方式登录</Divider>
        <div class="other">
          <a href="javascript:void(0)" title="QQ登录" class="other-login-link" @click="goLogin2qq">
            <img src="/static/img/icon-gper-qq.svg" class="other-login">
          </a>
          <!--<Tooltip content="暂不支持微信登录" placement="top">
            <a href="javascript:void(0);" class="other-login-link">
              <img src="/static/img/icon-gper-wechat.svg" class="other-login">
            </a>
          </Tooltip>-->
          <a href="javascript:void(0)" title="手机登录" class="other-login-link" @click="goLogin2tel">
            <img src="/static/img/icon-gper-phone.svg" class="other-login">
          </a>
        </div>
      </Form>

    </div>
  </div>
</template>

<script>

  export default {
    name: 'login',
    data: function(){
      return {
        formItem: {
          email: '',
          password: '',
        },
        ruleValidate:{
          email:[
            {required:true,message:'请输入账号，可以是手机号码或邮箱',trigger:'blur'},
          ],
          password:[
            {required:true,message:'密码不少于6位，包含数字和字母',trigger:'blur'}
          ]
        },
        disabledSubmit:true,
        loadingSubmit:false,
        qqLoginHref:'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101485748&redirect_uri=https://gper.gupaoedu.com/qqcallback&state=gper',
      }
    },
    mounted(){
      var email = this.$cookie.get("email");
      var password = this.$cookie.get("password");
      if(email != undefined && password != undefined){
        this.formItem.email = email;
        this.formItem.password = password;
        this.handleOnInput();
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.login();
          }
        });
      },
      handleOnInput (){
        if(this.formItem.email && this.formItem.password){
          this.disabledSubmit = false;
        }else{
          this.disabledSubmit = true;
        }
      },
      goLogin2tel(){
        this.$router.push({path:'/login2tel'});
      },
      goLogin2qq(){
        window.location.href = this.qqLoginHref;
        //this.$router.push({path:'/qqcallback'});
      },
      goRegister(){
        this.$router.push({path:'/register'});
      },
      goResetPwd(){
        this.$router.push({path:'/reset_password'});
      },
      login(){
        this.loadingSubmit = true;
        this.$axios({
          method: 'POST',
          url: 'auth/login',
          params: this.formItem,
        }).then(response => {
          this.loadingSubmit = false;
          if(response.data.success){
            this.$Message.success("登录成功！");
            var loginHref = this.$cookie.get("login_back_href");
            this.$common.clearCookies();
            this.$cookie.set("userId",response.data.data.id,{expires:30});
            this.$cookie.set('accessToken', response.data.data.accessToken,{expires:30});
            this.$cookie.set('refreshToken', response.data.data.refreshToken,{expires:30});
            this.$cookie.set("email",this.formItem.email,{expires:30});
            this.$cookie.set("password",this.formItem.password,{expires:30});
            //console.log(this.$cookie.get('visitorToken'));
            if(loginHref){
              this.$router.push({path:loginHref});
            }else{
              this.$router.push({path:'/index'});
            }
          }else{
            this.$Message.error(response.data.message);
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
</script>

<style scoped>
  @import './login.css';
</style>

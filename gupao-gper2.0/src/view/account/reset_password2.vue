<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">
        <span>设置新密码</span>
      </div>
      <Form ref="formValidate">
        <FormItem>
          <Input type="password" size="large" v-model="formItem.password" placeholder="请输入新密码" required>
            <span slot="prepend">
              <Icon type="md-lock" size="16" color="#808695"/>
            </span>
          </Input>
        </FormItem>
        <FormItem class="imageCode">
          <Input size="large" v-model="formItem.captcha" placeholder="请输入验证码" required>
            <span slot="prepend">
              <Icon type="md-keypad" size="16" color="#808695"/>
            </span>
          <span slot="append" style="height: 32px;width: 92px;display: block;">
              <img :src="code_img" title="看不清，换一张" style="height: 32px;cursor: pointer;" @click="change_code">
            </span>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" long :loading="loadingSubmit" @click="handleSubmit()">提交</Button>
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
          accessToken: this.$route.params.accessToken,
          password: '',
          captcha:'',
          captchaKey:'',
        },
        loadingSubmit:false
      }
    },
    mounted(){
      this.change_code();
    },
    methods: {
      handleSubmit () {
        if(this.formItem.password === ""){
          this.$Message.error("新密码不能为空");
          return;
        }
        if(this.formItem.captcha === ""){
          this.$Message.error("验证码不能为空");
          return;
        }
        this.formItem.captchaKey = this.captchakey;
        this.loadingSubmit = true;
        this.$post('auth/findPassword', this.formItem).then((response) =>{
          this.loadingSubmit = false;
          if(response.data.success){
            this.$router.push({path:'/reset_password_success'});
          }else{
            this.$Message.error(response.data.message);
            this.change_code();
          }
        });
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

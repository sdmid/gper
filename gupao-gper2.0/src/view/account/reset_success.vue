<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">
        <Icon type="ios-checkmark-circle-outline" size="62" color="#63A5F2" style="margin: 94px auto 0;"/><br>
        <span>
          重置密码成功<br>
          <span style="font-size:16px;font-weight:400;line-height:22px;margin: -30px auto 64px;">请妥善保管您的账户信息</span>
        </span>

      </div>
      <Form ref="formValidate">
        <FormItem>
          <Button type="primary" long @click="toLogin">去登录</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'reset_password_success',
    data: function(){
      return {
      }
    },
    methods: {
      toLogin(){
        this.$router.push({path:'/login'});
      }
    },
  }
</script>

<style scoped>
  @import './login.css';
</style>

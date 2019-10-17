<template>

  <div class="person-nav">
    <div class="person-title">修改密码</div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <Row :gutter="16">
        <Col span="4">&nbsp;</Col>
        <Col span="12">
          <Form :label-width="100">
            <FormItem label="原密码">
              <Input v-model="updatePwdByOriginalPwdParams.password" type="password" autocomplete="off"></Input>
            </FormItem>
            <FormItem label="新密码">
              <Input v-model="updatePwdByOriginalPwdParams.newPassword" type="password" autocomplete="off"></Input>
            </FormItem>
            <FormItem label="确认新密码">
              <Input v-model="updatePwdByOriginalPwdParams.confirmPassword" type="password" autocomplete="off"></Input>
            </FormItem>
            <FormItem label="验证码">
              <Input v-model="code_num" @on-blur="check_code" style="width: 120px"/>
              <span class="code-res" v-show="check_code_res">正确</span>
              <span class="code-res" v-show="!check_code_res && check_code_res!=undefined">错误</span>
              <div style="float: right;">
                <img :src="the_code" @click="change_code"/>
                <br>
                <a @click="change_code">看不清?换一张</a>
              </div>
            </FormItem>
            <FormItem>
              <Button long type="primary" @click="subChangePw">确认</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </div>


  </div>

</template>
<script>

  export default {
    data () {
      return {
        code_num:"",
        updatePwdByOriginalPwdParams:{
          id:this.$cookie.get('userId'),
          password:'',
          newPassword:'',
          confirmPassword:'',
        },
      }
    },
    methods: {
      subChangePw(){
        if(this.updatePwdByOriginalPwdParams.password==""){
          this.$Message.warning("请输入原密码");
          return;
        }
        if(this.updatePwdByOriginalPwdParams.newPassword==""){
          this.$Message.warning("新密码不能为空");
          return;
        }
        if (this.updatePwdByOriginalPwdParams.newPassword.length < 6 || this.updatePwdByOriginalPwdParams.newPassword.length > 20) {
          this.$Message.error('请设置6至20位登录密码');
          return;
        }
        if(this.updatePwdByOriginalPwdParams.newPassword!=this.updatePwdByOriginalPwdParams.confirmPassword){
          this.$Message.warning("两次密码不一致");
          return;
        }
        if(this.check_code_res==false||this.check_code_res==undefined){
          this.$Message.warning("验证码不正确");
          return;
        }
        this.$store.state.person.updatePwdByOriginalPwdParams = this.updatePwdByOriginalPwdParams;
        this.$store.dispatch('updatePwdByOriginalPwd');
      },
      check_code(){
        var obj = {};
        obj.captchaKey = this.captchakey;
        obj.captcha = this.code_num;
        this.$store.dispatch('check_code',obj);
      },
      change_code(){//获取验证码
        this.$store.dispatch('get_code');
      }
    },
    mounted () {
      this.$store.dispatch('get_code');
    },
    computed:{
      the_code(){
        var base64 = this.$store.state.action.code_res;
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(base64).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      },
      check_code_res(){
        return this.$store.state.action.checke_coderes.success;
      },
      captchakey(){
        return this.$store.state.action.captchakey;
      },
      updatePwdRes(){
        return this.$store.state.person.updatePwdRes;
      }
    },
    watch:{
      updatePwdRes: {
        handler(cur, old) {
          if(cur.success){
            this.$Message.success(cur.message);
            var _this = this;
            setTimeout(function(){
              var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
              if(keys){
                for(var i = keys.length;i--;){
                  _this.$cookie.remove(keys[i]);
                }
              }
              _this.$router.push({path:'/login'});
            },1000);
          }else{
            this.$Message.error(cur.message);
          }
        },
        deep: true
      },
      check_code_res: {
        handler(cur, old) {
          if(!cur){
            this.change_code();
          }
        },
        deep: true
      },
    }
  }
</script>
<style>form label {font-size: 14px !important;}</style>
<style scoped>
  .person-title{margin-top:4px;font-size:20px;font-weight:400;height:37px;font-family:PingFang SC;color:#000000;border-bottom:1px dotted #e8e8e8;}
  .dotted-line{height: 1px;margin-top:1px;border-bottom:1px dotted #e8e8e8;}
  .person-content{min-height: 300px;margin:21px 0;width:100%;}
  .logo{display: block;margin:0 43px;height: 85px;width: 85px;border-radius: 50%;float:left;}
  .upload{display: inline-block;width: 100%;margin: 9px auto;text-align: center;}
  .demo-upload-list{display:inline-block;width:60px;height:60px;text-align:center;line-height:60px;border:1px solid transparent;border-radius:4px;overflow:hidden;background:#fff;position:relative;box-shadow:0 1px 1px rgba(0,0,0,.2);margin-right:4px}
  .demo-upload-list img{width:100%;height:100%}
  .demo-upload-list-cover{display:none;position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.6)}
  .demo-upload-list:hover .demo-upload-list-cover{display:block}
  .demo-upload-list-cover i{color:#fff;font-size:20px;cursor:pointer;margin:0 2px}
  .preview-box{width:488px;height:400px;border:solid 1px#ddd;}
  .code-res{font-size: 14px;}
</style>

<template>
  <div class="person-nav">
    <div class="person-title">更改手机</div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <Steps :current="step">
        <Step title="验证身份"></Step>
        <Step title="修改手机号码"></Step>
        <Step title="完成更改"></Step>
      </Steps>
      <div class="step-content">
        <div class="bindmsg" v-show="step == 0 && bindState == false">
          <p class="nobound">未绑定手机号码</p>
          <Button class="next-btn" type="primary" @click="step = 1">去绑定</Button>
        </div>
        <div class="bindmsg" v-show="step == 0 && bindState == true">
          <p class="bound-success">当前已绑定号码&nbsp;&nbsp;<span>{{bindmobile}}</span></p>
          <Button class="next-btn" type="primary" @click="nextTipShow = true">更改绑定</Button>
        </div>
        <Modal v-model="nextTipShow" draggable scrollable title="提示" @on-ok="unbound" ok-text="绑定新手机号码">
          <div>更改绑定将解绑原绑定的手机号码，确定去绑定新的手机号码？</div>
        </Modal>
        <div class="" v-show="step == 1">
          <div class="bindform">
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
                <Button type="primary" long :loading="loadingSubmit" @click="handleSubmit()">绑定</Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <div class="bindmsg" v-show="step == 2">
          <p class="bound-success">绑定成功！</p>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'bindphone',
    data () {
      return {
        bindState:null,
        step:0,
        bindmobile:'',
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
        loadingSubmit:false,
        nextTipShow:false
      }
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
          userId: this.$cookie.get('userId'),
          sendType:'bind'
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
      handleSubmit(){
        if(!this.formItem.mobile){
          this.$Message.error('请输入手机号码');return;
        }
        if(!this.formItem.captcha){
          this.$Message.error('请输入图形验证码');return;
        }
        if(!this.formItem.verifyCode){
          this.$Message.error('请输入短信验证码');return;
        }
        var params = {};
        params.id = this.$cookie.get('userId');
        params.mobile = this.formItem.mobile;
        params.verifyCode = this.formItem.verifyCode;
        this.$post('users/bindMobile', params).then((response) =>{
          if(response.data.success){
            this.step = 2;
          }else{
            this.$Message.error(response.data.message);
            this.change_code();
          }
        });
      },
      unbound(){
        this.$post('users/cancelBindMobile', {id:this.$cookie.get('userId')}).then((response) =>{
          if(response.data.success){
            this.step = 1;
            this.$Message.success('已解绑原手机号码');
          }else{
            this.$Message.error(response.data.message);
            this.change_code();
          }
        });
      }
    },
    mounted () {
      this.change_code();
    },
    computed:{
      user(){
        return this.$store.state.login.userResult;
      },
      code_img(){
        var base64 = this.$store.state.action.code_res;
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(base64).reduce((data,byte)=>data + String.fromCharCode(byte),'')
        );
      },
      captchakey(){
        return this.$store.state.action.captchakey;
      }
    },
    watch:{
      user:{
        handler(cur){
          if(cur.success){
            if(cur.data.mobile){
              this.bindState = true;
              var phone = cur.data.mobile;
              this.bindmobile = phone.substr(0, 3) + '****' + phone.substr(7);
            }else{
              this.bindState = false;
            }
          }
        },
        deep:true
      },
    }
  }
</script>
<style>
  .imageCode .ivu-input-group-append{padding:0 !important;}
</style>
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
  .bindmsg{text-align: center;margin: 20px;}
  .nobound{font-size: 20px;}
  .bound-success{font-size: 20px;}
  .bindmsg .next-btn{margin-top:40px;width: 200px;}
  .bindform{width:350px;margin: 0 auto;}
  .step-content{width:700px;margin: 40px 0;}
</style>

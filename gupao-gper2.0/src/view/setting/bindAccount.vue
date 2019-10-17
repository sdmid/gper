<template>

  <div class="person-nav">
    <div class="person-title">账号绑定</div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <Row>
        <Col span="16">
          <div class="row-item">
            <div class="img">
              <img src="/static/img/icon-gper-qq.svg" style="width: 36px;">
            </div>
            <div class="item-right">
              <Tooltip content="点击绑定/解绑腾讯QQ号码" placement="top">
                <i-switch size="large" v-model="QQBindState" :loading="bindLoading" @on-change="bindQQ" >
                  <span slot="open">已绑</span>
                  <span slot="close">未绑</span>
                </i-switch>
              </Tooltip>
            </div>
          </div>
        </Col>
      </Row>
      <!--<Row>
        <Col span="16">
          <div class="row-item">
            <div class="img">
              <img src="/static/img/icon-gper-wechat.svg" style="width: 36px;">
            </div>
            <div class="item-right">
              <Tooltip content="暂不支持绑定微信" placement="top">
                <i-switch size="large" disabled >
                  <span slot="open">已绑</span>
                  <span slot="close">未绑</span>
                </i-switch>
              </Tooltip>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="16">
          <div class="row-item">
            <div class="img">
              <img src="/static/img/icon-gper-weibo.svg" style="width: 36px;">
            </div>
            <div class="item-right">
              <Tooltip content="暂不支持绑定微博" placement="top">
                <i-switch size="large" disabled>
                  <span slot="open">已绑</span>
                  <span slot="close">未绑</span>
                </i-switch>
              </Tooltip>
            </div>
          </div>
        </Col>
      </Row>-->
      <Row>
        <Col span="16" style="margin-top: 26px;">
          <Alert type="warning" show-icon>温馨提示·绑定第三方社交账号后可以直接使用社交账号进行登录</Alert>
        </Col>
      </Row>
    </div>

  </div>

</template>
<script>
  export default {
    data () {
      return {
        QQBindState:false,
        bindLoading:false
      }
    },
    methods: {
      bindQQ(){
        console.log(this.QQBindState);
        this.bindLoading = true;
        if(this.QQBindState == true){//绑定
          window.location.href = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101485748&redirect_uri=https://gper.gupaoedu.com/qqcallback&state=bind';
        }else{
          this.$store.dispatch("release_bind","QQ");
        }
      },
    },
    mounted () {
      this.$store.dispatch("get_buding_mes");
    },
    computed:{
      check_buding() {
        return this.$store.state.person.bind_res;
      },
      unbind_res() {
        return this.$store.state.person.unbind_res;
      },
      bind_res() {
        return this.$store.state.person.bind_act_res;
      }
    },
    watch:{
      check_buding: {//查询绑定
        handler(cur, old) {
          if (cur.success) {
            for(var i in cur.data){
              if(cur.data[i].authType == 'qq'){
                this.QQBindState = true;
              }
            }
          } else {
            this.$Message.error(cur.message);
          }
        },
        deep: true
      },
      bind_res: { //绑定
        handler(cur, old) {
          if (cur.data.success) {
            this.$store.dispatch("get_buding_mes");
          } else {
            this.$Message.error(cur.data.message);
          }
        },
        deep: true
      },
      unbind_res: { //解绑动作的返回结果
        handler(cur, old) {
          this.bindLoading = false;
          if (cur.data.success) {
            this.QQBindState = false;
          } else {
            this.$Message.error(cur.data.message);
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
  .person-content{min-height: 300px;margin:2px 0;width:100%;}
  .logo{display: block;margin:0 43px;height: 85px;width: 85px;border-radius: 50%;float:left;}
  .upload{display: inline-block;width: 100%;margin: 9px auto;text-align: center;}
  .demo-upload-list{display:inline-block;width:60px;height:60px;text-align:center;line-height:60px;border:1px solid transparent;border-radius:4px;overflow:hidden;background:#fff;position:relative;box-shadow:0 1px 1px rgba(0,0,0,.2);margin-right:4px}
  .demo-upload-list img{width:100%;height:100%}
  .demo-upload-list-cover{display:none;position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.6)}
  .demo-upload-list:hover .demo-upload-list-cover{display:block}
  .demo-upload-list-cover i{color:#fff;font-size:20px;cursor:pointer;margin:0 2px}
  .preview-box{width:488px;height:400px;border:solid 1px#ddd;}
  .row-item{border-bottom:1px solid #e8e8e8;height: 74px;}
  .row-item .img{width:36px;margin: 15px 0 16px 1px;float: left;}
  .row-item .item-right{float: right;width:56px;height: 22px;margin:26px 10px;}
</style>

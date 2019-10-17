<template>
    <div id="goodDetail">
      <Row :gutter="24">
        <Col span="18">
          <h1 class="title">{{goodDetailData.name}}</h1>
          <Divider style="margin: 12px 0;"/>
          <div class="clear">
            <div class="left-image">
              <img v-lazy="goodDetailData.logoUrl" :key="goodDetailData.logoUrl" />
            </div>
            <div class="right-info">
              <div class="good-name">{{goodDetailData.name}}</div>
              <Divider style="margin: 8px 0;"/>
              <div><span class="label">花费：</span>
                <span class="value">
                  <img class="icon-image " src="/static/img/icon-gper-gold.svg"/><span class="right-middle">{{goodDetailData.coins}}</span>
                  <i class="icon-gper-vip "></i><span>{{goodDetailData.vipCoins}}</span>
                </span>
              </div>
              <div><span class="label">库存：</span> <span  class="value">{{goodDetailData.remnants}}个</span></div>
              <div><span class="label">热度：</span> <span  class="value">{{goodDetailData.likes}}</span></div>
              <div class="btn-wrapper">
                <span class="change-btn"  v-if="goodDetailData.remnants" @click="show_change_window">兑换</span>
                <span class="change-btn none"  v-else>兑换</span>
                <span class="support-btn" v-if="goodDetailData.hasLiked">已点赞</span>
                <span  @click="support_btn" class="support-btn" v-else>点赞</span>
              </div>
            </div>
          </div>
          <div class="good_descrip_box">
            <p class="god_dis_title">商品详情</p>
            <Divider style="margin: 12px 0;"/>
            <div class="good_des_detail"  v-html="goodDetailData.description" >
            </div>
          </div>
        </Col>
        <Col span="6">
          <shop-right></shop-right>
          <about></about>
        </Col>
      </Row>

      <Modal class="change_cover" v-model="change_window" width="443" :footer-hide="true">
        <div class="change_box">
          <div class="change_title">
            <span><i class="icon-gper-welfare"></i></span>
            <div>兑换商品</div>
          </div>
          <div class="change-tip">
            <span class="tip-icon">!</span> 您要兑换的商品是【{{goodDetailData.name}}】兑换成功后会扣除<span v-if="vipSign">{{goodDetailData.vipCoins}}</span><span v-else>{{goodDetailData.coins}}</span>金币！
          </div>
          <Form ref="formValidate" :model="changeData" :rules="ruleValidate" :label-width="85">
            <FormItem label="您的姓名" prop="realName">
              <Input v-model="changeData.realName" placeholder="请填写您的真实姓名"></Input>
            </FormItem>
            <FormItem label="您的电话" prop="phone">
              <Input v-model="changeData.phone" placeholder="请填写您的联系方式，非常重要"></Input>
            </FormItem>
            <FormItem label="您的邮箱" prop="email">
              <Input v-model="changeData.email" placeholder="请填写您的电子邮箱，非常重要"></Input>
            </FormItem>
            <FormItem label="备注信息" prop="comment">
              <Input v-model="changeData.comment" type="textarea" :rows="6" placeholder="请填写您的收货地址和邮编，非常重要"></Input>
            </FormItem>
          </Form>
        </div>
        <div class="footer">
          <div class="left-notice">请再次确认以上信息是否填写正确！</div>
          <Button class="cancel" @click="close_change_window">取消</Button>
          <Button class="confirm" @click="confirm_change">确定兑换</Button>
        </div>
      </Modal>

      <Modal v-model="changeSuccess" width="443" :footer-hide="true">
        <div class="success-content">
          <Icon class="icon" type="ios-checkmark-circle-outline" />
          <p class="text1">恭喜兑换成功</p>
          <p class="text2">如果信息正确无误，坐等快递送货到家。</p>
          <Button class="closeModel" @click="changeSuccess=false">返回</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
  import Cookies from "js-cookie"
  import shopRight from '@/view/shop/shop_right.vue';
  import about from '@/components/footer/about';
  export default {
    name: 'goodDetail',
    components:{
      shopRight,
      about
    },
    data () {
      const validPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入电话号码'));
        } else {
          const myreg = /^(086|\+86|0)?1[345789][0-9]{9}$/;
          if (myreg.test(value)) {
            callback();
          } else {
            callback(new Error('请填写正确的电话'));
          }
        }
      };
      return {
        change_window:false,
        changeSuccess: false,
        goodListParams: {
          page:"1",
          pageSize:"10"
        },
        goodList: [],
        total: 0,
        id: this.$route.query.id,
        goodDetailData: {},
        changeData:{
          realName:"",
          phone:"",
          email:"",
          comment:"",
          goodsId:"",
          userId:"",
        },
        ruleValidate: {
          realName: [
            { required: true, message: '请填写您的真实姓名', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请填写您的电子邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: validPhone, trigger: 'blur' }
          ],
          comment: [
            { required: true, message: '请填写您的收货地址和邮编', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.getGoodDetail()
    },
    computed: {
      // 判断当前登录用户是不是vip用户
      vipSign () {
        if (this.$store.state.login.userResult.data) {
          return this.$store.state.login.userResult.data.vipSign
        }
        return false
      }
    },
    methods: {
      handleLoginActive(){
        if(this.$cookie.get('isSightseer') === 'true'){
          this.$store.state.login.isSightseer = !this.$store.state.login.isSightseer;
          return false;
        }else if(this.$cookie.get('isActive') !== 'true'){
          this.$store.state.login.isActivated = !this.$store.state.login.isActivated;
          return false;
        }else{
          return true;
        }
      },
      getGoodDetail () {
        let operateUid=Cookies.get("userId");
        this.$get('goods/get', {
          id: this.id,
          operateUid: operateUid
        }).then((res) =>{
          this.goodDetailData = res.data.data;
        });
      },
      show_change_window () {
        if(this.handleLoginActive()){
          this.change_window = true;
        }
      },
      close_change_window(){//关闭兑换弹窗
        this.change_window=false;
        this.$refs.formValidate.resetFields();
      },
      confirm_change () { //确定兑换商品
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            let userId=Cookies.get("userId");
            this.changeData.goodsId=this.goodDetailData.id;
            this.changeData.userId=userId;
            this.$post('exchange/add', this.changeData).then((res) =>{
              if(res.data.success){
                this.change_window=false;
                this.$refs.formValidate.resetFields();
                this.changeSuccess = true;
                this.$store.dispatch("getUserInfo");
              }else{
                this.error(res.data.message);
              }
            });
          }
        });
      },
      support_btn(){//给商品点赞
        if(this.handleLoginActive()){
          let goodsId = this.goodDetailData.id;
          let userId=Cookies.get("userId");
          this.$get('/goods/like', {
            goodsId: goodsId,
            userId: userId
          }).then((res) =>{
            this.goodDetailData.hasLiked = res.data;
          });
        }
      },
      error (nodesc) {
        this.$Message.error(nodesc);
      }
    }
  }
</script>

<style scoped>
  #goodDetail { padding: 0 72px;}
  #goodDetail .title {font-size: 16px}
  .good_descrip_box{overflow:hidden; margin-top: 40px}
  .good_descrip_box .god_dis_title{font-size: 16px}
  .good_des_detail{padding:0 0 60px}
  .clear:after{content: ' ';display: block;clear: both;}
  .left-image {float: left; width: 268px; height: 200px; margin-right: 30px}
  .left-image img {width: 100%; height: 100%; }
  .right-info {float: left; min-width: 240px}
  .right-info .good-name{font-size: 14px; color: #000;padding-right: 50px}
  .right-info .label {display: inline-block;font-size: 14px; width: 65px; line-height: 30px}
  .right-info .value {color: #F9AB10}
  .icon-image {width: 19px; height: 19px;vertical-align: text-bottom; margin-right: 2px;}
  .btn-wrapper {margin-top: 40px;}
  .btn-wrapper .change-btn{background: #F0AE31; padding: 4px 21px; color: #fff; margin-right: 14px; display: inline-block; cursor: pointer}
  .btn-wrapper .change-btn.none {background: #aaa;}
  .btn-wrapper .support-btn{background: #FF6F5B; padding: 4px 21px; color: #fff;display: inline-block; cursor: pointer}
  .right-middle {margin-right: 10px}
  .change_title{text-align: center; margin: 15px 0;font-size: 18px;}
  .change_title span{width: 31px; height: 31px; line-height: 31px; display: inline-block;background: #e39c14;border-radius: 50%}
  .change_title span .icon-gper-welfare{ font-size: 18px; color: #fff}
  .change-tip {background: #fffae6; border:1px solid #ffe48e; line-height: 35px; text-align: center; margin-bottom: 29px}
  .change-tip .tip-icon {background: #e39c14; color: #fff; display: inline-block; width: 14px; height: 14px; border-radius: 50%; line-height: 14px; text-align: center;}
  .footer {margin-top: 10px; margin-bottom: 10px;    text-align: right;}
  .footer .left-notice {float: left; line-height: 32px; color: #E39C14; font-size: 12px;}
  .footer .cancel {border: 1px solid #1890FF}
  .footer .confirm {background: #1890FF; color: #fff}
  .success-content {text-align: center;  margin-top: 15px;}
  .success-content .icon {font-size: 62px; color: #63A5F2}
  .success-content .text1 {font-size: 20px; color: #000}
  .success-content .text2 {font-size: 16px; margin-bottom: 92px;}
  .success-content .closeModel {width: 339px; background: #1890FF; color: #fff; font-size: 16px;}
 </style>

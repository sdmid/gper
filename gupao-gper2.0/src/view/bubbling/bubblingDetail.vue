<template>
  <div id="bubblingDetail">
    <Row :gutter="24">
      <Col span="18">
        <div class="top-bubbling">
          <h1 class="title">冒泡详情：</h1>
        </div>
        <div class="dotted-line"></div>
        <div class="dotted-line"></div>
        <Modal
          v-model="report.show"
          title="举报冒泡"
          @on-ok="report_bb()"
          @on-cancel="close_report">
          <p style="font-weight: bold;">我要举报该冒泡或评论，理由是：</p>
          <RadioGroup v-model="report.reportType" style="margin-top: 10px;">
            <Radio label="营销诈骗"></Radio>
            <Radio label="淫秽色情"></Radio>
            <Radio label="地域攻击"></Radio>
            <Radio label="其它理由"></Radio>
          </RadioGroup>
          <Input v-model="report.description" type="textarea" placeholder="请提供详尽的理由说明" style="margin-top: 10px;"></Input>
        </Modal>
        <div class="auther_box">
          <div class="judge_top">
            <router-link :to="{name:'TAdynamic',params:{userid: bubuDetail.userId}}">
              <Avatar icon="ios-person" class="user-logo" :src="bubuDetail.avatarUrl"/>
              <img v-if="bubuDetail.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
            </router-link>
            <span class="user-name">
              <router-link class="link" :to="{name:'TAdynamic',params:{userid: bubuDetail.userId}}">
                {{bubuDetail.userName}}
              </router-link>
            </span>
            <span class="user-name">{{bubuDetail.createdAt | formatDate}}</span>
          </div>

          <div class="bubb_content" v-html="bubuDetail.content" ></div>

          <div class="judge_bottom_box">
            <!--<span>
              <Icon custom="icon-gper-answer"/>{{bubuDetail.comments > 0 ? bubuDetail.comments + '条':''}}评论
            </span>-->
            <span :style="is_check_bubed ? {color:'#2d8cf0'} : {}" @click="support_bub">
              <Icon custom="icon-gper-dianzan1"/>{{bubuDetail.supports > 0 ? bubuDetail.supports+'个' : ''}}赞
            </span>
            <span style="float: right;" @click="showReport(bubuDetail.id,'App\\Models\\Bubble')">
              <Icon custom="icon-gper-report"/>举报
            </span>
          </div>
        </div>

        <div class="comments-box">
          <span>{{bubuDetail.comments > 0 ? bubuDetail.comments + '条':''}}评论</span>
        </div>

        <div class="people_says_box">
          <div class="one_sayer_box"  v-for="item,index in judge_list">
            <div class="judge_top">
              <router-link :to="{name:'TAdynamic',params:{userid: item.userId}}">
                <Avatar icon="ios-person" class="user-logo" :src="item.avatarUrl"/>
                <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
              </router-link>
              <span class="user-name">
                <router-link class="link" :to="{name:'TAdynamic',params:{userid: item.userId}}">
                  {{item.userName}}
                </router-link>
              </span>
              <span class="user-name">{{item.createdAt | formatDate}}</span>
            </div>
            <div class="say_content_box">
              <div class="onelev_judge_conten" v-html="item.content"></div>
            </div>
            <div class="judge_bottom_box" style="padding-bottom: 5px;">
              <span :style="back_show_hide === index ? {color:'#2d8cf0'} : {}" @click="toggle_make_tow_judge_box(item,index)">
                <Icon custom="icon-gper-answer"/>{{item.replyTotal > 0 ? item.replyTotal + '条':''}}回复
              </span>
              <span style="float: right;" @click="showReport(item.id,'App\\Models\\Comment')">
                <Icon custom="icon-gper-report"/>举报
              </span>
            </div>
            <div class="tow_level_sayer_boxs" v-show="back_show_hide===index">
              <div class="tow_level_sayer_box" v-for="inval in towLeveJudge.list">
                <router-link :to="{name:'TAdynamic',params:{userid: inval.userId}}">
                  <Avatar icon="ios-person" class="user-logo" :src="inval.avatarUrl"/>
                  <img v-if="inval.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
                </router-link>
                <span class="user-name">
                  <router-link class="link" :to="{name:'TAdynamic',params:{userid: inval.userId}}">
                    {{inval.userName}}
                  </router-link>
                </span>
                <span class="user-name">{{inval.createdAt | formatDate}} 回复</span>
                <div class="tow_level_says_words" v-html="inval.content"></div>
              </div>
              <div v-if="towLeveJudge.list && towLeveJudge.total > towLeveJudge.list.length" class="show_more" @click="toggle_make_more_judge_box(item,towLeveJudge.total)">点击加载更多</div>
              <div class="make_tow_level_judge_box" v-show="back_show_hide===index">
                <Input v-model="inner_judge_word" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请写下您的回复"></Input>
                <div class="float-right">
                  <Button @click="toggle_make_tow_judge_box(item,index)">取消</Button>
                  <Button type="primary" @click="sub_say_back(item)">提交回复</Button>
                </div>
              </div>
            </div>
          </div>
          <div class="add_more" v-if="judge_list.length > 0">
            <div v-if="showMore" class="show_more" @click="load_more">
              点击加载更多
            </div>
            <!--<div v-else class="hide_more">
              没有更多数据了
            </div>-->
          </div>
        </div>

        <div class="publish_judge_box">
          <ueditor :editor_id="uid" @getAddUpdateComments="getAddUpdateComments"></ueditor>
        </div>

      </Col>
      <Col span="6">
        <hotopic></hotopic>
        <hotbubbling></hotbubbling>
        <about></about>
      </Col>
    </Row>
  </div>
</template>
<script>
  import ueditor from "../../components/ueditor/bubblingUeditor"
  import about from '@/components/footer/about';
  import hotopic from '@/components/bubbling/hotTopic';
  import hotbubbling from '@/components/bubbling/bubbling_right';
  export default {
    name: 'bubbling',
    components:{
      hotopic,
      hotbubbling,
      ueditor,
      about
    },
    data(){
      return {
        uid:"editor",
        judge_params:{//一级评论的查询
          // sourceId:"",
          sourceType:"App\\Models\\Bubble",
          pageNum:1,
          pageSize: 10
        },
        judge_list:[],
        inner_judge_word:"",//评论回复暂存数据
        bub_atten_id:null,//冒泡关注情况
        is_check_bubed:false,//是否点赞
        back_show_hide:'',
        towLeveJudge:[],
        showMore:true,
        report:{
          show:false,
          sourceId:'',
          sourceType:'',
          reportType:'其它理由',
          description:''
        }
      }
    },
    methods:{
      showReport(supportableId,sourceType){
        this.report.show = true;
        this.report.sourceId = supportableId;
        this.report.sourceType = sourceType;
        this.report.reportType = '其它理由';
        this.report.description = '';
      },
      close_report(){
        this.report.show = false;
      },
      handleLoginActive(){
        if(this.$cookie.get('isSightseer') == 'true'){
          this.$store.state.login.isSightseer = !this.$store.state.login.isSightseer;
          return false;
        }else if(this.$cookie.get('isActive') != 'true'){
          this.$store.state.login.isActivated = !this.$store.state.login.isActivated;
          return false;
        }else{
          return true;
        }
      },
      toPersonPage(id){//跳转到用户
        this.$router.push({path:'/personal/homepage',query:{userId:id}});
      },
      report_bb(){//举报动作
        this.report.show = false;
        if(this.handleLoginActive()){
          this.$store.state.action.reportParam.userId = this.$cookie.get("userId");
          this.$store.state.action.reportParam.sourceId = this.report.sourceId;
          this.$store.state.action.reportParam.sourceType = this.report.sourceType;
          this.$store.state.action.reportParam.reportType = this.report.reportType;
          this.$store.state.action.reportParam.description = this.report.description;
          this.$store.state.action.reportParam.type = "add";
          this.$store.dispatch("reportAction");//冒泡列表
        }
      },
      toggle_make_tow_judge_box(val,index){//显示隐藏回复评论框
        if(this.handleLoginActive()){
          this.back_show_hide = this.back_show_hide === index ? '' : index;
          if(this.back_show_hide === index){
            this.get_towleve_judge(val);//获取二级评论的内容
          }
        }
      },
      toggle_make_more_judge_box(val,total){
        var param={};
        param.pageSize=total;
        param.pageNum=1;
        param.orderType='new';
        param.sourceType="App\\Models\\Comment";
        param.sourceId=val.id;
        //param.toUserId=val.userId;

        this.$post('comment/selectCommentsByPage', param).then((res) =>{
          this.towLeveJudge=res.data.data;
        });
      },
      getAddUpdateComments(val){
        this.judge_params.comment=val;
        this.check_judge();
      },
      load_more(){
        this.judge_params.pageNum = this.judge_params.pageNum + 1;
        this.judge_params.sourceId = this.$route.query.id;
        this.$post('comment/pageQueryByCommentsReply', this.judge_params).then((res) =>{
          if ((this.judge_params.pageNum * this.judge_params.pageSize) < res.data.data.total) {
            this.showMore = true;
          } else {
            this.showMore = false;
          }
          this.judge_list = this.judge_list.concat(res.data.data.list);
        });
      },
      check_judge(){
        this.judge_params.sourceId=this.$route.query.id;
        this.$post('comment/pageQueryByCommentsReply', this.judge_params).then((res) =>{
          if (this.judge_params.pageSize >= res.data.data.total) {
            this.showMore = false;
          } else {
            this.showMore = true;
          }
          this.judge_list=res.data.data.list;
        });
      },
      get_towleve_judge(val){//获取二级评论的内容
        var param={};
        param.pageSize=10;
        param.pageNum=1;
        param.orderType='new';
        param.sourceType="App\\Models\\Comment";
        param.sourceId=val.id;
        //param.toUserId=val.userId;
        this.$post('comment/selectCommentsByPage', param).then((res) =>{
          this.towLeveJudge=res.data.data;
        });
      },
      sub_say_back(obj){//提交评论的回复
        if(this.handleLoginActive()){
          var param = {};
          param.userId = this.$cookie.get("userId");
          param.content = this.inner_judge_word;
          param.sourceId = obj.id;
          param.toUserId = obj.userId;
          param.sourceType = "App\\Models\\Comment";
          if(param.content == ""){
            this.$Message.warning("内容不能为空");
            return;
          }
          this.$post('comment/replyComment',param).then((res)=>{
            if(res.data.success){
              this.get_towleve_judge(obj);//获取二级评论的内容
            }else{
              this.$Message.error("回复失败");
            }
            this.inner_judge_word = '';
          });
        }
      },
      support_bub(){//点赞冒泡，页面最大的那个
        if(this.handleLoginActive()){
          var param = {};
          param.userId = this.$cookie.get("userId");
          param.supportableId = this.bubuDetail.id;
          param.supportableType = "App\\Models\\Bubble";
          this.$post('support/addSupports',param).then((res)=>{
            this.$store.commit('getBubDetail',this.$route.query.id);
          });
          setTimeout(()=>{
            this.check_bub();
          },50);
        }
      },
      check_bub(){//查询是否点赞
        var param={};
        param.userId=this.$cookie.get("userId");
        param.supportableId=this.$route.query.id;
        param.supportableType="App\\Models\\Bubble";
        this.$post('support/selectSupportsBySourceId', param).then((res) =>{
          this.is_check_bubed=res.data.data;
        });

      },
      cancle_atten_action(id){//取消关注作者
        if(this.handleLoginActive()){
          //this.$store.state.action.cancelAttPas.id=this.attenDetailRes.id;
          this.attenParam.userId = this.$cookie.get("userId");
          this.attenParam.sourceId = id;
          this.attenParam.sourceType = 'App\\Models\\User';
          this.$store.dispatch("cancellAtt");
          setTimeout(()=>{
            this.atten_detail()
          },30)
        }
      },
      atten_action(id){//关注的这篇冒泡作者
        if(this.handleLoginActive()){
          this.attenParam.userId = this.$cookie.get("userId");
          this.attenParam.sourceId = id;
          this.attenParam.sourceType = "App\\Models\\User"
          this.$store.dispatch("attenAction");
          setTimeout(()=>{
            this.atten_detail()
          },30);
        }
      },
      atten_detail(){//获取冒泡作者的关注情况
        this.$store.state.action.attenDetal.userId=this.$cookie.get("userId");
        this.$store.state.action.attenDetal.sourceId=this.bubuDetail.userId;
        this.$store.state.action.attenDetal.sourceType="App\\Models\\User"
        this.$store.dispatch("attenDetail");
      },
    },
    mounted(){
      this.check_judge();
      this.check_bub()//查询详情是否点赞
      this.$store.commit('getBubDetail',this.$route.query.id);//冒泡详情
      /*this.$store.dispatch('axGetHotBub');//热门话题
      this.$store.dispatch("brifeHot");//热门冒泡 atten_detail*/
    },
    computed:{
      bubuDetail(){
        return this.$store.state.bubbling.bubDetailData;
      },
      hot_bubbing(){
        var temp_arr=this.$store.state.bubbling.hotBubbling;
        return temp_arr;
      },
      brife_hot(){
        var temp_arr=this.$store.state.bubbling.brifeHots;
        return temp_arr;
      },
      attenDetalRes(){//关注的详情
        return this.$store.state.action.attenDetalRes;
      },
      cancel_res(){//取消关注的结果
        return this.$store.state.action.cancelAttres;
      },
      atten_res(){//关注动作的结果
        return this.$store.state.action.attenRes;
      },
      cancelAttPas(){//取消关注接口参数
        return this.$store.state.action.cancelAttPas;
      },
      attenParam(){
        return this.$store.state.action.attenParam
      },
      commonUserId(){//点击进入冒泡详情 查看是不是同一个userID 从而判断显示不显示关注按钮
        if(this.$route.query.userId == this.$cookie.get('userId')){
          return false
        }else{
          return true
        }

      }
    },
    watch:{
      '$route' (to, from) {
        if(to.path==from.path){
          this.check_judge()
          this.check_bub()//查询详情是否点赞
          this.$store.commit('getBubDetail',this.$route.query.id);//冒泡详情
          this.$store.dispatch('axGetHotBub');//热门话题
          this.$store.dispatch("brifeHot");//热门冒泡 atten_detail
        }
      },
      bubuDetail:{
        handler(cur,old){
          this.atten_detail();//刚进页面 查询是否关注了作者
          this.check_judge();//查询一级评论
        },
        deep:true
      },
      cancel_res:{
        handler(cur,old){
          this.atten_detail();//查询是否关注了作者
        },
        deep:true
      },
      atten_res:{
        handler(cur,old){
          this.atten_detail();//查询是否关注了作者
        },
        deep:true
      },
    }
  }
</script>
<style scoped>
  #bubblingDetail{padding:0 72px}
  .top-bubbling{margin-bottom:14px;height:auto;width:100%;display:block}
  .top-bubbling .title{display:inline-block;font-size:20px;font-weight:400;line-height:33px;color:#000000}
  .dotted-line{height:1px;margin-top:1px;border-bottom:1px dotted #e8e8e8}
  .user-logo{width:28px;height:28px;line-height:28px;display:inline-block}
  .vip-crown{position:absolute;margin-left:-22px;margin-top:-10px;width:20px;-webkit-transform:rotate(9deg);transform:rotate(9deg)}
  .user-name{padding-left:11px;height:17px;font-size:12px;font-weight:400;line-height:17px;display:inline-block}
  .user-name .link{color:#515a6e}
  .user-name .link:hover{color:#2d8cf0}
  .auther_box{padding-top:18px;padding-bottom:12px;width:100%;border-bottom:1px solid rgba(112,112,112,0.15)}
  .bubb_content{color:#000000d9;font-size:14px;padding:6px 0 12px 39px;font-weight:400;line-height:20px;width:100%;overflow-x:auto}
  .bubb_content p{width:100%}
  .bubb_content p img{width:100%}
  .judge_bottom_box{margin-left:39px}
  .judge_bottom_box span{cursor:pointer;margin:3px 10px 3px 0px;font-size:12px;font-weight:400;line-height:17px;height:17px;display:inline-block}
  .judge_bottom_box span:hover{color:#2d8cf0}
  .judge_bottom_box span i{padding-right:5px;padding-bottom:5px}
  .judge_bottom_box .report{height:23px;float:right}
  .comments-box{padding:11px 1px;border-bottom:1px solid rgba(112,112,112,0.15)}
  .comments-box span{display:inline-block;font-size:22px;font-weight:400;line-height:30px;color:#000000}
  .people_says_box{margin:8px 0 18px}
  .one_sayer_box{padding:10px 0 5px;border-bottom:1px solid rgba(112,112,112,0.15)}
  .say_content_box{color:#000000d9;font-size:14px;padding:6px 0 11px 39px;font-weight:400;line-height:20px;width:100%;overflow-x:auto}
  .tow_level_sayer_boxs{margin:10px 0 10px 39px;background:#F9F9F9}
  .tow_level_says_words{margin:10px 0 10px 39px;font-size:14px;font-weight:400;line-height:20px}
  .tow_level_sayer_boxs .tow_level_sayer_box{padding:10px 0 5px;border-bottom:1px solid #70707026}
  .tow_level_sayer_boxs .tow_level_sayer_box:first-child{padding-top:0px}
  .tow_level_sayer_boxs .tow_level_sayer_box:last-child{border-bottom:none}
  .add_more{padding:10px;text-align:center;}
  .show_more{padding:10px;text-align:center;cursor:pointer;}
  .show_more:hover{color:#2b85e4;}
  .make_tow_level_judge_box{margin-top:10px;margin-left:39px;}
  .make_tow_level_judge_box .float-right{text-align:right;margin-top:12px;}
  .publish_judge_box{margin-left:39px;}
</style>

<template>
  <div id="bubbling">
    <Row :gutter="24">
      <Col span="18">
        <div class="top-bubbling">
          <span class="title">推荐话题：</span>
          <span class="hot-item" v-for="item,index in brife_hot" v-if="index < max_length" @click="insertThem(item.name,item.id)">#{{item.name}}#</span>
          <Button v-show="max_length == 3" class="hot-more" size="small" @click="max_length = 100">全部</Button>
          <Button v-show="max_length > 3" class="hot-more" size="small" @click="max_length = 3">收缩</Button>
        </div>
        <ueditor :editor_id="editor" ref="inputEditor"></ueditor>
        <div class="dotted-line"></div>
        <div class="dotted-line"></div>

        <Modal
          v-model="report.show"
          title="举报冒泡"
          @on-ok="report_bb()"
          @on-cancel="close_report">
          <p style="font-weight: bold;">我要举报该冒泡，理由是：</p>
          <RadioGroup v-model="report.reportType" style="margin-top: 10px;">
            <Radio label="营销诈骗"></Radio>
            <Radio label="淫秽色情"></Radio>
            <Radio label="地域攻击"></Radio>
            <Radio label="其它理由"></Radio>
          </RadioGroup>
          <Input v-model="report.description" type="textarea" placeholder="请提供详尽的理由说明" style="margin-top: 10px;"></Input>
        </Modal>

        <div class="judges_box">
          <div class="one_judge" v-for="val,i in bubbing_list">

            <div class="judge_top">
              <router-link :to="{name:'TAdynamic',params:{userid: val.userId}}">
                <Avatar icon="ios-person" class="user-logo" :src="val.avatarUrl"/>
                <img v-if="val.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
              </router-link>
              <span class="user-name">
                <router-link class="link" :to="{name:'TAdynamic',params:{userid: val.userId}}">
                  {{val.userName}}
                </router-link>
              </span>
              <span class="user-name">{{val.createdAt | formatDate}}</span>
            </div>

            <!--<router-link :to="{path:'/bubblingDetail',query:{id:val.id,userId:val.userId}}" >-->

              <div ref="custom" class="judge_content" v-html="val.content" @click="toBubblingDetail(val.id)"></div>
            <!--</router-link>-->

            <div class="judge_bottom_box">
              <span @click="toBubblingDetail(val.id)">
                <Icon custom="icon-gper-answer"/>{{val.comments > 0 ? val.comments + '条':''}}评论
              </span>
              <span :style="val.hasSupport ? {color:'#2d8cf0'} : {}" @click="support_bub(i,val.id,val.hasSupport)">
                <Icon custom="icon-gper-dianzan1"/>{{val.supports > 0 ? val.supports+'个' : ''}}赞
              </span>
              <span style="float: right;" @click="showReport(val.id)">
                <Icon custom="icon-gper-report"/>举报
              </span>
            </div>
          </div>
        </div>

        <div class="answers_page" >
          <Page :total="pageTotal" :pageSize="20" @on-change="handlePageFresh"/>
        </div>
      </Col>
      <Col span="6">
        <hotopic></hotopic>
        <hotbubbling></hotbubbling>
        <about></about>
      </Col>
    </Row>
    <BackTop></BackTop>
  </div>
</template>
<script>
  import Ueditor  from  "@/components/ueditor/ueditor"
  import about from '@/components/footer/about';
  import hotopic from '@/components/bubbling/hotTopic';
  import hotbubbling from '@/components/bubbling/bubbling_right';
  export default {
    name: 'bubbling',
    components:{
      hotopic,
      Ueditor,
      about,
      hotbubbling
    },
    data (){
      return {
        max_length:3,
        editor:"editor",
        bubbing_list:[],//冒泡的列表
        report:{
          show:false,
          supportableId:'',
          reportType:'其它理由',
          description:''
        }
      }
    },
    mounted () {
      this.load_page();
    },
    beforeDestroy(){
      this.judgeParams.pageNum = 1;
    },
    methods: {
      showReport(supportableId){
        this.report.show = true;
        this.report.supportableId = supportableId;
        this.report.reportType = '其它理由';
        this.report.description = '';
      },
      close_report(){
        this.report.show = false;
      },
      handlePageFresh(i){//最新文章的分页
        var temp=this.$route.query.them_word;
        if(temp!=undefined){
          this.$store.state.bubbling.bubb_from_them_pa.tagName=temp;
          this.$store.state.bubbling.bubb_from_them_pa.orderType="new";
          this.$store.state.bubbling.bubb_from_them_pa.pageNum=i;
          this.$store.dispatch("Bubthe");//根据话题查询冒泡列表
        }else{
          this.$store.state.bubbling.judgeParams.pageNum=i;
        }
        this.load_page();
      },
      support_bub(index,surid,hasSupport){//点赞冒泡
        if(this.handleLoginActive()){
          if(!hasSupport){
            this.$store.state.action.supportParam.userId = this.$cookie.get("userId");
            this.$store.state.action.supportParam.supportableId = surid;
            this.$store.state.action.supportParam.supportableType = "App\\Models\\Bubble";
            this.$store.dispatch("supportAction");//点赞结果

            this.bubbing_list[index].hasSupport = true;
            this.bubbing_list[index].supports = this.bubbing_list[index].supports + 1;
          }
        }
      },
      report_bb(){//举报动作
        this.report.show = false;
        if(this.handleLoginActive()){
          this.$store.state.action.reportParam.userId = this.$cookie.get("userId");
          this.$store.state.action.reportParam.sourceId = this.report.supportableId;
          this.$store.state.action.reportParam.sourceType = "App\\Models\\Bubble";
          this.$store.state.action.reportParam.reportType = this.report.reportType;
          this.$store.state.action.reportParam.description = this.report.description;
          this.$store.state.action.reportParam.type = "add";
          this.$store.dispatch("reportAction");//举报新增修改接口
        }
      },
      toBubblingDetail(id){//跳转到冒泡详情页
        if(this.handleLoginActive()){
          //this.$router.push({path:"/bubblingDetail",query:{id:id}});
          const {href} = this.$router.resolve({
            path:"/bubblingDetail",query:{id:id}
          });
          window.open(href, '_blank');
        }
      },
      insertThem(word,id){//插入已有话题
        var tags = this.$store.state.bubbling.makeBubParam.tagsList;
        var has = false;
        for(var i in tags){
          if(tags[i].tagName == word){
            has = true;
            return;
          }
        }
        if(!has){
          this.$refs.inputEditor.insertWord('#'+word+'#');
          var temp = {};
          temp.tagId = id;
          temp.tagName = word;
          this.$store.state.bubbling.makeBubParam.tagsList.push(temp);
        }
      },
      load_page(){
        var temp=this.$route.query.them_word;
        if(temp!=undefined){
          this.$store.state.bubbling.bubb_from_them_pa.tagName=temp;
          this.$store.state.bubbling.bubb_from_them_pa.orderType="new";
          this.$store.dispatch("Bubthe");//根据话题查询冒泡列表
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }else{
          this.$store.dispatch("getJudgeData");//冒泡列表
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
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
      }
    },
    computed:{
      brife_hot(){
        return this.$store.state.bubbling.brifeHots;
      },
      support_res(){//点赞的结果
        return  this.$store.state.action.supportRes;
      },
      csbubbing_list(){//默认的冒泡列表
        var temp_arr=this.$store.state.bubbling.judgeDatas;
        return temp_arr;
      },
      hot_bubbing(){
        var temp_arr=this.$store.state.bubbling.hotBubbling;
        return temp_arr;
      },
      bubbresd(){
        return this.$store.state.bubbling.bubbres;
      },
      them_bubbling(){//根据话题查询的冒泡
        return this.$store.state.bubbling.bubb_them_res;
      },
      brifeHots(){
        return this.$store.state.bubbling.brifeHots;
      },
      judgeParams(){
        return this.$store.state.bubbling.judgeParams;
      },
      bubbingListtotal(){//冒泡列表的总条数
        return this.$store.state.bubbling.bubbingListtotal;
      },
      bubbTotal(){
        return this.$store.state.bubbling.bubbTotal; //话题列表总数
      },
      pageTotal(){//页码情况   根据是页面刚加载进来 和点击热门话题判断 加载不同的页码
        var temp=this.$route.query.them_word;
        if(temp){
          return this.bubbTotal;
        }else{
          return this.bubbingListtotal;
        }
      }
    },
    watch:{
      support_res:{//点赞的结果
        handler(curr,old){

          //this.load_page();
        },
        deep:true
      },
      bubbresd:{
        handler(curr,old){
          if(curr.success){
            this.$Message.success("冒泡成功");
            this.$store.dispatch("getJudgeData");//冒泡列表
          }else{
            this.$Message.error("冒泡失败");
          }
        },
        deep:true
      },
      them_bubbling:{
        handler(curr,old){
          this.bubbing_list=curr;//冒泡列表
        },
        deep:true
      },
      csbubbing_list:{
        handler(curr,old){
          this.bubbing_list=curr;//冒泡列表
        },
        deep:true
      },
      "$route"(to,from){
        this.load_page();
      }
    }
  }
</script>
<style scoped>
  #bubbling {padding: 0 72px;}
  .top-bubbling{margin-bottom: 14px;height: auto;width: 90%;display: block;}
  .top-bubbling .title{display:inline-block;font-size:16px;font-weight:400;line-height:33px;color: #000000;}
  .top-bubbling .hot-item{display:inline-block;padding:6px 18px 5px 0;font-size:14px;font-weight:400;line-height:22px;cursor: pointer;color:rgba(24, 144, 255, 0.85);}
  .top-bubbling .hot-item:hover{color: #2d8cf0;}
  .top-bubbling .hot-more{float: right;position: absolute;right: 20px;top: 5px;color:rgba(24, 144, 255, 0.85);border-color: rgba(24, 144, 255, 0.85);}
  .dotted-line {height: 1px;margin-top: 1px;border-bottom: 1px dotted #e8e8e8;}
  .one_judge{width:100%;padding:13px 0 10px;border-bottom:1px solid rgba(112,112,112,0.15);position:relative;}

  .user-logo{width:28px;height:28px;line-height:28px;display:inline-block}
  .vip-crown{position:absolute;margin-left:-22px;margin-top:-10px;width:20px;-webkit-transform:rotate(9deg);transform:rotate(9deg)}
  .user-name{padding-left:11px;height:17px;font-size:12px;font-weight:400;line-height:17px;display:inline-block;color: rgba(0,0,0,0.6);}
  .user-name .link{color:#515a6e;display: block;}
  .user-name .link:hover{color:#2d8cf0;}

  .judge_content{width:100%;overflow:hidden;height:auto;color:rgba(0, 0, 0, 0.85);font-size:14px;padding:6px 0 11px 39px;line-height:20px}
  .judge_content:hover{color:#2d8cf0;}
  .judge_content p{width:100%}
  .judge_content p img{width:100%}

  .judge_bottom_box{margin-left: 39px;}
  .judge_bottom_box span{cursor: pointer;margin: 3px 10px 3px 0px;font-size:12px;font-weight:400;line-height:17px;height:17px;display: inline-block;}
  .judge_bottom_box span:hover{color:#2d8cf0;}
  .judge_bottom_box span i{padding-right: 5px;padding-bottom: 5px;}

  .judge_bottom_box .report{height: 23px;float: right;}
  .answers_page{margin-top:18px;margin-bottom:16px;text-align:center}
</style>

<template>
  <div class="person-nav">
    <div class="person-title">
      {{hasOwner?'我的':'TA的'}}粉丝
      <!--<ButtonGroup size="small" style="float: right;">
        <Button>关注</Button>
        <Button type="primary">粉丝</Button>
      </ButtonGroup>-->
    </div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <div class="time-item" v-for="list in fansList">
        <div class="timePer" @click="goUser(list.userId)">
          <Avatar icon="ios-person" :src="list.avatarUrl"/>
        </div>
        <span class="time-title">
          <span @click="goUser(list.userId)">{{list.userName}}</span>
        </span>
        <span class="titlePer">
          <span>回答{{list.answers}}</span>
          <span>|</span>
          <span>点赞{{list.supports}}</span>
          <span>|</span>
          <span>关注 {{list.followers}}</span>
        </span>
        <Button type="primary" size="small" v-if="list.hasAttention" @click="cancelatten(list.attenId,list.userId)" >已关注</Button>
        <Button size="small" v-if= "isShow(list.userId, list.hasAttention)" @click="attenact(list.attenId,list.userId)">关注</Button>
      </div>
    </div>
    <div class="answers_page" v-show="fansList.total>0" >
      <Page :total="fansList.total" @on-change="to_page"/>
    </div>
  </div>

</template>
<script>
  import lodash from "lodash";

  export default{
    data(){
      return {
        hasOwner:false,
        params:{
          userid:''
        },
        fansList:[],
        page_num:1,
        fnatt:false,
        attenParam:{
          userId:'',
          sourceId:'',
          sourceType:'',
        }
      }
    },
    mounted(){
      this.params.userid = this.$route.params.userid;
      if(this.$cookie.get("userId") == this.params.userid){
        this.hasOwner = true;
      }
      this.load_page();
    },
    methods:{
      isShow (userId, hasAttention) {
        if (userId.toString() === this.$cookie.get('userId')) {
          return false
        } else if (hasAttention) {
          return false
        }
        return true
      },
      load_page(){//个人主页根据关注类型查询列表接口
        this.fansParam.userId = this.$route.params.userid;
        this.fansParam.sourceType = 'fans';
        this.fansParam.pageNum = this.page_num;
        this.fansParam.pageSiz = 50;
        this.$store.dispatch('fansList');
      },
      to_page(i){
        this.page_num = i;
        this.$store.state.person.fansParam.userId = this.fansParam.userId;
        this.$store.state.person.fansParam.pageNum = i;
        this.$store.dispatch('fansList');
      },
      cancelatten(id,listUserId){//取消关注
        this.attenParam.userId = this.$cookie.get('userId');
        this.attenParam.sourceId = listUserId;
        this.attenParam.sourceType = "App\\Models\\User";
        this.$post('attention/cancelAttentions',this.attenParam);
        setTimeout(()=>{
          this.load_page();
        },50);
      },
      attenact(id,userid){//添加关注
        this.attenParam.userId = this.$cookie.get('userId');
        this.attenParam.sourceId = userid;
        this.attenParam.sourceType="App\\Models\\User";
        this.$post('attention/addAttentions', this.attenParam);
        setTimeout(()=>{
          this.load_page()
        },50);
      },
      check_fans_att(id){
        var temp = {};
        temp.userId = this.$route.params.userid;
        temp.sourceId = id;
        temp.sourceType = "App\\Models\\User";
        this.$post('attention/selectAttentionsBySourceId', temp).then((res) =>{
          this.fnatt=res.data.data;
        });
      },
      goUser(userid){
        this.$router.push({name: 'TAdynamic',params: {userid: userid}});
      }
    },
    computed:{
      re_fansList(){
        return this.$store.state.person.fansList;
      },
      canclAttRes(){//取消关注的动作的返回结果
        return this.$store.state.action.cancelAttres
      },
      attenRes(){//关注动作返回的结果
        return this.$store.state.action.attenRes
      },
      attenDetalRes(){//关注的状态查询
        return this.$store.state.action.attenDetalRes
      },
      fansParam(){
        return this.$store.state.person.fansParam
      }
    },
    watch: {
      '$route'(to, from) {
        this.load_page();
      },
      re_fansList:{
        handler(curr,old){
          this.fansList = lodash.cloneDeep(this.re_fansList) ;
          this.fansList.total = this.re_fansList.total;
          this.fansList.forEach((val)=>{
            this.check_fans_att(val.userId);
          })
        },
        deep:true
      },
      attenRes:{//关注粉丝
        handler(curr,old){
          this.load_page();
        },
        deep:true
      },
      canclAttRes:{//取消关注粉丝
        handler(curr,old){
          this.load_page();
        },
        deep:true
      }
    }
  }

</script>
<style scoped>
  .person-title{margin-top:4px;font-size:20px;font-weight:400;height:37px;font-family:PingFang SC;color:#000000;border-bottom:1px dotted #e8e8e8;}
  .dotted-line{height: 1px;margin-top:1px;border-bottom:1px dotted #e8e8e8;}
  .person-content{min-height: 300px;margin:21px 0;width:100%;display:flex;flex-wrap:wrap;justify-content:flex-start;align-content: flex-start;}
  .time-item{margin: 0 8px 8px 0;padding: 17px 16px 17px 15px;width:293px;height:86px;background-color: #F8F8F8;background-color:#F8F8F8;border-radius:3px;box-shadow:1px 1px #e4e4e4,2px 2px #e4e4e4,3px 3px #e4e4e4;transition:all 0.1s ease-in;}
  .time-item:nth-child(3n+3){margin-right: 0px;}
  .time-item .timePer{height:32px;padding-right: 7px;float: left;cursor: pointer;}
  .time-item .time-title{width:150px;font-size:14px;font-weight:400;line-height:32px;color:#1890FF;display: inline-block;}
  .time-item .time-title span{cursor: pointer;}
  .time-item .titlePer{width:200px;float: left;margin: 8px 0 0 0px;}
  .time-item .titlePer span{padding-right:7px;font-size:12px;font-weight:400;line-height:20px;display: inline-block;}
  .time-item .titlePer span:last-child{padding-right:0px;}

  .answers_page{padding:20px;text-align: center;}
</style>

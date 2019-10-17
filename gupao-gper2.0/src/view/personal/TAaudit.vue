<template>
  <div class="person-nav">
    <div class="person-title">
      <Menu mode="horizontal" theme="light" :active-name="type" @on-select="selectMenu">
        <MenuItem name="question">
          {{questionTotal}}问题
        </MenuItem>
        <MenuItem name="article">
          {{articleTotal}}文章
        </MenuItem>
      </Menu>
    </div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <div class="time-item" v-for="(item,index) in favorites">
        <div class="time-left">
          <span>{{item.supports}}</span>
          <span>通过</span>
        </div>
        <div class="time-left norecommend">
          <span>{{item.oppositions}}</span>
          <span>不通过</span>
        </div>
        <div class="time-right">
          <span v-if="item.hide==1">匿名</span>
          <router-link v-else class="link" :to="{path:'/personal/homepage',query:{userId:item.userId}}">
            {{item.userName}}
          </router-link>
          <span>&nbsp;&nbsp;{{item.createdAt | formatDate}} {{type == 'question' ? '提出问题':'发表文章'}}</span>
        </div>
        <div class="time-right ">
          <span class="hot_title" @click="toDetail(item.id)">{{item.title}}</span>
        </div>
      </div>
      <div class="answers_page" v-show="total > 0" >
        <Page :total="total" @on-change="to_page" />
      </div>
    </div>
  </div>

</template>
<script>

  export default{
    data(){
      return {
        type:'question',
        hasOwner:false,
        params:{
          userid:''
        },
        favorites:[],
        page_num:1,
        total:0,
        articleTotal:0,
        questionTotal:0
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
      selectMenu(name){
        this.type = name;
        this.page_num = 1;
        this.load_page();
      },
      load_page(){
        this.$store.state.person.auditArticleParmas.userId = this.$cookie.get("userId");
        this.$store.state.person.auditArticleParmas.page = this.page_num;
        this.$store.dispatch('getAuditArticle');
        this.$store.state.person.auditQuestionParmas.userId = this.$cookie.get("userId");
        this.$store.state.person.auditQuestionParmas.page = this.page_num;
        this.$store.dispatch('getAuditQuestion');
      },
      to_page(i){
        this.page_num = i;
        this.load_page();
      },
      toDetail(id){
        if(this.type =='article'){
          this.$router.push({path:"/articleContent",query:{id:id,audit:true}});
        }else{
          this.$router.push({name:'AnswerDetail',params:{id: id},query:{audit:true}});
        }
      },
    },
    computed:{
      auditArticle(){
        return this.$store.state.person.auditArticleResult;
      },
      auditQuestion(){
        return this.$store.state.person.auditQuestionResult;
      }
    },
    watch: {
      auditArticle:{
        handler(curr,old){
          this.articleTotal = curr.total+'篇';
          if(this.type =='article'){
            this.total = curr.total;
            this.favorites = curr.list;
          }
        },
        deep:true
      },
      auditQuestion:{
        handler(curr,old){
          this.questionTotal = curr.total+'个';
          if(this.type =='question'){
            this.total = curr.total;
            this.favorites = curr.list;
          }
        },
        deep:true
      }
    }
  }

</script>
<style>
  .person-title .ivu-menu-horizontal {height: 37px;line-height: 37px;}
</style>
<style scoped>
  .person-title{margin-top:4px;font-size:20px;font-weight:400;height:37px;font-family:PingFang SC;color:#000000;border-bottom:1px dotted #e8e8e8;}
  .dotted-line{height: 1px;margin-top:1px;border-bottom:1px dotted #e8e8e8;}
  .person-content{min-height: 300px;margin:21px 0;width:100%;}
  .time-item{padding: 5px 0 5px;border-bottom: 1px dotted #e8e8e8;display: inline-block;width: 100%;}
  .answers_page{padding:20px;text-align: center;}
  .time-left{width:auto;height:auto;padding:5px 14px;border-radius:3px;float:left;display:block;margin:7px;background:#94c4f0bd;color:#FFFFFF}
  .norecommend{background: #e9eff4;color: #515a6e;}
  .time-left span{font-size:10px;font-weight:400;display:block;text-align:center}
  .time-right{float:left;display:block;width:700px;height:23px;padding-left:11px;margin-bottom:7px}
  .time-right span{font-size:12px;line-height:23px;font-weight:400;display:inline-block}
  .time-right .link{color:#515a6e}
  .time-right .link:hover{color:#2d8cf0}
  .time-right .hot_title{font-size:14px;cursor:pointer;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .time-right .hot_title:hover{color:#2d8cf0}
</style>

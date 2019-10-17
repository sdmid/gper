<template>
  <div id="tafavorites" class="person-nav">
    <div class="person-title">
      <Menu mode="horizontal" theme="light" :active-name="type" @on-select="selectMenu">
        <MenuItem name="question">
          收藏的问题
        </MenuItem>
        <MenuItem name="article">
          收藏的文章
        </MenuItem>
      </Menu>
    </div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <div class="time-item" v-for="(item,index) in favorites">
        <div class="time-left">
          <span>{{item.collectionTotal}}</span>
          <span>收藏</span>
        </div>
        <div class="time-right">
          <span v-if="item.hide==1">匿名</span>
          <router-link v-else class="link" :to="{path:'/personal/homepage',query:{userId:item.userId}}">
            {{item.userName}}
          </router-link>
          <span>&nbsp;&nbsp;{{item.createdAt | formatDate}} {{type == 'question' ? '提出问题':'发表文章'}}</span>
        </div>
        <div class="time-right ">
          <span class="hot_title" @click="toDetail(item.questionId,item.articleId)">{{item.title}}</span>
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
    name:"tafavorites",
    data(){
      return {
        type:'question',
        hasOwner:false,
        params:{
          userid:''
        },
        favorites:[],
        page_num:1,
        total:0
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
        this.$store.state.person.collectionQueryParmas.userId = this.$cookie.get("userId");
        this.$store.state.person.collectionQueryParmas.pageNum = this.page_num;
        this.$store.state.person.collectionQueryParmas.sourceType = this.type;
        this.$store.dispatch('selectCollection');
      },
      to_page(i){
        this.page_num = i;
        this.load_page();
      },
      toDetail(questionId,articleId){
        if(this.type =='article'){
          this.$router.push({path:"/articleContent",query:{id:articleId}});
        }else{
          this.$router.push({name:'AnswerDetail',params:{id: questionId}});
        }
      },
    },
    computed:{
      collectionResult(){
        return this.$store.state.person.collectionResult;
      }
    },
    watch: {
      collectionResult:{
        handler(curr){
          this.favorites = curr.list;
          this.total = curr.total;
        },
        deep:true
      }
    }
  }

</script>
<style>
  #tafavorites .person-title .ivu-menu-horizontal {height: 37px;line-height: 37px;}
</style>
<style scoped>
  .person-title{margin-top:4px;font-size:20px;font-weight:400;height:37px;font-family:PingFang SC;color:#000000;border-bottom:1px dotted #e8e8e8;}
  .dotted-line{height: 1px;margin-top:1px;border-bottom:1px dotted #e8e8e8;}
  .person-content{min-height: 300px;margin:21px 0;width:100%;}
  .time-item{padding: 5px 0 5px;border-bottom: 1px dotted #e8e8e8;display: inline-block;width: 100%;}
  .answers_page{padding:20px;text-align: center;}
  .time-left{width:auto;height:auto;padding:5px 14px;border-radius:3px;float:left;display:block;margin:7px;background:#94c4f0bd;color:#FFFFFF}
  .time-left span{font-size:10px;font-weight:400;display:block;text-align:center}
  .time-right{float:left;display:block;width:800px;height:23px;padding-left:11px;margin-bottom:7px}
  .time-right span{font-size:12px;line-height:23px;font-weight:400;display:inline-block}
  .time-right .link{color:#515a6e}
  .time-right .link:hover{color:#2d8cf0}
  .time-right .hot_title{font-size:14px;cursor:pointer;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .time-right .hot_title:hover{color:#2d8cf0}
</style>

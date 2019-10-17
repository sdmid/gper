<template>
  <div class="person-nav">
    <div class="person-title">{{hasOwner?'我的':'TA的'}}回答</div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <div class="time-item" v-for="(item,index) in selectAnswersByPageList">
        <div class="timePer">
          <span class="thumb">{{item.supports}}赞同</span>
          <span>{{item.createdAt | formatDate}}回答了问题</span>
        </div>
        <span class="titlePer" @click="goQuestionDetail(item.questionId)">
          {{item.questionTitle}}
        </span>
        <p v-if="item.content" class="contentPer" v-html="item.content"></p>
      </div>

      <div class="answers_page" v-show="selectAnswersByPageList.total>0" >
        <Page :total="selectAnswersByPageList.total" @on-change="to_page" />
      </div>

    </div>
  </div>

</template>
<script>

  export default{
    data(){
      return {
        hasOwner:false,
        params:{
          userid:''
        },
        selectAnswersByPageParams:{
          userId:'',
          pageNum:'1',
          pageSize:'10',
        },
        selectAnswersByPageList:[]
      }
    },
    mounted(){
      this.params.userid = this.$route.params.userid;
      if(this.$cookie.get("userId") == this.params.userid){
        this.hasOwner = true;
      }
      this.$store.state.answers.selectAnswersByPageParams.pageNum = 1;
      this.$store.state.answers.selectAnswersByPageParams.userId = this.params.userid;
      this.selectAnswersByPage();
    },
    methods:{
      to_page(i){
        this.selectAnswersByPageParams.pageNum = i;
        this.selectAnswersByPage();
      },
      selectAnswersByPage(){
        this.selectAnswersByPageParams.userId = this.params.userid;
        this.$post('answer/selectAnswersByPage', this.selectAnswersByPageParams).then((res) =>{
          this.selectAnswersByPageList=res.data.data.list;
          this.selectAnswersByPageList.total=res.data.data.total;
        });
      },
      goQuestionDetail(id){
        this.$router.push({name:'AnswerDetail',params:{id: id}});
      }
    },
    watch: {
      '$route'(to, from) {
        this.params.userid = this.$route.params.userid;
        this.$store.commit('doingsPageQuery', this.params.userid);
      }
    }
  }

</script>
<style scoped>
  .person-title{margin-top:4px;font-size:20px;font-weight:400;height:37px;font-family:PingFang SC;color:#000000;border-bottom:1px dotted #e8e8e8;}
  .dotted-line{height: 1px;margin-top:1px;border-bottom:1px dotted #e8e8e8;}
  .person-content{min-height: 300px;margin:21px 0;width:100%;}
  .time-item{padding: 5px 0 5px;border-bottom: 1px dotted #e8e8e8;}
  .time-item .timePer{font-size: 14px;}
  .time-item .titlePer{display: inline-block;line-height: 20px;padding-left: 3px;font-size: 16px;color: #000000;font-weight: 500;margin:4px 0;cursor: pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:800px;}
  .time-item .titlePer:hover{color: #2d8cf0;}
  .time-item .contentPer{margin:8px 0 0 4px;font-size:14px;color:#666;padding-left:16px;line-height:20px;display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;}
  .answers_page{padding:20px;text-align: center;}
  .thumb{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;margin-right:8px;margin-bottom:8px;background:#FCF8E3;color:#8A6D3B;border-radius:3px;}
</style>

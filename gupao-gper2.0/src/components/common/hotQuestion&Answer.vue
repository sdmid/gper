<template>
  <div class="hot-question">
    <div class="hot-question-title">
      <span class="hot-logo">
        <img src="/static/img/icon-gper-hot-question.svg">
      </span>
      <span class="hot-name">热门问答</span>
      <!--<a href="javascript:void(0);" class="hot-more">
        更多<Icon type="ios-arrow-forward" size="11"/>
      </a>-->
    </div>
    <div class="hot-info">
      <div class="ques-box" v-for="item,index in hotQuestion.list">
        <div class="question-title">
          <span @click="toAnswerDetail(item)">{{item.title}}</span>
        </div>
        <div class="box-buttom">
          <span>回答{{item.answers}}</span>
          <span v-if="item.status==2&&item.answers>=1" class="resolved">已解决</span>
          <span v-if="item.status==1" class="unsolved">待解决</span>
          <span class="right-box">
            <Icon type="md-eye" size="17" color="rgba(0, 0, 0, 0.48)"/>&nbsp;{{item.views}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {}
    },
    mounted(){
      this.getHotQuestion();//查询热门问答
    },
    methods: {
      getHotQuestion(){
        this.$store.dispatch("selectHotQuestions");
      },
      toAnswerDetail(item){
        this.$router.push({name:'AnswerDetail',params:{id: item.id}});
      }
    },
    computed:{
      hotQuestion(){
        return this.$store.state.main.hotQuestionResult;
      }
    }
  }
</script>
<style scoped>
  .hot-question{display: block;background: rgba(244, 244, 244, 0.5);padding: 13px 17px 6px 14px;}
  .hot-question .hot-question-title{width:100%;height: auto;display: block;}
  .hot-question-title .hot-logo{width:36px;height: 27px;display: inline-block;vertical-align: sub;}
  .hot-question-title .hot-logo img{width:36px;height:27px;}
  .hot-question-title .hot-name{font-size:16px;font-weight:bold;line-height:27px;color:#000000;display:inline-block;vertical-align:super;padding-left:8px;font-family:PingFang SC;}
  .hot-question-title .hot-more{float:right;font-size:12px;font-weight:400;line-height:27px;width: 40px;}
  .hot-question .hot-info{padding-top: 10px;display: block;width: 100%;position: relative;}
  .hot-question .hot-info .ques-box{width: 100%;height: auto;display: inline-block;border-bottom: 1px solid #e8eaec;margin-bottom: 10px;}
  .hot-question .hot-info .ques-box:last-child{border-bottom:none;}
  .ques-box .question-title{width:100%;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;}
  .ques-box .question-title span{font-size:14px;font-weight:500;line-height:17px;color:rgba(0, 0, 0, 0.78);cursor: pointer;font-family:Helvetica Neue;}
  .ques-box .question-title span:hover{color:#2d8cf0;}
  .ques-box .box-buttom{margin:1px 0 13px 1px;width:100%;height:17px;}
  .ques-box .box-buttom span{margin-right:17px;font-size:12px;font-weight:400;line-height:17px;display:block;float:left;color:rgba(0,0,0,0.48);}
  .ques-box .box-buttom span.resolved{font-size:12px;line-height:17px;background:#efefef;color:#51C41A;border-radius:3px;}
  .ques-box .box-buttom span.unsolved{font-size:12px;line-height:17px;background:#efefef;border-radius:3px;}
  .ques-box .box-buttom span.right-box{float: right;padding-right:5px;}
</style>

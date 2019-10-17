<template>
  <div class="person-nav">
    <div class="person-title">最新动态</div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <div class="time-item" v-for="(item,index) in doingsPageQueryData">
        <div class="timePer">
          <span>{{item.createdAt|formatDate}}</span>
          <span>{{item.action|getCoinAction}}</span>
        </div>
        <span class="titlePer" @click="doDifDirect(item.action,item.sourceId)">
          {{item.subject}}
        </span>
        <p v-if="item.content" class="contentPer" v-html="item.content"></p>
      </div>
      <div v-show="doingsPageQueryData.total==0" style="text-align: center; margin-top: 10px;" >暂无动态</div>
      <div class="answers_page" v-show="doingsPageQueryData.total>0" >
        <Page :total="doingsPageQueryData.total" @on-change="change_page" />
      </div>
    </div>
  </div>

</template>
<script>

  export default{
    data(){
      return {
        params:{
          userid:''
        }
      }
    },
    mounted(){
      this.params.userid = this.$route.params.userid;
      this.$store.commit('doingsPageQuery',this.params.userid);
      //this.$store.commit('selectAnswersByPage',this.params.userid);
    },
    computed:{
      doingsPageQueryData(){
        return this.$store.state.person.doingsPageQueryData;
      }
    },
    methods:{
      change_page(i){
        this.$store.state.person.doingsPageQueryParams.page = i;
        this.$store.commit('doingsPageQuery',this.params.userid);
      },
      doDifDirect(action,id){
        switch(action){
          case 'answer':
            //this.$router.push({path:'/answers/detail',query:{id:id}});
            this.$router.push({name:'AnswerDetail',params:{id: id}});
            break;
          case 'append_reward':
            //this.$router.push({path:'/answers/detail',query:{id:id}});
            this.$router.push({name:'AnswerDetail',params:{id: id}});
            break;
          case 'ask':
            //this.$router.push({path:'/answers/detail',query:{id:id}});
            this.$router.push({name:'AnswerDetail',params:{id: id}});
            break;
          case 'create_article':
            this.$router.push({path:'/articleContent',query:{id:id}});
            break;
          case 'follow_question':
            //this.$router.push({path:'/answers/detail',query:{id:id}});
            this.$router.push({name:'AnswerDetail',params:{id: id}});
            break;
          case 'like_goods':
            this.$router.push({path:'/good/detail',query:{id:id}});
        }
      }
    },
    filters:{
      getCoinAction(val){/*answer 回答问题 append_reward 对问题追加悬赏 ask 发起提问 create_article 发表了文章 follow_question 关注了问题*/
        switch(val){
          case 'answer':
            return '回答问题';
          case 'append_reward':
            return '对问题追加悬赏';
          case 'ask':
            return '发起提问';
          case 'create_article':
            return '发表了文章';
          case 'follow_question':
            return '关注了问题';
          case 'like_goods':
            return '喜爱商品'
        }
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
  .time-item{padding: 5px 0 15px;border-bottom: 1px dotted #e8e8e8;}
  .time-item .timePer{font-size: 14px;}
  .time-item .titlePer{display: inline-block;line-height: 20px;padding-left: 3px;font-size: 15px;color: #212121;font-weight: 400;margin:4px 0;cursor: pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:800px;}
  .time-item .titlePer:hover{color: #2d8cf0;}
  .time-item .contentPer{margin:8px 0 0 4px;font-size:14px;color:#666;padding-left:16px;line-height:20px;display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;}
  .answers_page{padding:20px;text-align: center;}
</style>

<template>
  <div class="person-nav">
    <div class="person-title">
      {{hasOwner?'我的':'TA的'}}金币
    </div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <div class="time-item" v-for="(item,index) in pageQueryByCoinsData.list">
        <div class="time-left">
          <span v-if="item.action === 'punish_user'">{{ ' - ' + item.coins}}</span>
          <span v-else>{{item.coins > 0 ? ' + ' + item.coins : item.coins}}</span>
        </div>
        <div class="time-right ">
          <span class="hot_title">{{item.action | getCoinAction}} ·
            <a v-if="item.sourceSubject" class='hover_blue' @click="toArticorAns(item.sourceId,item.action )">
              {{item.sourceSubject}} ·
            </a>
            {{item.createdAt | formatDate}}
          </span>
        </div>
      </div>
      <div class="answers_page" v-show="pageQueryByCoinsData.total > 0" >
        <Page :total="pageQueryByCoinsData.total" @on-change="to_page" />
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
        }
      }
    },
    mounted(){
      this.params.userid = this.$route.params.userid;
      if(this.$cookie.get("userId") == this.params.userid){
        this.hasOwner = true;
      }
      this.$store.state.person.pageQueryByCoinsParams.page = 1;
      this.$store.dispatch('pageQueryByCoins',this.params.userid);
    },
    filters:{
      /*类型（ answer：回答问题 answer_adopted：回答被采纳 append_reward：对问题追加悬赏
  ask：发起提问 create_article：发表了文章 exchange：兑换商品 login：登录 register：注册 reward_user：系统奖励 sign：签到）*/
      getCoinAction(val){
        switch(val){
          case 'answer':
            return '回答问题';
          case 'answer_adopted':
            return '回答被采纳';
          case 'append_reward':
            return '对问题追加悬赏';
          case 'ask':
            return '发起提问';
          case 'create_article':
            return '发表了文章';
          case 'exchange':
            return '兑换商品';
          case 'login':
            return '登陆';
          case  'register':
            return '注册';
          case 'reward_user':
            return '系统奖励';
          case 'sign':
            return '签到';
          case 'exchange_back':
            return '兑换商品失败';
          case 'punish_user':
            return '系统惩罚';
        }
      }
    },
    methods:{
      to_page(i){
        this.$store.state.person.pageQueryByCoinsParams.page = i;
        this.$store.dispatch('pageQueryByCoins',this.params.userid);
      },
      toArticorAns(sourceId,action){
        if(action==='create_article'){
          this.$router.push({path:'/articleContent',query:{id:sourceId}});
        }else if(action==='answer'){
          this.$router.push({name:'AnswerDetail',params:{id: sourceId}});
        }else if(action==='answer_adopted'){
          this.$router.push({name:'AnswerDetail',params:{id: sourceId}});
        }else if(action==='append_reward'){
          this.$router.push({name:'AnswerDetail',params:{id: sourceId}});
        }else if(action==='exchange'){
          this.$router.push({path:'/good/detail',query:{id:sourceId}});
        }else if(action==='ask'){
          this.$router.push({name:'AnswerDetail',params:{id: sourceId}});
        }
      }
    },
    computed:{
      pageQueryByCoinsData(){
        return this.$store.state.person.pageQueryByCoinsData;
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
  .time-left{width:40px;height:auto;padding:1px 5px;border-radius:50px;float:left;display:block;margin:7px;border:1px solid #2d8cf0;color:#2d8cf0;}
  .time-left span{font-size:10px;font-weight:400;display:block;text-align:center}
  .time-right{float:left;display:inline-block;width:800px;height:22px;margin:7px 14px;}
  .time-right span{font-size:12px;line-height:23px;font-weight:400;display:inline-block}
  .time-right .link{color:#515a6e}
  .time-right .link:hover{color:#2d8cf0}
  .time-right .hot_title{font-size:14px;line-height: 22px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .hover_blue{color:#515a6e;}
  .hover_blue:hover{color:#2d8cf0;}
</style>

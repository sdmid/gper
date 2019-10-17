<template>
  <div id="attention">


    <div class="ques-answer">
      <ul>
        <li v-for="item,index in atten.list">
          <div class="question-item">
            <div class="question-content">
              <div class="question-title">
                <a href="javascript:void(0)">
                  <Avatar icon="ios-person" class="user-logo" :src="item.avatarUrl + (item.hide == 1?'66666':'') "/>
                  <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
                </a>
                <span class="user-name">
                  <router-link class="link" :to="{name:'TAdynamic',params:{userid: item.userId}}">
                    {{item.userName}}
                  </router-link>
                </span>
                <span class="user-name">{{item.createdAt | formatDate}}{{item.action | formatAction}}</span>
              </div>
              <div class="question-h1">
                <span @click="toAnswerDetail(item)">{{item.subject}}</span>
              </div>
              <div class="question-h2">
                <span>{{item.content | entityToString}}</span>
              </div>

            </div>
          </div>
        </li>
        <!--<Page v-if="answer.list && answer.list.length > 0" :total="answer.total" :current="answer.pageNum" :pageSize="answer.pageSize" @on-change="handleQuestion" />-->
      </ul>
    </div>

    <div v-if="atten.list && atten.list.length < attentotal" class="show_more" @click="load_more" >点击加载更多</div>
    <div v-else class="hide_more" >没有更多数据了</div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        pageNum:0
      }
    },
    mounted(){
      this.load_more();
    },
    filters:{
      formatAction(val){
        switch(val){
          case 'answer':
            return '回答问题';
          case 'ask':
            return '发起提问';
          case 'create_article':
            return '发布文章';
          case 'follow_question':
            return '回答问题';
        }
      },
      entityToString(entity){//html转换文本
        var div = document.createElement('div');
        div.innerHTML=entity;
        var text = div.innerText||div.textContent;
        return text;
      }
    },
    methods:{
      load_more(){
        this.pageNum++;
        this.$store.state.home.AttentionByPersonalParams.userId=this.$cookie.get("userId");
        this.$store.state.home.AttentionByPersonalParams.pageNum=this.pageNum;
        this.$store.dispatch('AttentionByPersonal');
      },
      toAnswerDetail(item){
        //this.$router.push({name:'AnswerDetail',params:{id: item.sourceId}});
        switch(item.action){
          case 'answer':
            this.$router.push({name:'AnswerDetail',params:{id:item.sourceId}});
            break;
          case 'append_reward':
            this.$router.push({name:'AnswerDetail',params:{id:item.sourceId}});
            break;
          case 'ask':
            this.$router.push({name:'AnswerDetail',params:{id:item.sourceId}});
            break;
          case 'create_article':
            this.$router.push({path:'/articleContent',query:{id:item.sourceId}});
            break;
          case 'follow_question':
            this.$router.push({name:'AnswerDetail',params:{id:item.sourceId}});
            break;
          case 'like_goods':
            this.$router.push({path:'/good/detail',query:{id:item.sourceId}});
        }
      }
    },
    computed:{
      atten(){
        return this.$store.state.home.AttentionByPersonalData;
      },
      attentotal(){
        return this.$store.state.home.AttentionByPersonalData.attentotal;
      },
      vuexPagen(){
        return this.$store.state.home.AttentionByPersonalParams.pageNum;
      }
    },
    watch:{
      vuexPagen:{
        handler(cur,old){
          if(cur==1){
            this.pageNum=1;
          }
        }
      }
    }
  }
</script>
<style scoped>
  .show_more{padding:5px 14px;background-color:#fff;border-radius:15px;font-size:12px;line-height:1.42858;width:160px;margin:70px auto;text-align:center;border:1px solid #337ab7;color:#337ab7;cursor:pointer;}
  .hide_more{    padding:5px 14px;background-color:#fff;border-radius:15px;font-size:12px;line-height:1.42858;width:160px;margin:70px auto;text-align:center;border:1px solid #ccc;color:#337ab7;cursor:pointer;}
  .attention_box{ width:100%; padding-bottom:8px; border-bottom:1px solid #d4d4d4; word-wrap: break-word}
  .attention_title{ margin-top:5px;}
  .attention_source{font-size: 14px;color: #9E9E9E}
  .attention_title button{ width:73px;height:23px; background:none; border:1px solid #337ab7; font-size:15px; color:#337ab7; border-radius: 5px;display: block;}
  .attention_title span{font-weight:500;font-size:18px;line-height:28px;color:#212121;padding: 5px 0;}
  .attention_content{ margin:5px 0; /*font:15px/21px '微软雅黑';*/  color:#747474;display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2; }
  .attention_user{ height:28px; }
  .attention_user span{display: inline-block; font:13px/28px '微软雅黑';}
  .attention_user a span:nth-of-type(1){height:28px;border-radius: 50% }
  .attention_user a span:nth-of-type(1) img{ width:28px; height:28px;vertical-align: middle; border-radius: 14px; overflow: hidden; }
  .attention_user a span:nth-of-type(2){ margin:0 35px 0 10px; color:#666; }
  .attention_user span:nth-of-type(3){margin-right:25px; color:#d4d4d4;}
  .attention_user span:nth-of-type(4){color:#d4d4d4;}
  .attention_user .vip_logo {width: 20px;position: relative;margin-bottom: -2px;margin-right: 10px;}

  .ques-answer{position: relative;}
  .ques-answer ul li{list-style: none;}
  .question-item{display: flex;align-items: center;justify-content: space-between;padding-bottom: 19px;padding-top: 20px;border-bottom: 1px solid #e8eaec;}
  .question-content{display: block;width: 670px;float: right;}
  .answers-left,.answers-right{width:auto;height:auto;padding:5px 14px;border-radius:3px;float: left;display: block;margin: 7px;}
  .ansers-state{background:#94c4f0bd;color:#FFFFFF;}
  .browse-state{background:#e9eff4;}
  .solve-state{background:#B3D882;color:#FFFFFF;}
  .unsolved-state{background:rgba(255,241,231,1);color:#FA541B;}
  .answers-left span{font-size: 10px;font-weight:400;display:block;text-align: center;}
  .answers-right span{font-size: 10px;font-weight:400;display:block;text-align: center;}
  .user-logo{width: 28px;height: 28px;line-height: 28px;display: inline-block;}
  .vip-crown{position: absolute;margin-left: -22px;margin-top: -10px;width: 20px;transform: rotate(9deg);}
  .user-name{padding-left:11px;height:17px;font-size:14px;font-weight:400;line-height:17px;display: inline-block;}
  .user-name .link{color:#515a6e;}
  .user-name .link:hover{color:#2d8cf0;}
  .user-reward-gold{padding-left:5px;width: 17px;height: 17px;display: inline-block;vertical-align: sub;}
  .user-reward-gold img{width: 17px;height: 17px;}
  .user-reward-gold-sum{padding-left:6px;height:17px;font-size:12px;font-weight:400;line-height:17px;color:#F9AB10;display: inline-block;}
  .question-top{    font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#bd8cbb;color:#fff;float:right;}
  .question-h1{margin-top: 4px;height:22px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .question-h1 span{letter-spacing: 1px;font-size:16px;font-weight:500;line-height:22px;color: #000000;cursor: pointer;}
  .question-h1 span:hover{color:#2d8cf0;}
  .question-h2{margin-top: 3px;/*height:20px;*/font-size:14px;font-weight:400;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .quertion-tag{margin-top: 12px;display: flex;width:670px;flex-wrap:wrap;-webkit-box-pack:start;justify-content:flex-start;-webkit-box-align:baseline;align-items:baseline;}
  .quertion-tag span{font-size: 12px;line-height:17px;padding:3px 8px 2px 8px;margin-right:8px;margin-bottom:8px;background:#efefef;border-radius:3px;cursor:pointer;}
  .ivu-spin-fix {min-height:500px;}
  .demo-spin-icon-load{animation: ani-demo-spin 1s linear infinite;}
  .ivu-page{text-align: center;padding-top: 20px;}
  .nodate{color:#cccccc;font-size: 14px;text-align: center;margin: 20px;}
  .nodate span{display: block;color:#cccccc;font-size: 14px;margin:10px;}
</style>

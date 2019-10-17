<template>
  <div class="person-nav">
    <div class="person-title">{{hasOwner?'我的':'TA的'}}提问</div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <div class="ques-answer">
        <ul>
          <li v-if="!answerList || answerList.length == 0" >
            <div class="nodate">
              <Icon type="ios-alert-outline" size="40" color="#cccccc"/>
              <span>没有数据</span>
            </div>
          </li>
          <li v-for="item,index in answerList">
            <div class="question-item">
              <div>
                <div v-if="item.answers==0" class="answers-left unsolved-state">
                  <span>{{item.answers}}</span>
                  <span>未答</span>
                </div>
                <div v-if="item.status==1&&item.answers>=1" class="answers-left ansers-state">
                  <span>{{item.answers}}</span>
                  <span>回答</span>
                </div>
                <div v-if="item.status==2&&item.answers>=1" class="answers-left solve-state">
                  <span>{{item.answers}}</span>
                  <span>解决</span>
                </div>
                <div class="answers-right browse-state">
                  <span>{{item.views}}</span>
                  <span>浏览</span>
                </div>
              </div>
              <div class="question-content">
                <div class="question-title">
                  <a href="javascript:void(0)">
                    <Avatar icon="ios-person" class="user-logo" :src="item.avatarUrl + (item.hide == 1?'66666':'') "/>
                    <img v-if="item.hide == 0 && item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
                  </a>
                  <span class="user-name">
                  {{item.hide == 1 ? '匿名' : ''}}
                  <router-link v-if="item.hide == 0" class="link" :to="{name:'TAdynamic',params:{userid: item.userId}}">
                    {{item.userName}}
                  </router-link>
                </span>
                  <span class="user-name">提出问题 {{item.createdAt.slice(0,16)}}</span>
                  <span class="user-reward-gold" v-if="item.price && item.price > 0">
                  <img src="../../../static/img/icon-gper-gold.svg"/>
                </span>
                  <span class="user-reward-gold-sum" v-if="item.price && item.price > 0">{{item.price}}</span>
                  <span v-if="item.istop == 1" class="question-top">置顶</span>
                  <Tooltip v-if="item.openArea === 'vip'" placement="left" content="VIP内容仅对VIP开放" style="float: right;">
                    <span class="top_vip">VIP</span>
                  </Tooltip>
                </div>
                <div class="question-h1">
                  <span @click="goQuestionDetail(item.id)">{{item.title}}</span>
                </div>
                <div class="question-h2">
                  <span v-html="delHtmlTag(item.description)">{{item.description}}</span>
                </div>
                <div class="quertion-tag" v-if="item.tagsList && item.tagsList.length > 0">
                  <span v-for="tag in item.tagsList">{{tag.name}}</span>
                </div>

              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="answers_page" v-show="answerList.total>0" >
        <Page :total="answerList.total" :pageSize="20" @on-change="to_page" />
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
      this.$store.state.answers.answerParams.pageNum = 1;
      this.$store.state.answers.answerParams.tagIds= '';
      this.$store.dispatch('selectQuestionsByPage',this.params.userid);
    },
    methods:{
      to_page(i){
        this.$store.state.answers.answerParams.pageNum = i;
        this.$store.state.answers.answerParams.tagIds= '';
        this.$store.dispatch('selectQuestionsByPage',this.params.userid);
      },
      fmtSatus (status) {
        if (status === -1) {
          return '不通过';
        } else if (status === 0) {
          return '待审核';
        } else  if (status === 1) {
          return '通过';
        }else  if (status === 2) {
          return '已解决';
        }
      },
      delHtmlTag(str){
        if(str){
          return str.replace(/<[^>]+>/g,"");
        }else{
          return str;
        }
      },
      goQuestionDetail(id){
        this.$router.push({name:'AnswerDetail',params:{id: id}});
      }
    },
    computed:{
      answerList(){
        return this.$store.state.answers.answerList;
      }
    },
    watch: {
      '$route'(to, from) {
        this.params.userid = this.$route.params.userid;
        this.$store.state.answers.answerParams.tagIds= '';
        this.$store.commit('selectQuestionsByPage', this.params.userid);
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
  .time-item .titlePer{display: inline-block;line-height: 20px;padding-left: 3px;font-size: 15px;color: #212121;font-weight: 400;margin:4px 0;cursor: pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:1000px;}
  .time-item .titlePer:hover{color: #2d8cf0;}
  .time-item .contentPer{margin:8px 0 0 4px;font-size:14px;color:#666;padding-left:16px;line-height:20px;}
  .answers_page{padding:20px;text-align: center;}
  .thumb{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;margin-right:8px;margin-bottom:8px;background:#FCF8E3;color:#8A6D3B;border-radius:3px;}
  .ques-answer{position: relative;}
  .ques-answer ul li{list-style: none;}
  .question-item{display: flex;align-items: center;justify-content: space-between;padding-bottom: 19px;padding-top: 20px;border-bottom: 1px solid #e8eaec;}
  .question-content{display: block;width: 743px;float: right;padding-left: 20px;}
  .answers-left,.answers-right{width:auto;height:auto;padding:5px 14px;border-radius:3px;float: left;display: block;margin: 7px;}
  .ansers-state{background:#94c4f0bd;color:#FFFFFF;}
  .browse-state{background:#e9eff4;}
  .solve-state{background:#B3D882;color:#FFFFFF;}
  .unsolved-state{background:rgba(255,241,231,1);color:#FA541B;}
  .answers-left span{font-size: 10px;font-weight:400;display:block;text-align: center;}
  .answers-right span{font-size: 10px;font-weight:400;display:block;text-align: center;}
  .user-logo{width: 28px;height: 28px;line-height: 28px;display: inline-block;}
  .vip-crown{position: absolute;margin-left: -22px;margin-top: -10px;width: 20px;transform: rotate(9deg);}
  .user-name{padding-left:11px;height:17px;font-size:12px;font-weight:400;line-height:17px;display: inline-block;}
  .user-name .link{color:#515a6e;}
  .user-name .link:hover{color:#2d8cf0;}
  .user-reward-gold{padding-left:5px;width: 17px;height: 17px;display: inline-block;vertical-align: sub;}
  .user-reward-gold img{width: 17px;height: 17px;}
  .user-reward-gold-sum{padding-left:6px;height:17px;font-size:12px;font-weight:400;line-height:17px;color:#F9AB10;display: inline-block;}
  .question-top{    font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#bd8cbb;color:#fff;float:right;}
  .top_vip{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#d72a47;border-radius:3px;color:#fff;float:left;margin-right:5px;text-align:center;cursor: pointer;}
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

<template>
  <div class="person-nav">
    <div class="person-title">{{hasOwner?'我的':'TA的'}}文章</div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <!--<Table stripe :columns="columns1" :data="myArticalList"></Table>-->

      <div class="item-cont" v-for="(item,index) in myArticalList" :key="index">
        <div class="left_con">
          <div>
            <span class="article_title" @click="toDetail(item.id)"  :style="item.logo ? {'max-width':'410px'} : {'max-width':'706px'}">{{item.title}}</span>
            <span v-if="item.istop" class="article-label article-top">置顶</span>
            <span class="article-label article-type" v-if="item.articleType">{{item.articleType | getArticleType}}</span>
            <Tooltip v-if="item.openArea === 'vip'" placement="top-start" content="VIP内容仅对VIP开放">
              <span class="article-label top_vip">VIP</span>
            </Tooltip>
          </div>
          <div class="article_description">{{item.summary}}</div>
          <div class="clear info-wrapper">
            <div class="left-info">
              <span @click ="toUserDetail(item.userId)" style="cursor: pointer">
                <Avatar icon="ios-person" :src="item.avatarUrl"/>
                <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
              </span>
              <span class="inline user-name" @click ="toUserDetail(item.userId)">{{item.userName}}</span>
              <span class="inline">{{item.createdAt|formatDate}}</span>
            </div>
            <div class="right-info"><i class="i-icon icon-gper-yueduliang"></i> <span class="right-inline">{{item.views}}阅读</span> <i class="i-icon icon-gper-answer inline"></i> <span  class="right-inline">{{item.comments}}条评论</span></div>
          </div>
        </div>
        <div class="right_con" v-if="item.logo">
          <img  v-lazy="item.logo" :key="item.logo" />
        </div>
      </div>

      <div class="answers_page" v-show="myArticalList.total>0" >
        <Page :total="myArticalList.total" @on-change="to_page" />
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
    filters:{
      getArticleType(type){
        switch(type){
          case 'origina':
            return '原创';
          case 'repost':
            return '转载';
          case 'translated':
            return '翻译';
        }
      }
    },
    mounted(){
      this.params.userid = this.$route.params.userid;
      if(this.$cookie.get("userId") == this.params.userid){
        this.hasOwner = true;
      }
      this.$store.state.person.myArticalParam.pageNum = 1;
      this.$store.state.person.myArticalParam.userId = this.params.userid;
      this.$store.dispatch("myArticList");
    },
    methods:{
      to_page(i){
        this.$store.state.person.myArticalParam.pageNum = i;
        this.$store.state.person.myArticalParam.userId = this.params.userid;
        this.$store.dispatch("myArticList");
      },
      toDetail(id){
        this.$router.push({path:"/articleContent",query:{id:id}});
      }
    },
    computed:{
      myArticalList(){
        return this.$store.state.person.myArticalList;
      }
    },
    watch: {
      '$route'(to, from) {
        this.params.userid = this.$route.params.userid;
        this.$store.state.person.myArticalParam.pageNum = 1;
        this.$store.state.person.myArticalParam.userId = this.params.userid;
        this.$store.commit('myArticList');
      },
      myArticalList:{
        handler(cur,old){
        },
        deep:true
      },
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
  .item-cont{display:flex;border-bottom:1px solid #e8eaec;padding:20px 0 8px 0}
  .item-cont .left_con{flex:1;position:relative}
  .clear:after{content:' ';display:block;clear:both}
  .item-cont .left_con .info-wrapper{position:absolute;width:100%;bottom:0}
  .item-cont .left_con .left-info{float:left;position:relative}
  .item-cont .left_con .left-info .vip-crown{position:absolute;top:-10px;left:13px;margin:0}
  .item-cont .left_con .right-info{float:right}
  .item-cont .left_con .article_title{display: inline-block;font-size:16px;color:rgba(0, 0, 0, 0.85);cursor:pointer;font-weight:bold;font-family:PingFang SC;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align: sub;}
  .item-cont .left_con .article_title:hover{color:#1890FF}
  .item-cont .left_con .user-name{cursor:pointer}
  .item-cont .left_con .user-name:hover{color:#1890FF}
  .article_description{margin-bottom:44px;font-size:14px;margin-top:8px}
  .item-cont .right_con{margin-left:40px}
  .item-cont .right_con img{width: 150px;height: 98px;border-radius: 3px;}
  .info-wrapper .inline{display:inline-block;margin-left:10px}
  .icon-gper-yueduliang{font-size:22px}
  .right-inline{display:inline-block;vertical-align:text-bottom}
  .article-top{background:#bd8cbb;color:#fff;}
  .top_vip{background:#d72a47;color:#fff;text-align:center;cursor: pointer;}
  .article-type{background:#459BF8;color:#fff;}
  .article-label{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;border-radius:3px;vertical-align: text-bottom;margin-right: 5px;}
</style>

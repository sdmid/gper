<template>
  <div>
    &nbsp;
    <div class="header-label">
      <span class="span">标签：</span>
      <div class="header-tags">
        <span class="header-tag-item" v-for="item,index in hotTags" @click="selectTag(item)" :class="{select:answerParams.tagIds === item.id}">{{item.name}}</span>
      </div>
    </div>
    <div class="header-label" style="padding-bottom: 7px;">
      <span class="span">筛选：</span>
      <div class="header-tags">
        <span class="header-tag-item" v-for="item,index in tagsType" @click="selectTagType(item)" :class="{select:answerParams.orderType === item.type}">{{item.value}}</span>
      </div>
    </div>

    <div class="dotted-line"></div>
    <div class="dotted-line"></div>
    <div class="ques-answer">
      <ul>
        <Spin fix v-if="contextLoading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
        <li v-if="!contextLoading && (!answer.list || answer.list.length == 0)" >
          <div class="nodate">
            <Icon type="ios-alert-outline" size="40" color="#cccccc"/>
            <span>没有数据</span>
          </div>
        </li>
        <li v-for="item,index in answer.list">
          <div class="question-item">
            <div>
              <div v-if="item.answers==0" class="answertype answers-left unsolved-state">
                <span>{{item.answers}}</span>
                <span>未答</span>
              </div>
              <div v-if="item.status==1&&item.answers>=1" class="answertype answers-left ansers-state">
                <span>{{item.answers}}</span>
                <span>回答</span>
              </div>
              <div v-if="item.status==2&&item.answers>=1" class="answertype answers-left solve-state">
                <span>{{item.answers}}</span>
                <span>解决</span>
              </div>
              <div class="answertype answers-right browse-state">
                <span>{{item.views}}</span>
                <span>浏览</span>
              </div>
            </div>
            <div class="question-content">
              <div class="question-title">
                <a v-if="item.hide == 1" href="javascript:void(0)">
                  <Avatar icon="ios-person" class="user-logo" :src="item.avatarUrl + new Date().getTime().toString()"/>
                </a>
                <router-link v-if="item.hide == 0" :to="{name:'TAdynamic',params:{userid: item.userId}}">
                  <Avatar icon="ios-person" class="user-logo" :src="item.avatarUrl"/>
                  <img v-if="item.hide == 0 && item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
                </router-link>

                <span class="user-name">
                  {{item.hide == 1 ? '匿名' : ''}}
                  <router-link v-if="item.hide == 0" class="link" :to="{name:'TAdynamic',params:{userid: item.userId}}">
                    {{item.userName}}
                  </router-link>
                </span>
                <span class="user-name">提出问题 {{item.createdAt | formatDate}}</span>
                <span class="user-reward-gold" v-if="item.price && item.price > 0">
                  <img src="../../../static/img/icon-gper-gold.svg"/>
                </span>
                <span class="user-reward-gold-sum" v-if="item.price && item.price > 0">{{item.price}}</span>
                <span v-if="item.istop == 1" class="question-top">置顶</span>
                <Tooltip v-if="item.openArea === 'vip'" placement="top-start" content="VIP内容仅对VIP开放" style="float: right;">
                  <span class="top_vip">VIP</span>
                </Tooltip>
              </div>
              <div class="question-h1">
                <span @click="toAnswerDetail(item)">{{item.title}}</span>
              </div>
              <div class="question-h2">
                <span v-html="delHtmlTag(item.description)">{{item.description}}</span>
              </div>
              <div class="quertion-tag" v-if="item.tagsList && item.tagsList.length > 0">
                <span v-for="tag in item.tagsList" @click="toTagDetail(tag.id)">{{tag.name}}</span>
              </div>

            </div>
          </div>
        </li>
        <Page v-if="answer.list && answer.list.length > 0" :total="answer.total" :current="answer.pageNum" :pageSize="answer.pageSize" @on-change="handleQuestion" />
      </ul>
    </div>
  </div>
</template>
<script>
  import lodash from "lodash";

  export default {
    data(){
      return {
        hotTags:[],
        selectTagId:'',
        tagsType:[{
          value:'最新',
          type:'new'
        },{
          value:'热门',
          type:'hot'
        },{
          value:'悬赏',
          type:'reward'
        },{
          value:'未回答',
          type:'unanswered'
        }],
        selectTagsType:'new',
        contextLoading:false,
        localCategoryId:'',
        categoryList:[]
      }
    },
    mounted(){
      this.$store.state.main.categoryParams.type = 'questions';
      this.$store.dispatch('getHotTags');//查询热门标签
      /*this.$store.state.main.hotQuestionParams.categoryId = '';
      this.$store.state.answers.answerParams.categoryId = '';
      this.$store.state.answers.answerParams.tagIds = '';
      this.$store.state.answers.answerParams.orderType = '';*/
      this.getQuestions();//查询问题列表
    },
    methods: {
      delHtmlTag(str){
        if(str){
          return str.replace(/<[^>]+>/g,"");
        }else{
          return str;
        }
      },
      getQuestions(){
        this.contextLoading = true;
        this.localCategoryId = this.$store.state.main.hotQuestionParams.categoryId;
        this.$store.state.answers.answerParams.categoryId = this.localCategoryId;
        this.$store.state.answers.answerParams.tagIds = this.selectTagId;
        this.$store.state.answers.answerParams.orderType = this.selectTagsType;
        this.$store.dispatch('selectQuestionsByPage');//查询问题列表
      },
      selectTag(item){
        this.selectTagId = item.id;
        this.getQuestions();
      },
      handleQuestion(page){
        this.contextLoading = true;
        this.$store.state.answers.answerParams.pageNum = page;
        this.$store.dispatch('selectQuestionsByPage');
        this.$nextTick(()=> {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        })
      },
      selectTagType(item){
        this.selectTagsType = item.type;
        this.getQuestions();
      },
      toAnswerDetail(item){
        //this.$router.push({name:'AnswerDetail',params:{id: item.id}});

        const {href} = this.$router.resolve({
          name: "AnswerDetail",
          params: {id: item.id}
        });
        window.open(href, '_blank');
      },
      toTagDetail(tagid){
        this.$router.push({name:'tagDetail',params:{tagid:tagid}});
      }
    },
    computed:{
      hotTag(){
        return this.$store.state.main.hotTagResult;
      },
      answer(){
        return this.$store.state.answers.answerResult;
      },
      categoryId(){
        return this.$store.state.main.hotQuestionParams.categoryId;
      },
      answerParams(){
        return this.$store.state.answers.answerParams;
      },
      test(){
        return this.$store.state.answers.test;
      },
      category(){
        return this.$store.state.main.categoryResult;
      },
    },
    watch:{
      category:{
        handler(cur,old){
          if(cur.success){
            this.categoryList = cur.data.list;

            var channel = this.$route.params.channel;
            if(channel){
              for(var i in this.categoryList){
                if(this.categoryList[i].slug == channel){
                  this.$store.state.main.hotQuestionParams.categoryId = this.categoryList[i].id;
                }
              }

              this.getQuestions();
            }
          }
        },
        deep:true
      },
      hotTag:{
        handler(cur,old){
          if(cur.success){
            var tags = lodash.cloneDeep(cur.data.list);
            tags.unshift({name:'全部标签',id:''});
            this.hotTags = tags;
          }
        },
        deep:true
      },
      answer:{
        handler(cur,old){
          this.contextLoading = false;
        },
        deep:true
      },
      categoryId:{
        handler(cur,old){
          //this.localCategoryId = cur;
        },
        deep:true
      },
      answerParams:{
        handler(cur,old){
        },
        deep:true
      },
      "$route"(){
        this.getQuestions();
      }
    }
  }
</script>
<style scoped>
  #newQuestion{width: 690px;margin-left: 11px;}
  .header-label{display: flex;}
  .header-label .span{display:inline-block;width:45px;height:22px;font-size:14px;font-family:PingFang SC;font-weight:400;line-height:22px;color:#000000d9;}
  .header-tags{float: right;display: flex;width: 645px;flex-wrap:wrap;justify-content:flex-start;align-items:baseline;}
  .header-tag-item{line-height: 18px;padding: 3px 8px 2px 9px;margin-right: 14px;margin-bottom: 10px;background:#F4F4F4;border-radius:3px;cursor:pointer;font-size: 12px;font-weight:400;font-family: PingFang SC;color: rgba(0, 0, 0, 0.85);}
  .header-tag-item:hover,.header-tag-item.select{color:#1890FF;background:rgba(24, 144, 255, 0.09);}

  .ques-answer{position: relative;}
  .ques-answer ul li{list-style: none;}
  .question-item{display: flex;align-items: center;justify-content: space-between;padding-bottom: 19px;padding-top: 20px;padding-right: 7px;border-bottom: 1px dotted #70707026;}
  .question-content{float: right;display: block;width: 533px;}
  .answers-left,.answers-right{width:auto;height:auto;padding:5px 14px;border-radius:3px;float: left;display: block;margin: 7px;color: rgba(0, 0, 0, 0.85);}
  .answers-left{margin-left: 0 !important;}
  .answertype  span:first-child{font-size:14px;font-family:Helvetica Neue;font-weight:400;}
  .answertype  span:nth-child(2){font-size:10px;font-family:PingFang SC;font-weight:400;}
  .ansers-state{background:rgba(148,196,240,1);color:#FFFFFF;}
  .browse-state{background:#e9eff4;}
  .solve-state{background:rgba(179,216,130,1);color:#FFFFFF;}
  .unsolved-state{background:rgba(255,241,231,1);color:#FA541B;}
  .answers-left span{font-size: 10px;font-weight:400;display:block;text-align: center;}
  .answers-right span{font-size: 10px;font-weight:400;display:block;text-align: center;}
  .user-logo{width: 28px;height: 28px;line-height: 28px;display: inline-block;}
  .vip-crown{position: absolute;margin-left: -22px;margin-top: -10px;width: 20px;transform: rotate(9deg);}
  .user-name{padding-left:11px;height:17px;font-size:12px;font-weight:400;line-height:17px;display: inline-block;color: #000000cc;font-family:PingFang SC;}
  .user-name .link{color:#515a6e;}
  .user-name .link:hover{color:#2d8cf0;}
  .user-reward-gold{padding-left:5px;width: 17px;height: 17px;display: inline-block;vertical-align: sub;}
  .user-reward-gold img{width: 17px;height: 17px;}
  .user-reward-gold-sum{padding-left:6px;height:17px;font-size:12px;font-weight:400;line-height:17px;color:#F9AB10;display: inline-block;}
  .question-top{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#bd8cbb;color:#fff;float:right;border-radius: 3px}
  .question-h1{margin-top: 4px;height:22px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .question-h1 span{font-size:16px;font-weight:bold;line-height:22px;color: rgba(0, 0, 0, 0.8);cursor: pointer;}
  .question-h1 span:hover{color:#2d8cf0;}
  .question-h2{margin-top: 3px;/*height:20px;*/font-size:14px;font-weight:400;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;    font-family: PingFang SC;    color: rgba(0, 0, 0, 0.85);}
  .quertion-tag{margin-top: 12px;display: flex;flex-wrap:wrap;-webkit-box-pack:start;justify-content:flex-start;-webkit-box-align:baseline;align-items:baseline;}
  .quertion-tag span{font-size: 12px;line-height:17px;padding:3px 8px 2px 8px;margin-right:8px;margin-bottom:8px;background:#F4F4F4;border-radius:3px;cursor:pointer;font-family:PingFang SC;font-weight:400;color: rgba(0, 0, 0, 0.5);}
  .quertion-tag span:hover{color:#2d8cf0;}
  .ivu-spin-fix {min-height:500px;}
  .demo-spin-icon-load{animation: ani-demo-spin 1s linear infinite;}
  .ivu-page{text-align: center;padding-top: 20px;}
  .nodate{color:#cccccc;font-size: 14px;text-align: center;margin: 20px;}
  .nodate span{display: block;color:#cccccc;font-size: 14px;margin:10px;}

  .dotted-line{height: 1px;margin-top:1px;border-bottom:1px dotted #0000002e;}
  .top_vip{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#d72a47;border-radius:3px;color:#fff;float:left;margin-right:5px;text-align:center;cursor: pointer;}
</style>

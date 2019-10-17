<template>
  <div id="tagDetail">
    <Row>
      <Col span="18" style="padding-right: 11px;">
        <div class="tag-title">
          <h1 class="title">标签:{{tagDetails.name}}</h1>
          <span class="description">{{tagDetails.description ? tagDetails.description:'暂无介绍'}}</span>
        </div>
        <div class="header-label">
          筛选：
          <div class="header-tags">
            <span class="header-tag-item" v-for="item,index in tagsType" @click="selectTagType(item)" :class="{select:selectTagsType === item.type}">{{item.value}}</span>
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
                    <Tooltip v-if="item.openArea === 'vip'" placement="top-start" content="VIP内容仅对VIP开放">
                      <span class="top_vip">VIP</span>
                    </Tooltip>
                    <span v-if="item.istop == 1" class="question-top">置顶</span>
                  </div>
                  <div class="question-h1">
                    <span @click="toAnswerDetail(item)">{{item.title}}</span>
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
            <Page v-if="answer.list && answer.list.length > 0" :total="answer.total" :current="answer.pageNum" :pageSize="answer.pageSize" @on-change="handleQuestion" />
          </ul>
        </div>
      </Col>
      <Col span="6" style="padding-left: 13px;">
        <rewardList></rewardList>
        <hotQA></hotQA>
        <about></about>
      </Col>
    </Row>
  </div>
</template>
<script>
  import hotQA from '@/components/common/hotQuestion&Answer';
  import rewardList from '@/components/common/rewardList';
  import about from '@/components/footer/about';
  export default {
    name: "tagDetail",
    components:{
      rewardList,
      hotQA,
      about
    },
    data(){
      return {

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
        selectTagId:'',
        contextLoading:false,
        selectTagsType:'new',
        tagDetails:{}
      }
    },
    mounted(){
      this.selectTagId = this.$route.params.tagid;
      this.getTagDetail();
      this.getQuestions();
    },
    methods:{
      getTagDetail(){
        this.$get('tag/selectTagsById', {id:this.selectTagId}).then((res) =>{
          if(res.data.success){
            this.tagDetails = res.data.data;
          }
        });
      },
      selectTagType(item){
        this.selectTagsType = item.type;
        this.getQuestions();
      },
      getQuestions(){
        this.contextLoading = true;
        this.$store.state.answers.answerParams.tagIds = this.selectTagId;
        this.$store.state.answers.answerParams.orderType = this.selectTagsType;
        this.$store.state.answers.answerParams.categoryId = '';
        this.$store.dispatch('selectQuestionsByPage');//查询问题列表
      },
      delHtmlTag(str){
        if(str){
          return str.replace(/<[^>]+>/g,"");
        }else{
          return str;
        }
      },
      handleQuestion(page){
        this.contextLoading = true;
        this.$store.state.answers.answerParams.pageNum = page;
        this.$store.dispatch('selectQuestionsByPage');
      },
      selectTagType(item){
        this.selectTagsType = item.type;
        this.getQuestions();
      },
      toAnswerDetail(item){
        //this.$router.push({name:'AnswerDetail',params:{id: item.id}});
        const {href} = this.$router.resolve({
          name:'AnswerDetail',params:{id: item.id}
        });
        window.open(href, '_blank');
      }
    },
    computed:{
      answer(){
        return this.$store.state.answers.answerResult;
      }
    },
    watch:{
      answer:{
        handler(cur,old){
          this.contextLoading = false;
        },
        deep:true
      },
    }
  }
</script>
<style scoped>
  #tagDetail{padding:0 72px}
  .tag-title{margin-bottom:14px;height:auto;width:100%;display:block}
  .tag-title .title{display:inline-block;font-size:24px;font-weight:400;line-height:33px;color:#000000}
  .tag-title .description{display:block;font-size:16px;font-weight:400;line-height:22px;padding-top: 2px;}
  .header-label{font-size:14px;font-weight:400;line-height: 22px;display: flex;}
  .header-tags{float: right;display: flex;width: 785px;flex-wrap:wrap;justify-content:flex-start;align-items:baseline;}
  .header-tag-item{font-size:14px;line-height: 18px;padding: 3px 8px 2px 8px;margin-right: 8px;margin-bottom: 8px;background:#efefef;border-radius:3px;cursor:pointer;}
  .header-tag-item:hover,.header-tag-item.select{color:#1890FF;background:#1890ff17;}
  .dotted-line{height: 1px;margin-top:1px;border-bottom:1px dotted #e8e8e8;}
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
  .user-name{padding-left:11px;height:17px;font-size:12px;font-weight:400;line-height:17px;display: inline-block;}
  .user-name .link{color:#515a6e;}
  .user-name .link:hover{color:#2d8cf0;}
  .user-reward-gold{padding-left:5px;width: 17px;height: 17px;display: inline-block;vertical-align: sub;}
  .user-reward-gold img{width: 17px;height: 17px;}
  .user-reward-gold-sum{padding-left:6px;height:17px;font-size:12px;font-weight:400;line-height:17px;color:#F9AB10;display: inline-block;}
  .question-top{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#bd8cbb;color:#fff;vertical-align: baseline;border-radius:3px;margin-right: 5px;}
  .question-h1{margin-top: 4px;height:22px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .question-h1 span{font-size:16px;font-weight:bold;line-height:22px;color:rgba(0,0,0,0.8);cursor:pointer;}
  .question-h1 span:hover{color:#2d8cf0;}
  .question-h2{margin-top:3px;font-size:14px;font-weight:400;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:PingFang SC;color:rgba(0,0,0,0.85);}
  .quertion-tag{margin-top: 12px;display: flex;width:670px;flex-wrap:wrap;-webkit-box-pack:start;justify-content:flex-start;-webkit-box-align:baseline;align-items:baseline;}
  .quertion-tag span{font-size: 12px;line-height:17px;padding:3px 8px 2px 8px;margin-right:8px;margin-bottom:8px;background:#efefef;border-radius:3px;cursor:pointer;}
  .ivu-spin-fix {min-height:500px;}
  .demo-spin-icon-load{animation: ani-demo-spin 1s linear infinite;}
  .ivu-page{text-align: center;padding-top: 20px;}
  .nodate{color:#cccccc;font-size: 14px;text-align: center;margin: 20px;}
  .nodate span{display: block;color:#cccccc;font-size: 14px;margin:10px;}
  .top_vip{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#d72a47;border-radius:3px;color:#fff;vertical-align: baseline;margin-right:5px;text-align:center;cursor: pointer;}
  .article-type{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#459BF8;color:#fff;border-radius:3px;vertical-align: baseline;margin-right: 5px;}
</style>

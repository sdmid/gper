<template>
  <div id="main">
    <Row>
      <Col span="3" style="padding-right: 21px;">
        <div>
          <span class="left-option" v-for="item,index in commonfun" @click="handleCoFun(item)" :class="{select:commonIndex === item.type && categoryIndex == ''}">
              <Icon :custom="'i-icon icon-gper-'+item.icon" size="12" style="margin-right:10px;margin-bottom: 1px;"/>
              {{item.value}}
          </span>
        </div>
        <div>
          <span class="left-inline-title">
            ▪&nbsp;&nbsp;技术频道
          </span>
        </div>
        <div>
          <span class="left-option" v-for="item,index in categoryList" @click="selectChannel(item)" :class="{select:categoryIndex === item.slug}">
              <Icon :custom="'i-icon icon-gper-'+item.slug" size="12" style="margin-right:10px;margin-bottom: 1px;"/>
              {{item.name}}
          </span>
        </div>
      </Col>
      <Col span="15" style="padding-left: 11px; padding-right: 9px;">
        <component v-if="true" :is="commonIndex"></component>
      </Col>
      <Col span="6" style="padding-left: 13px;">
        <div class="user-message" v-show="!isSightseer">
          <div class="user-name">{{userData.name}}&nbsp;</div>
          <div class="user-signin">
            <Button v-if="!userData.hasSign" size="small" shape="circle" @click="todaySign">&nbsp;&nbsp;签到&nbsp;&nbsp;</Button>
            <Button v-else="userData.hasSign" size="small" shape="circle" disabled>&nbsp;&nbsp;已签到&nbsp;&nbsp;</Button>
          </div>
          <div class="user-grade">
            <Icon custom="i-icon icon-gper-mygold" color="#ffffff" size="19"/>
            <span>{{userDataInfo.coins}}</span>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <Icon custom="i-icon icon-gper-grade" color="#ffffff" size="19"/>
            <span>{{userDataInfo.creditsTitle}}</span>
          </div>
        </div>
        <div class="action-side" v-show="!isSightseer">
          <div class="side-item" @click="goPersonalhome('TAfavorites')">
            <Icon custom="i-icon icon-gper-recommend" size="20" />
            <span>我的收藏</span>
          </div>
          <div class="side-item" @click="goPersonalhome('TAfans')">
            <Icon custom="i-icon icon-gper-guanzhu" size="20"/>
            <span>我的粉丝</span>
          </div>
          <div class="side-item" @click="goPersonalhome('TAquestion')">
            <Icon custom="i-icon icon-gper-ask" size="20"/>
            <span>我的提问</span>
          </div>
          <div class="side-item" @click="goPersonalhome('TAanswer')">
            <Icon custom="i-icon icon-gper-answer" size="20"/>
            <span>我的回答</span>
          </div>
        </div>
        <div class="action-side action-side1" style="height: 91px;border-bottom: none;" v-show="!isSightseer">
          <div class="side-item" @click="toQuestion">
            <Avatar custom-icon="icon-gper-ask" class="item-icon"/>
            <span>提问</span>
          </div>
          <div class="side-item" @click="toBubbling">
            <Avatar custom-icon="icon-gper-answer" class="item-icon"/>
            <span>冒泡</span>
          </div>
          <div class="side-item" @click="toArticle">
            <Avatar custom-icon="icon-gper-make-article" class="item-icon"/>
            <span>发文</span>
          </div>
        </div>
        <br>
        <reward></reward>
        <hotQA></hotQA>
        <about></about>
      </Col>
    </Row>
    <BackTop></BackTop>
  </div>
</template>
<script>
  import lodash from "lodash";
  import newest from './newest';
  import recommend from './recommend';
  import concern from './concern';
  import recruitment from './recruitment';
  import reward from '@/components/common/rewardList';
  import hotQA from '@/components/common/hotQuestion&Answer';
  import about from '@/components/footer/about';

  export default {
    name: 'index',
    components:{
      recruitment,
      recommend,
      concern,
      newest,
      reward,
      hotQA,
      about
    },
    data(){
      return {
        commonfun:[{
          value:'最新问答',
          icon:'newest',
          type:'newest'
        },{
          value:'工作推荐',
          icon:'recruitment',
          type:'recruitment'
        },{
          value:'最新推荐',
          icon:'recommend',
          type:'recommend'
        },{
          value:'我的关注',
          icon:'concern',
          type:'concern'
        }],
        commonIndex:'newest',
        categoryList:[],
        categoryIndex:'',
        categoryId:'',
        userData:{},
        userDataInfo:{},
        isSightseer:false
      }
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
        var category = this.$route.params.category;
        this.$store.state.main.categoryParams.type = 'questions';
        this.$store.dispatch('getCategory');//查询技术频道
        if(category){
          this.commonIndex = category;
          this.categoryIndex = '';
          if(category == 'newest'){
            //this.$store.dispatch('getHotTags');//查询热门标签
            this.$store.state.answers.answerParams.tagIds = '';
            this.$store.state.answers.answerParams.categoryId = '';
            this.$store.state.answers.answerParams.orderType = 'new';
            //this.$store.dispatch('selectQuestionsByPage');//查询问题列表
          }
        }
      },
      handleCoFun(item){
        this.$store.state.answers.answerParams.tagIds = '';
        this.$store.state.answers.answerParams.categoryId = '';
        this.$store.state.answers.answerParams.orderType = 'new';
        this.$router.push({path:'/index/'+item.type});
      },
      selectChannel(item){
        /*this.commonIndex = 'newest';
        this.categoryId = item.id;
        this.categoryIndex = item.slug;
        this.$store.state.main.hotQuestionParams.categoryId = item.id;
        this.$store.dispatch("selectTagByCategoryId");//根据分类id查询标签接口
        this.getQuestions(item);*/
        this.$router.push({path:'/index/newest/'+item.slug});
      },
      getQuestions(item){
        this.$store.state.answers.answerParams.tagIds = '';
        this.$store.state.answers.answerParams.orderType = 'new';
        this.$store.state.answers.answerParams.categoryId = item.id;
        //this.$store.dispatch('selectQuestionsByPage');//查询问题列表
      },
      todaySign(){
        if(this.handleLoginActive()){
          this.$store.dispatch("todaySign");
        }
      },
      toQuestion(){
        if(this.handleLoginActive()){
          this.$router.push({path:'/questioning'});
        }
      },
      toBubbling(){
        if(this.handleLoginActive()){
          this.$router.push({path:'/bubbling'});
        }
      },
      toArticle(){
        if(this.handleLoginActive()){
          this.$router.push({path:'/editarticle'});
        }
      },
      handleLoginActive(){
        if(this.$cookie.get('isSightseer') == 'true'){
          this.$store.state.login.isSightseer = !this.$store.state.login.isSightseer;
          return false;
        }else if(this.$cookie.get('isActive') != 'true'){
          this.$store.state.login.isActivated = !this.$store.state.login.isActivated;
          return false;
        }else{
          return true;
        }
      },
      goPersonalhome(path){
        if(this.handleLoginActive()){
          var userid = this.$cookie.get("userId");
          this.$router.push({name:path,params:{userid:userid}});
        }
      }
    },
    computed:{
      user(){
        return this.$store.state.login.userResult;
      },
      category(){
        return this.$store.state.main.categoryResult;
      },
      sign(){
        return this.$store.state.main.signResult;
      }
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
                  this.categoryId = this.categoryList[i].id;
                }
              }
              this.commonIndex = 'newest';
              this.categoryIndex = channel;
              this.$store.state.main.hotQuestionParams.categoryId = this.categoryId;

              this.getQuestions({id:this.categoryId});
            }else{
              this.$store.state.main.hotQuestionParams.categoryId = '';
            }
            this.$store.dispatch("selectTagByCategoryId");//根据分类id查询标签接口


          }
        },
        deep:true
      },
      user:{
        handler(cur,old){
          this.userData = cur.data;
          this.userDataInfo = cur.data.userData;

          this.isSightseer = cur.data.status == -1 ? true : false;
        },
        deep:true
      },
      sign:{
        handler(cur,old){
          if(cur.success){
            this.userData.hasSign = cur.data.hasSign;
          }
        },
        deep:true
      },
      "$route"(){
        this.init();
      }
    }
  }
</script>
<style scoped>
  @import './index.css';
</style>

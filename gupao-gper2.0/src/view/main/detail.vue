<template>
  <div id="answer-detail">
    <Row>
      <Col span="18" style="padding-left: 0px;padding-right: 12px;">
        <div class="answer_title">
          <Tooltip v-if="detailList.openArea === 'vip'" placement="top-start" content="VIP内容仅对VIP开放" style="float: left;">
            <span class="top_vip" style="margin: 4px 6px;">VIP</span>
          </Tooltip>
          <h1>{{detailList.title}}</h1>
        </div>

        <div class="answer_user">
          <router-link v-if="detailList.hide==0" :to="{name:'TAdynamic',params:{userid:detailList.userId}}">
            <Avatar icon="ios-person" class="answer_user_logo" size="small" :src="detailList.avatarUrl"/>
            <img v-if="detailList.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
          </router-link>
          <a v-else href="javascript:void(0)">
            <Avatar icon="ios-person" class="answer_user_logo" size="small" :src="detailList.avatarUrl + new Date().getTime().toString()"/>
          </a>

          <span v-if="detailList.hide==1">{{detailList.hide==1?'匿名':''}}</span>
          <router-link v-if="detailList.hide==0" :to="{name:'TAdynamic',params:{userid:detailList.userId}}">
            <span class="hov_underline">{{detailList.userName}}</span>
          </router-link>

          <span>提问时间&nbsp;{{detailList.createdAt | formatDate}}</span>

          <span v-if="detailList.price>0" class="user-reward-gold"><img src="../../../static/img/icon-gper-gold.svg"/></span>
          <span v-if="detailList.price>0" class="user-reward-gold-sum">{{detailList.price}}</span>
          <span class="right-box">
            <Icon type="ios-eye" size="28" color="#515a6e"/>{{detailList.views}}阅读
          </span>
          <span class="right-box">
            分类：{{detailList.categoryName}}
          </span>
        </div>
        <div v-if="!user.data.vipSign && detailList.openArea === 'vip'" style="text-align: center;">

          <img src="../../../static/img/noVIP.png" style="padding: 50px;">
          <h3>VIP内容仅对VIP开放，你还不是VIP</h3>
          <a href="https://www.gupaoedu.com/course-java.html"  target="_blank" >
            <Button type="primary" style="margin: 20px;">
              立即加入
            </Button>
          </a>
        </div>
        <div v-else>
          <div class="side-widget" v-if="user.data.vipSign && detailList.recommendSign == 0" :class="{ 'atic_brife_fixed': leftSideFixed}">
            <Tooltip placement="top-start">
              <div slot="content">
                <p style="text-align: center;">问题对人有帮助，内容完整</p>
                <p style="text-align: center;">我也想知道答案</p>
              </div>
              <Button type="primary" ghost icon="md-arrow-dropup" style="width: 28px;height: 28px;padding: 5px 7px 6px;margin-bottom: 5px;" @click="support_answer"></Button>
            </Tooltip>
            <Tooltip placement="bottom-start">
              <div slot="content">
                <p style="text-align: center;">问题没有实际价值, 缺少关键</p>
                <p style="text-align: center;">内容,没有改进余地</p>
              </div>
              <Button type="primary" ghost icon="md-arrow-dropdown" style="width: 28px;height: 28px;padding: 5px 7px 6px;" @click="oppositions_answer"></Button>
            </Tooltip>
          </div>

          <div v-if="detailList.editorType =='ueditor'" class="answer-content" v-html="detailList.description"></div>
          <div v-if="detailList.editorType =='markdown'" v-highlight class="answer-content detail-markdown-body" v-html="detailList.description"></div>
        </div>
        <div class="answer-tags" v-show="detailList.tagsList && detailList.tagsList.length > 0 ">
          <span v-for="inval in detailList.tagsList" @click="toTagDetail(inval.id)">{{inval.name}}</span>
        </div>
        <div class="answer-operation" v-if="detailList.openArea !== 'vip' || (user.data.vipSign && detailList.openArea === 'vip')" id="artic_bottom_box">
          <!--<span><Icon custom="icon-gper-huida" />回答</span>-->
          <span @click="getCommentDetailMore(detailList.id)"><Icon custom="icon-gper-answer" />{{commentDataTotal>0?commentDataTotal+'条':''}}评论</span>
          <span v-if="colectDetalres" style="color: #2d8cf0;" @click="collectBtn"><Icon custom="icon-gper-yiguanzhu" />已收藏</span>
          <span v-if="!colectDetalres" @click="collectBtn"><Icon custom="icon-gper-recommend" />收藏</span>

          <span v-if="attenDetalRes" @click="attenBtn" style="color: #2d8cf0;" ><Icon custom="icon-gper-yiguanzhu1" />已关注</span>
          <span v-if="!attenDetalRes" @click="attenBtn"><Icon custom="icon-gper-guanzhu" />关注</span>

          <router-link v-if="is_or_author" style="color:#333 ;" :to="{path:'/questioning',query:{id:detailList.id}}" >
            <span><Icon custom="icon-gper-bianji1"/>编辑</span>
          </router-link>

        </div>
        <div class="answer-comment" v-show="showCom"><!--问题评论-->
          <div class="reply-item comment-item" :class="index == commentDataBody.list.length-1 ?'bottom-none':''" v-for="item,index in commentDataBody.list">
            <div class="answer_user">
              <router-link :to="{name:'TAdynamic',params:{userid:item.userId}}">
                <Avatar icon="ios-person" class="answer_user_logo" size="small" :src="item.avatarUrl"/>
                <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
              </router-link>
              <router-link :to="{name:'TAdynamic',params:{userid:item.userId}}">
                <span>{{item.userName}}</span>
              </router-link>
              <span>{{item.createdAt|formatDate}}&nbsp;评论</span>
            </div>
            <div class="question-answer-content">{{item.content}}</div>
          </div>
          <div v-if="commentDataBody.list&&commentDataBody.total>commentDataBody.list.length" class="show_more" @click="getCommentDetailMore(commentDataBody.list[0].sourceId,commentDataBody.total)">点击加载更多</div>
          <div class="comment-input" v-show="showCom">
            <Input v-model="judgeTempBody" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="评论主要是用来询问相关信息，请不要直接在评论中回答问题。"></Input>
            <div class="float-right">
              <Button type="primary" @click="subJudge(detailList.id,detailList.userId, 'question')">提交评论</Button>
            </div>
          </div>
        </div>

        <div class="dotted-line-group">
          <div class="dotted-line"></div>
          <div class="dotted-line"></div>
        </div>
        <div ref="answerDetailCon" class="sort_type" v-show="oterSelectAnswersByPageList.length>0" v-if="detailList.openArea !== 'vip' || (user.data.vipSign && detailList.openArea === 'vip')">
          <span class="sort_title">其他{{oterSelectAnswersByPageList.length}}个回答</span>
          <ButtonGroup size="small" style="float: right;">
            <Button :type="judge_rank_type == 'default'?'primary':'default'" @click="get_default_judge">默认</Button>
            <Button :type="judge_rank_type == 'new'?'primary':'default'" @click="get_new_judge">最新</Button>
          </ButtonGroup>
        </div>

        <div class="question-answer-list" v-if="detailList.openArea !== 'vip' || (user.data.vipSign && detailList.openArea === 'vip')">
          <div class="gp-answer-item" v-for="item,index in oterSelectAnswersByPageList "><!--回答列表-->

            <div class="answer_user">
              <router-link :to="{name:'TAdynamic',params:{userid:item.userId}}">
                <Avatar icon="ios-person" class="answer_user_logo" size="small" :src="item.avatarUrl"/>
                <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
              </router-link>
              <router-link :to="{name:'TAdynamic',params:{userid:item.userId}}">
                <span>{{item.userName}}</span>
              </router-link>
              <span>回答问题&nbsp;{{item.createdAt | formatDate}}</span>
              <div v-if="item.adoptedAt" class="best-answer">
                <img src="../../../static/img/icon-gper-zuijiadaan.svg">
              </div>
            </div>
            <div class="answer-left" v-if="item.adoptedAt">
              <!--<Icon type="ios-checkmark-circle" size="32" color="#2d8cf0"/>-->

            </div>
            <!--<div class="question-answer-content"></div>-->
            <div v-if="item.editorType =='ueditor'" class="question-answer-content" v-html="item.content"></div>
            <div v-if="item.editorType =='markdown'" v-highlight class="question-answer-content markdown-body" v-html="item.content"></div>

            <div class="answer-operation">
              <span @click="showAdd(index,item.id)">
                <Icon custom="icon-gper-answer" />{{item.comments > 0 ? item.comments + '条':''}}评论
              </span>
              <span v-if="!kill_answe.adoptedAt && commonUserId" @click="adoptedAtAnswer(item.id)">
                <Icon type="ios-checkmark-circle-outline" size="18" />采纳
              </span>
              <!--<span v-if="item.adoptedAt" style="color: #2d8cf0;">
                <Icon type="ios-checkmark-circle" size="18" />已采纳
              </span>-->
              <span :style="item.hasSupport?{color:'#2d8cf0'}:{}" @click="support_judge(item)">
                <Icon custom="icon-gper-dianzan1" />{{item.supports>0?item.supports+'个':''}}赞
              </span>
              <span v-if="item.userId == userId" @click="editComment(item)">
                <Icon custom="icon-gper-bianji1"/>编辑
              </span>
            </div>

            <div class="answer-reply" v-show="showComment===index"><!--回答回复列表-->
              <div class="reply-item" v-for="item in commentData.list">
                <div class="answer_user">
                  <router-link :to="{name:'TAdynamic',params:{userid:item.userId}}">
                    <Avatar icon="ios-person" class="answer_user_logo" size="small" :src="item.avatarUrl"/>
                    <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
                  </router-link>
                  <router-link :to="{name:'TAdynamic',params:{userid:item.userId}}">
                    <span>{{item.userName}}</span>
                  </router-link>
                  <span>{{item.createdAt|formatDate}}&nbsp;评论</span>
                  <!--<span style="float: right"><Icon custom="icon-gper-answer" />回复</span>-->
                </div>
                <div class="question-answer-content">{{item.content}}</div>
              </div>

              <div v-if="commentData.list&&commentData.total>commentData.list.length" class="show_more" @click="comment_loadmore(commentData.list[0].sourceId,commentData.total)">点击加载更多</div>
              <div class="reply-item-input" v-show="showComment===index">
                <Input v-model="judgeTempConten" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="评论主要是用来询问相关信息，请不要直接在评论中回答问题。"></Input>
                <div class="float-right">
                  <Button @click="subJudge(item.id,item.userId)" type="primary">提交评论</Button>
                </div>
              </div>
            </div>

          </div><!--回答列表结束-->

          <div v-if="userAnswerQuestion && !beEditAnswer" class="answer-myself">
            这个问题您已经提交过答案, 您可以对现有答案进行<span @click="editComment(userAnswerQuestion)">修改</span>
          </div>

          <div class="answers_detail_page" ref="pageControl" v-if="oterSelectAnswersByPageList.length>0">
            <Page :total="selectAnswersByPageList.total" @on-change="get_page_answer_detail" />
          </div>

          <!--<Page v-if="answer.list && answer.list.length > 0" :total="answer.total" :current="answer.pageNum" :pageSize="answer.pageSize" @on-change="handleQuestion" />-->
          <div><!--编写答案-->

            <div class="detail_footer" v-show="!is_or_author&&!detailList.hasAnswer || userId == -1">
              <div class="text_container">

                <div class="create-tab">
                  <a :class="index == editorIndex?'active':''" v-for="editor,index in editorList" @click="toggleEditor(index)">{{editor}}</a>
                </div>

                <mavon-editor v-show="editorIndex==1" v-model="mavon_markdownValue" ref=md :ishljs = "true" @imgAdd="$imgAdd" @change="changeData" :toolbars="{bold:true,italic:true,header:true,underline:true,strikethrough:true,mark:true,quote:true,ol:true,ul:true,link:true,imagelink:true,code:true,undo:true,redo:true,trash:true,alignleft:true,aligncenter:true,alignright:true,subfield:true}"></mavon-editor>

                <answerUeditor v-show="editorIndex==0" ref="answermod" :place_hold="mystr" @getHasContent="getHasContent"></answerUeditor>
                <div class="bubbling_submit_box">
                  <div class="submit_text clearfix">
                    <div class="checkbox pull-left" v-if="!beEditAnswer">
                      <Checkbox v-model="is_no_fllow_ans">关注该问题</Checkbox>
                    </div>
                    <div class="pull-right">
                      <Button type="primary" @click="submit_my_answer">提交回答</Button>
                      <Button v-if="beEditAnswer" @click="cancel_my_answer">取消</Button>
                    </div>
                    <!--<input class="submit_sub pull-right" @click="submit_my_answer" type="button" value="提交回答">
                    <input v-if="beEditAnswer" class="cancel_text_sub pull-right" @click="cancel_my_answer" type="button" value="取消">-->
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Col>
      <Col span="6" style="padding-left: 12px;padding-right: 0px;">
        <reward></reward>
        <similar :similarQuestionList="similarQuestionList"></similar>
        <hotQA></hotQA>
        <about></about>
      </Col>
    </Row>

    <BackTop></BackTop>
  </div>
</template>
<script>
  import reward from '@/components/common/rewardList';
  import hotQA from '@/components/common/hotQuestion&Answer';
  import similar from '@/components/common/similarProblems';
  import about from '@/components/footer/about';
  import answerUeditor from "@/components/ueditor/answerUeditor"
  import { mavonEditor } from 'mavon-editor';
  import 'mavon-editor/dist/css/index.css';

  export default {
    name:'question-detail',
    components:{
      reward,
      hotQA,
      similar,
      about,
      answerUeditor,
      mavonEditor
    },
    data(){
      return {
        commentDataBody:[],//详情主体的点击评论查询的列表
        commentDataTotal:'',//详情主体的点击评论数量
        judgeTempBody:'',//详情主体的点击评论列表输入框
        commentDataGood:[],//最佳答案点击评论查询列表
        commentDataGoodTotal:'',//最佳答案评论的数量
        judgeTempGood:'',//最佳答案输入框的内容
        showReward: false,
        showCom:false,
        showCom1:true,
        judge_rank_type:"default",
        showComment:'',
        attenId:null,
        collectId:null,
        judgeTempConten:'',
        is_no_fllow_ans:false,//是否关注本问题
        kill_answe:{},//采纳的回答
        commentParams:{
          // userId:'',
          // content:'',
          // toUserId:'',
          // sourceId:'',
          // orderType:'',
          // sourceType:'App\\Models\\Question',
          // pageNum:'',
        },
        commentGoodParams:{},
        commentBodyParams:{},
        commentData:{},
        attenDetal:{//查询用户关注了问答
          userId:"",
          sourceId:"",
          sourceType:"",
        },
        attenDetalRes:false,
        attenParam:{//关注参数
          userId:"",
          sourceId:"",
          sourceType:"",
        },
        collectActionParam:{//收藏动作参数
          //id:"",
          userId:"",
          sourceId:"",
          sourceType:"",
        },
        isHasContent: false,
        userId:this.$cookie.get('userId'),
        editorList:['HTML编辑器','Markdown'],
        editorIndex:0,
        mavon_markdownValue:'',
        mavon_htmlValue:'',
        mystr:'',
        beEditAnswer:false,
        leftSideFixed:true
      }
    },
    mounted(){
      if(this.$route.query.audit){
        this.leftSideFixed = false;
      }else{
        this.leftSideFixed = true;
      }
      this.load_page();
      this.$nextTick(()=>{
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      });
      window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods:{
      handleScroll () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        var offsetTop = document.querySelector('#artic_bottom_box').offsetTop;
        if(this.$route.query.audit){
          if (scrollTop > offsetTop - 100) {
            this.leftSideFixed = true;
          } else {
            this.leftSideFixed = false;
          }
        }
      },
      support_answer(){
        if(this.detailList.recommendSign == 0){
          var param = {
            userId:this.$cookie.get("userId"),
            supportableId:this.$route.params.id,
            supportableType:'App\\Models\\Question'
          };
          this.$post('support/addSupports', param).then((res) =>{
            if(res.data.data){
              this.$Message.success("推荐问答成功！");
              this.load_page();
            }
          });
        }
      },
      oppositions_answer(){
        if(this.detailList.recommendSign == 0){
          var param = {
            userId:this.$cookie.get("userId"),
            supportableId:this.$route.params.id,
            supportableType:'App\\Models\\Question'
          };
          this.$post('support/oppositions', param).then((res) =>{
            if(res.data.data){
              this.$Message.success("不推荐问答成功！");
              this.load_page();
            }
          });
        }
      },
      changeData(value, render) {
        this.mavon_htmlValue = render;
      },
      $imgAdd(pos, $file){// 绑定@imgAdd event
        var formdata = new FormData();
        formdata.append('editormd-image-file', $file);
        axios({
          url: 'img/editorUpload',
          method: 'POST',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then((data) => {
          this.$refs.md.$img2Url(pos, data.data.url);
        })
      },
      toggleEditor(index){
        this.editorIndex = index;
        if(index == 0){
          this.mystr = this.mavon_htmlValue;
        }else{
          this.$refs.answermod.getContent();
          if(this.$store.state.answers.answerModTemp != '<p>写上一两句话吧</p>'){
            this.mavon_markdownValue = this.$store.state.answers.answerModTemp;
          }
        }
      },
      toPersonPage(id){
        this.$router.push({
          path:'/personal/homepage',
          query:{
            userId:id
          }
        })
      },
      adoptedAtAnswer(id){//采纳为最佳
        var adoptedAtAnswerParam={
          id:'',
          userId:''
        };
        adoptedAtAnswerParam.id=id;
        adoptedAtAnswerParam.userId=this.$cookie.get('userId');
        this.$post("answer/adoptionAnswers", adoptedAtAnswerParam).then((res) =>{
          this.showCom = true;
          this.load_page();
        });
      },
      getCommentDetail(id,pageSize){ //详情主体点击评论
        if(!pageSize) this.showCom = !this.showCom;
        this.commentBodyParams.sourceId = id;
        this.commentBodyParams.pageNum = 1;
        this.commentBodyParams.pageSize = pageSize ? pageSize : 10;
        this.commentBodyParams.sourceType = "App\\Models\\Question";

        this.$post('comment/selectCommentsByPage',this.commentBodyParams).then((res)=>{
          this.commentDataBody = [];
          this.commentDataBody = res.data.data;
          this.commentDataTotal = res.data.data.total;
        });
      },
      getCommentDetailMore(id,pageSize){
        if(this.handleLoginActive()){
          if(!pageSize) this.showCom = !this.showCom;
          this.commentBodyParams.sourceId = id;
          this.commentBodyParams.pageNum = 1;
          this.commentBodyParams.pageSize = pageSize ? pageSize : 10;
          this.commentBodyParams.sourceType = "App\\Models\\Question";

          this.$post('comment/selectCommentsByPage',this.commentBodyParams).then((res)=>{
            this.commentDataBody = [];
            this.commentDataBody = res.data.data;
            this.commentDataTotal = res.data.data.total;
          });
        }
      },
      getCommentDetail1(id,pageSize){//最佳答案下的评论列表
        if(this.handleLoginActive()){
          if(!pageSize) this.showCom1 = !this.showCom1;
          this.commentGoodParams.sourceId = id;
          this.commentGoodParams.pageNum = 1;
          this.commentGoodParams.pageSize = pageSize ? pageSize : 10;
          this.commentGoodParams.sourceType = "App\\Models\\Answer";
          this.$post('comment/selectCommentsByPage',this.commentGoodParams).then((res)=>{
            this.commentDataGood = [];
            this.commentDataGood = res.data.data;
          });
        }
      },
      getComment(){
        this.$post('comment/selectCommentsByPage', this.commentParams).then((res) =>{
          this.commentData = res.data.data;
          this.$store.dispatch('selectAnswersByPage');
        });
      },
      load_page(){//加载页面所有函数
        this.$store.dispatch('selectQuestionsById',this.$route.params.id);
        this.$store.dispatch('similarQuestion', this.$route.params.id);
        this.getCommentDetail(this.$route.params.id);//页面加载时 加载详情主体评论的列表
        this.selectAnswers();
        this.attenDetailac();
        this.collectDetail();
        this.showCom = false;
      },

      get_new_judge(){
        this.judge_rank_type="new";
        this.selectAnswers()
      },
      get_default_judge(){
        this.judge_rank_type="default";
        this.selectAnswers()
      },
      warning(nodesc) {
        this.$Message.warning(nodesc);
      },
      submit_my_answer(){//提交回答
        if(this.handleLoginActive()){
          if(this.editorIndex == 0){
            this.$refs.answermod.getContent();
            this.$store.state.answers.answerQuesPara.editorType = 'ueditor';
          }else if(this.editorIndex == 1){
            this.$store.state.answers.answerModTemp = this.mavon_htmlValue;
            this.$store.state.answers.answerQuesPara.mdcontent = this.mavon_markdownValue;
            this.$store.state.answers.answerQuesPara.editorType = 'markdown';
          }
          let answerModTemp = this.$store.state.answers.answerModTemp;
          if(answerModTemp || (answerModTemp.indexOf('<img') > -1)){
            this.isHasContent = true;
          }
          if(!this.isHasContent){
            this.$Message.warning('内容不能为空');
            return;
          }
          if(!answerModTemp) return;
          if(answerModTemp.indexOf('<img') < 0){
            let dd = answerModTemp.replace(/<\/?.+?>/g,"").trim();
            if(dd.length < 5){
              this.warning('回答至少五个字')
              return
            }
          }
          if(answerModTemp.length > 60000){
            this.warning('回答不能超过6万个字')
            return
          }
          this.$store.state.answers.answerQuesPara.userId = this.$cookie.get("userId");
          this.$store.state.answers.answerQuesPara.questionId = this.$route.params.id;
          this.$store.state.answers.answerQuesPara.followed = this.is_no_fllow_ans ? 1 : 0;
          if(this.$store.state.answers.answerQuesPara.type != 'update'){
            this.$store.state.answers.answerQuesPara.type = 'add';
            this.$store.state.answers.answerQuesPara.id = '';
          }
          this.$store.state.answers.answerQuesPara.content = this.$store.state.answers.answerModTemp;
          this.$refs.answermod.clearDoc();
          this.mavon_markdownValue = '';
          this.$store.dispatch('answerQuestAct');
        }
      },
      selectAnswers(i){//查询回答
        this.$store.state.answers.selectAnswersByPageParams.pageNum= i || 1;
        this.$store.state.answers.selectAnswersByPageParams.questionId=this.$route.params.id;
        this.$store.state.answers.selectAnswersByPageParams.orderType=this.judge_rank_type;
        this.$store.dispatch('selectAnswersByPage')
      },
      get_page_answer_detail(i){//答案的分页
        this.showComment="";
        this.$store.state.answers.selectAnswersByPageParams.pageNum = i;
        this.$store.dispatch('selectAnswersByPage');
        document.body.scrollTop = document.documentElement.scrollTop = this.$refs.answerDetailCon.offsetTop;
      },
      attenDetailac(){//查询是否关注的
        this.attenDetal.userId=this.$cookie.get("userId");
        this.attenDetal.sourceId=this.$route.params.id;
        this.attenDetal.sourceType="App\\Models\\Question";
        //this.$store.dispatch('attenDetail');//关注详情
        this.$post('attention/selectAttentionsBySourceId', this.attenDetal).then((res) =>{
          this.attenDetalRes=res.data.data;
        });
      },
      collectDetail(){//收藏的情况
        this.colectDetail.userId=this.$cookie.get("userId");
        this.colectDetail.sourceId=this.$route.params.id;
        this.colectDetail.sourceType="App\\Models\\Question";
        this.$store.dispatch('collecDetail');//收藏详情  action.js
      },
      showAdd(i,id){
        if(this.handleLoginActive()){
          this.showComment = this.showComment === i ? '' : i;
          this.commentParams.sourceId = id;
          this.commentParams.orderType = 'new';
          this.commentParams.pageNum = 1;
          this.commentParams.pageSize = 10;
          this.commentParams.sourceType = 'App\\Models\\Answer';
          this.getComment();
        }
      },
      comment_loadmore(sourceId,total){
        this.commentParams.sourceId=sourceId;
        this.commentParams.orderType='new';
        this.commentParams.pageNum=1;
        this.commentParams.pageSize=total;
        this.commentParams.sourceType='App\\Models\\Answer';
        this.getComment();
      },
      closeComment(){
        this.showComment="";
        this.judgeTempConten="";
        this.showCom=false;
        this.showCom1=false;
      },
      closeCom(){
        this.showCom=false;
        this.judgeTempConten="";
      },
      toDetail(id){
        this.$router.push({
          path:'/answers/detail',
          query:{
            id:id
          }
        })
        this.$store.commit('selectQuestionsById',this.$route.params.id)
      },
      attenBtn(){//关注
        if(this.handleLoginActive()){
          this.attenParam.userId=this.$cookie.get("userId");
          this.attenParam.sourceId=this.$route.params.id;
          this.attenParam.sourceType="App\\Models\\Question";
          var url=null;
          if(this.attenDetalRes==true){
            url='attention/cancelAttentions'
          }else{
            url='attention/addAttentions'
          }
          //取消关注 url   attention/cancelAttentions
          this.$post(url, this.attenParam).then((res) =>{
            this.attenDetailac();
            this.$store.dispatch('selectQuestionsById',this.$route.params.id);
          });
        }
      },
      collectBtn(){//收藏点击
        if(this.handleLoginActive()){
          this.collectActionParam.userId = this.$cookie.get("userId");
          this.collectActionParam.sourceId = this.$route.params.id;
          this.collectActionParam.sourceType = "App\\Models\\Question";
          var url = null;
          //collection/cancelCollections
          if(this.colectDetalres == true){
            url = "collection/cancelCollections"
          }else{
            url = "collection/addCollections"
          }
          this.$post(url,this.collectActionParam).then((res)=>{
            this.collectDetail();
            this.$store.dispatch('selectQuestionsById',this.$route.params.id);
          });
        }
      },
      support_judge(val){//给评论点赞
        if(this.handleLoginActive()){
          this.$store.state.action.supportParam.userId = this.$cookie.get("userId");
          this.$store.state.action.supportParam.supportableId = val.id;
          this.$store.state.action.supportParam.supportableType = "App\\Models\\Answer";
          this.$post("support/addSupports",this.$store.state.action.supportParam).then((res)=>{
            if(res.data.data){
              val.hasSupport = true;
              val.supports = val.supports + 1;
              //this.selectAnswers(this.$store.state.answers.selectAnswersByPageParams.pageNum);
            }
            //this.$store.state.action.supportRes = res.data.data;
          });
        }
      },
      subJudge(mid,touid, type){//提交评论动作
        this.$store.state.common.addUpdateCommentsParams.userId=this.$cookie.get("userId");
        this.$store.state.common.addUpdateCommentsParams.sourceId=mid;
        if (type === 'question') {
          this.$store.state.common.addUpdateCommentsParams.toUserId='';
          this.$store.state.common.addUpdateCommentsParams.sourceType="App\\Models\\Question";
        } else {
          this.$store.state.common.addUpdateCommentsParams.toUserId=touid;
          this.$store.state.common.addUpdateCommentsParams.sourceType="App\\Models\\Answer";
        }

        this.$store.state.common.addUpdateCommentsParams.type="add";
        if(this.judgeTempConten){//判断不同的地方的评论框的内容是否存在  其他回答的二级评论列表的输入框
          this.$store.state.common.addUpdateCommentsParams.content=this.judgeTempConten;
          this.$store.dispatch('addUpdateComments');//common.js
          setTimeout(()=>{
            this.getComment()
          },500)
        }else if(this.judgeTempBody){//详情主体评论列表输入框
          this.$store.state.common.addUpdateCommentsParams.content=this.judgeTempBody;
          this.$store.dispatch('addUpdateComments');//common.js

          setTimeout(()=>{
            this.getCommentDetail(this.$route.params.id);
            this.showCom=true;
          },500)

        }else if(this.judgeTempGood){
          this.$store.state.common.addUpdateCommentsParams.content=this.judgeTempGood;
          this.$store.dispatch('addUpdateComments');//common.js
          setTimeout(()=>{
            this.getCommentDetail1(this.kill_answe.id);
            this.showCom1=false;
          },500)
        }
        this.judgeTempConten="";
        this.judgeTempBody='';
        this.judgeTempGood='';
      },
      subComment(){
        this.$store.state.action.qcAddJudge.userId=this.$cookie.get("userId");
        this.$store.state.action.qcAddJudge.content=this.judgeTempConten;
        this.$store.state.action.qcAddJudge.sourceType="App\\Models\\Answer";
        this.$store.state.action.qcAddJudge.sourceId=this.$cookie.get("userId");
        this.$store.state.action.qcAddJudge.toUserId=this.$route.params.id;
        this.$store.dispatch('qcAddJudge');
        this.judgeTempConten="";
        this.showCom=false;
      },
      getHasContent (flag) {
        this.isHasContent =  flag
      },
      editComment(item){
        this.beEditAnswer = true;
        this.detailList.hasAnswer = false;
        this.$store.state.answers.answerQuesPara.id = item.id;
        this.$store.state.answers.answerQuesPara.type = 'update';
        if(item.editorType == 'markdown'){
          this.editorIndex = 1;
          this.mavon_markdownValue = item.mdcontent;
        }else{
          this.editorIndex = 0;
          this.$refs.answermod.setContent(item.content);
        }
        //document.body.scrollTop = document.documentElement.scrollTop = this.$refs.pageControl.offsetTop + 200;
      },
      cancel_my_answer(){
        this.beEditAnswer = false;
        this.detailList.hasAnswer = true;
      },
      getUserAnswer(questionId){
        this.$store.state.answers.userAnswerParams.questionId=questionId;
        this.$store.dispatch('getUserAnswer');
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
      toTagDetail(tagid){
        this.$router.push({name:'tagDetail',params:{tagid:tagid}});
      },
      putLinkRecord () {
        let param = {
          userId: this.$cookie.get("userId"),
          sourceId: this.articleData.id,
          sourceType: 'ARTICLE',
          jumpUrl: 'https://www.gupaoedu.com/course-java.html'
        }
        this.$post('channel/add',param).then((res)=>{
        })
      }
    },
    computed:{
      is_or_author(){//判断是不是作者，是就显示编辑
        if(this.detailList.userId == this.$cookie.get("userId")){
          return true;
        }else{
          return false;
        }
      },
      commonUserId(){
        if(this.detailList.userId == this.$cookie.get('userId')){
          return true
        }else{
          return false
        }
      },
      canclColecRes(){//取消收藏的动作的返回结果
        return this.$store.state.action.cancel_cole_res
      },
      canclAttRes(){//取消关注的动作的返回结果
        return this.$store.state.action.cancelAttres
      },
      answerQuesRes(){//回答后返回的结果
        return this.$store.state.answers.answerQuesRes
      },
      detailList(){ //问题 详情
        return this.$store.state.answers.detailList;
      },
      similarQuestionList(){//相似问题
        return this.$store.state.answers.similarQuestionList;
      },
      selectAnswersByPageList(){//回答查询列表
        this.kill_answe = {};
        this.$store.state.answers.selectAnswersByPageList.forEach((val)=>{
          if(val.adoptedAt!=undefined){
            this.kill_answe=val;
          }
        });
        /*this.$nextTick(() =>{
          let imgs2 = document.getElementsByClassName('answer_list')[0].getElementsByTagName('img');
          for(let i = 0; i < imgs2.length; i++){
            let img = imgs2[i];
            img.onclick = ()=>{
              window.open(img.src);
            }
          }
        });*/
        return this.$store.state.answers.selectAnswersByPageList;
      },
      oterSelectAnswersByPageList(){
        /*this.$nextTick(() =>{
          let imgs3 =  document.getElementsByClassName('answer_comment_wrapper')[0].querySelectorAll('.content_info img');
          for(let i=0;i<imgs3.length;i++) {
            let img =  imgs3[i];
            img.onclick= () => {
              window.open(img.src);
            }
          }
        });*/
        return this.selectAnswersByPageList;/*.filter((val)=>{
          return val.adoptedAt===null
        });*/
      },
      colectDetail(){//收藏详情结果
        return this.$store.state.action.colectDetail
      },
      colectDetalres(){// 查询是否收藏
        return this.$store.state.action.colectDetalres
      },
      colelectRes(){
        return this.$store.state.action.colelectRes
      },
      supportRes(){
        return this.$store.state.action.supportRes
      },
      addJudgeRes(){//评论的返回结果
        return this.$store.state.action.addJudgeRes
      },
      killerData(){
        //console.log(this.$store.state.person.otheruserInfoData,"其他用户的信息")
        return this.$store.state.person.otheruserInfoData
      },
      addUpdateCommentsPamras(){
        return this.$store.state.common.addUpdateCommentsPamras
      },
      userAnswerQuestion(){
        return this.$store.state.answers.userAnswerQuestion;
      },
      user(){
        return this.$store.state.login.userResult;
      },
    },
    watch :{
      userAnswerQuestion:{
        handler(curr,old){
        },
        deep:true
      },
      detailList:{
        handler(curr,old){
          document.title=curr.title+' - GPer生态圈';
          this.getUserAnswer(curr.id);
          /*this.$nextTick(() =>{
            let imgs = document.getElementsByClassName('detail_des')[0].getElementsByTagName('img');
            for(let i = 0; i < imgs.length; i++){
              let img = imgs[i]
              img.onclick = ()=>{
                window.open(img.src);
              }
            }
          });*/
        },
        deep:true
      },
      kill_answe:{//查询killer 的信息
        handler(curr,old){
          this.kill_answe=curr
        },
        immediate: true
      },
      colelectRes:{
        handler(curr,old){
          this.collectDetail();
        },
        deep:true
      },
      supportRes:{
        handler(curr,old){
          // this.selectAnswers();
        },
        deep:true
      },
      addJudgeRes:{
        handler(curr,old){
          this.selectAnswers()
        },
        deep:true
      },
      answerQuesRes:{
        handler(curr,old){
          this.selectAnswers();
          this.attenDetailac();
          this.$store.state.answers.answerQuesPara.type='add';
          this.$store.dispatch('selectQuestionsById',this.$route.params.id);
        },
        deep:true
      },
      canclAttRes:{//取消关注后冲查询关注情况
        handler(curr,old){
          this.attenDetailac()
        },
        deep:true
      },
      canclColecRes:{//取消收藏后冲查询收藏情况
        handler(curr,old){
          this.collectDetail()
        },
        deep:true
      },
      "$route"(to,from){
        this.showCom = false;
        this.showCom1 = false;
        this.showComment = "";
        this.load_page();
      }
    },
    created(){
      var _this = this;
      setTimeout(function(){
        document.title=_this.detailList.title+' - GPer生态圈';
      },500);
    },
    updated() {
      // 问题主体部分

    }
  };
</script>

<style>
  #answer-detail .v-note-wrapper .v-note-op .v-right-item {max-width: 10% !important ;}
</style>

<style scoped>
  @import 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.9.0/github-markdown.min.css';

  #answer-detail{padding: 0 72px;}
  ol,li{list-style: none;}
  .detail-markdown-body{ width:800px;/*min-height:150px !important;*/border-left:1px solid #fff;background-color:white;position:relative;overflow:visible}
  .answer_title h1{font-size:24px;font-weight:400;line-height:33px;color:#000000;}
  .answer_title span{display: inline-block;height: 24px;margin:0 6px;padding: 2px 7px;font-size:14px;font-weight:400;line-height:20px;vertical-align: text-top;border-radius:3px;}
  .answer_title .resolved{background: #459BF8;color:#FFFFFF;}
  .answer_title .unsolved{background: #d2d7dc;color:#FFFFFF;}

  .answer_user{margin-top: 12px;padding-bottom: 5px;}
  .answer_user span{display: inline-block;font-size:12px;font-weight:400;line-height:28px;color: #515a6e;}
  .answer_user a span:hover{color: #2d8cf0;}
  .answer_user .answer_user_logo{width: 28px;height: 28px;border-radius: 28px;margin-right:11px;}
  .vip-crown{position:absolute;margin-left: -34px;margin-top: -12px;width: 25px;-webkit-transform:rotate(9deg);transform:rotate(9deg);}

  .hov_underline{color:#515a6e;cursor: pointer;}
  .hov_underline:hover{color: #2d8cf0;}

  .user-reward-gold{padding-left:5px;width: 27px;height: 27px;display: inline-block;vertical-align: bottom;}
  .user-reward-gold img{width: 27px;height: 27px;}
  .user-reward-gold-sum{padding-left:6px;height:17px;font-size:12px;font-weight:400;line-height:17px;color:#F9AB10;display: inline-block;}

  .answer_user .right-box{padding-left:6px;padding-right:5px;}
  .answer-left{margin: 9px 11px 0 0;width: 28px;float:left;}
  .answer-left .answer-left-msg{display: block;height: 28px;width: 28px;font-size: 14px;line-height: 28px;text-align: center;border:1px solid #dcdee2;border-bottom: none;border-top: none;}

  .answer-content{min-height:60px;-webkit-text-size-adjust:100%;line-height:1.5;color:#24292e;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";font-size:16px;word-wrap:break-word;margin-top:9px;margin-left:39px;font-weight:400;overflow:hidden;}
  .answer-content img{cursor: pointer;}
  /*.ivu-btn-icon-only{padding: 1px 7px 2px;border-radius: 3px;border-bottom-left-radius: 0;border-bottom-right-radius: 0;}
  .ivu-tooltip-popper{width:200px;}*/

  .answer-comment{margin: 16px 16px 28px 22px;background: rgba(249, 249, 249, 0.5);}
  .answer-comment .comment-item{padding-bottom: 17px;margin: 15px 46px 0 22px;border-bottom: 1px dotted rgba(112,112,112,0.15);}
  .answer-comment .comment-input{margin-right:46px;margin-bottom: 22px;}
  .bottom-none{border-bottom:none !important;}
  .show_more{text-align: center;cursor: pointer;}
  .show_more:hover{color:#2b85e4;}
  .answer-tags{margin-top: 10px;margin-left: 39px;}
  .answer-tags span{font-size:14px;line-height:18px;padding:3px 8px 2px 8px;margin-right:8px;margin-bottom:8px;background:#efefef;border-radius:3px;display:inline-block;cursor: pointer  }
  .answer-operation{margin-top: 10px;margin-left: 39px;}
  .answer-operation span{cursor: pointer;margin: 3px 10px 3px 0px;font-size:12px;font-weight:400;line-height:17px;height:17px;display: inline-block;}
  .answer-operation span:hover{color:#2d8cf0;}
  .answer-operation span i{padding-right: 5px;padding-bottom: 5px;}

  .dotted-line-group{margin: 22px 0;}
  .dotted-line{height: 1px;margin-top:1px;border-bottom:1px dotted rgba(0,0,0,0.18);}

  .sort_type{width: 100%;padding: 8px 0 11px;border-bottom: 1px dotted rgba(112, 112, 112, 0.15);}
  .sort_type .sort_title{font-size:20px;font-weight:400;line-height:23px;display: inline-block;}

  .gp-answer-item{width: 100%;padding: 8px 0 11px;border-bottom: 1px dotted rgba(112, 112, 112, 0.15);overflow: hidden;}
  .question-answer-list{/*margin-top: 16px;margin-left: 39px;*/}
  .question-answer-content{margin-left: 39px;font-size: 14px;font-weight: 400;line-height: 20px;}
  .answer-reply{margin-top: 10px;margin-left: 39px;background: #F9F9F9;}
  .answer-reply .reply-item{padding:10px 0px;border-bottom: 1px solid #ebeced;}
  .reply-item-input{margin-top: 16px;margin-left: 39px;}
  .reply-item-input .float-right{text-align: right;margin-top: 12px;}

  .comment-input{margin-top: 17px;margin-left: 22px;}
  .comment-input .float-right{text-align: right;margin-top: 12px;}

  .best-answer{float: right;width: 60px;height: 60px;}
  .best-answer img{width: 60px;height: 60px;transform: rotate(29deg);}

  .answer-myself{padding: 20px;text-align: center;}
  .answer-myself span{color:#2b85e4;cursor: pointer;}

  .answers_detail_page{padding: 20px;text-align: center;}

  .text_container{width:100%;}
  .create-tab{width:100%;height:100%}
  .create-tab .active{font-weight:600;color:#337ab7}
  .create-tab a{display:inline-block;height:39px;padding:0 15px;font-size:15px;line-height:41px;color:#666;border-radius:5px 5px 0 0;margin:0 1px}
  .submit_text{width:832px;margin:15px 0 70px;height:47px;line-height:47px;text-align:center}
  .pull-left{float:left;}
  .top_vip{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#d72a47;border-radius:3px;color:#fff;float:left;margin-right:5px;text-align:center;cursor: pointer;}

  .left-float{position: absolute;width: 28px;}

  .side-widget{display:flex;position:fixed;flex-direction:column;width:28px;z-index:1000;}

  .atic_brife_fixed{display:none}
  #answer-detail .open_area_tip { color:#fff;margin-bottom: 20px; height: 179px;font-size: 15px;text-align: center; background-image: url("/static/img/vip-bg.jpg");background-size: 100% 100%;cursor: pointer}
</style>

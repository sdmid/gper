<template>
    <div id="article-content">
      <Row :gutter="24">
        <Col span="18">
          <div>
            <div class="title-wrapper">
              <span class="article-type" v-show="articleData.articleType">{{articleData.articleType | getArticleType}}</span>
              <span v-if="articleData.openArea === 'vip'" class="top_vip">VIP</span>
              <h1 class="title">{{articleData.title}}</h1>
            </div>
            <div class="user-info">
              <a href="javascript:void(0)" @click="toPersonelPage( articleData.userId)">
              <Avatar icon="ios-person" :src="articleData.avatarUrl"/>
              <img v-show="articleData.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
              </a>
              <a href="javascript:void(0)" @click="toPersonelPage( articleData.userId)">
              <span style="color: #1890FF;margin-right: 10px; cursor: pointer">{{articleData.userName}}</span>
              </a>
              <span>{{articleData.createdAt|formatDate}}</span>
              <span style="margin-left: 10px"><Icon  style="vertical-align: text-bottom" type="md-eye" size="16" class="icon"/> <span class="right-inline">{{articleData.views}}阅读</span></span>
              <span v-if="articleData.categoryName" style="margin-left: 10px">分类：{{articleData.categoryName}}</span>
            </div>
            <Divider style="margin: 10px 0;"/>

            <div class="side-widget" v-show="user.data.vipSign && articleData.recommendSign === 0" :class="{ 'atic_brife_fixed': leftSideFixed}">
              <Tooltip placement="top-start">
                <div slot="content">
                  <p style="text-align: center;">文章对人有帮助</p>
                  <p style="text-align: center;">内容完整</p>
                </div>
                <Button type="primary" ghost icon="md-arrow-dropup" style="width: 28px;height: 28px;padding: 0;margin-bottom: 5px;font-size: 17px;" @click="support_yes_artic"></Button>
              </Tooltip>
              <Tooltip placement="bottom-start">
                <div slot="content">
                  <p style="text-align: center;">文章没有实际价值</p>
                  <p style="text-align: center;">缺少关键内容</p>
                </div>
                <Button type="primary" ghost icon="md-arrow-dropdown" style="width: 28px;height: 28px;padding: 0;font-size: 17px;" @click="support_not_artic2"></Button>
              </Tooltip>
            </div>

            <div v-if="articleData.editorType =='ueditor'" class="artic_content" v-html="articleData.content">
              {{articleData.content}}
            </div>
            <div v-if="articleData.editorType =='markdown'" v-highlight class="artic_content markdown-body"
                 v-html="articleData.content" style="width: auto;height: auto !important;">
            </div>
            <!--<a href="https://www.gupaoedu.com/course-java.html"  target="_blank"  v-if="userNes.data && (!userNes.data.vipSign) && articleData.openArea === 'vip'" >
              <div class="open_area_tip" @click="putLinkRecord"></div>
            </a>-->


            <div v-show="userNes.data && (!userNes.data.vipSign) && articleData.openArea === 'vip'" style="text-align: center;">

              <img src="../../../static/img/noVIP.png" style="padding: 50px;">
              <h3>VIP内容仅对VIP开放，你还不是VIP</h3>
              <a href="https://www.gupaoedu.com/course-java.html"  target="_blank" >
                <Button type="primary" style="margin: 20px;">
                  立即加入
                </Button>
              </a>
            </div>


            <div class="tags_list_box">
						<span class="one_tag" v-for="val in articleData.tagsList" @click="toTagDetail(val.id)">{{val.name}}</span>
            </div>
            <div id="artic_bottom_box">
              <div class="icon-wrapper" :class="{active : articleData.collect_state}" @click="collect_artic" ><i class="i-icon icon-gper-recommend"></i><span>收藏</span></div>
              <div class="icon-wrapper" :class="isReco? 'active': ''" @click="support_not_artic"><i class="i-icon icon-gper-dianzan1"></i>{{articleData.supports}}赞</div>
              <div v-if="articleData.qrcodeUrl"  class="icon-wrapper" @click="showReward=true"><i class="i-icon icon-gper-mygold"></i>打赏</div>
              <div v-show="showEdit" class="icon-wrapper" @click="toEditarticle(articleData.userId,articleData.id)"><i class="i-icon icon-gper-bianji1"></i>编辑</div>
            </div>
            <Divider style="margin: 10px 0;"/>
            <div class="answers_top_title_box">
              <span style="font-size: 22px; color: #000">
                {{judgeTotal}}条评论
              </span>
              <div class="orderby_box">
                <span  class="new" :class="{active:judge_rank_type=='new'}" @click="getCommentToCondition('new')">
                  最新
                </span>
                <span class="default" :class="{active:judge_rank_type=='default'}"  @click="getCommentToCondition('default')">
                  默认
                </span>
              </div>
            </div>
            <Divider style="margin: 10px 0;"/>

            <div>
              <div class="comment-item" v-for="item,index in judgeList "><!--评论列表-->
                <div class="com-user-info">
                  <div class="user-img">
                    <router-link :to="{name:'TAdynamic',params:{userid: item.userId}}">
                    <Avatar icon="ios-person" :src="item.avatarUrl"/>
                    <img v-show="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
                    </router-link>
                  </div>
                  <router-link :to="{name:'TAdynamic',params:{userid: item.userId}}">
                  <div  class="user-name">{{item.userName}}</div>
                  </router-link>
                  <div>{{item.createdAt|formatDate}}</div>
                </div>
                <div class="content">{{item.content}}</div>
                <div class="com-menu">
                  <div class="icon-wrapper" @click="toggle_back(item.id,index)"><i class="i-icon icon-gper-answer"></i>{{item.replyTotal}}条评论</div>
                  <div class="icon-wrapper" :class="{active: item.hasSupport}" @click="support_judge(item)"><i class="i-icon icon-gper-dianzan1"></i>{{item.supports}}个赞</div>
                </div>
                <!--二级评论-->
                <div v-show="SecondCommentIndex===index" class="second_com_content">
                  <ul>
                    <li v-for="secondItem of secondCommentList">
                      <div class="com-user-info">
                        <div class="user-img">
                          <router-link :to="{name:'TAdynamic',params:{userid: secondItem.userId}}">
                          <Avatar icon="ios-person" :src="secondItem.avatarUrl"/>
                          <img v-show="secondItem.vipSign" class="vip-crown" src="../../../static/img/crown.svg"/>
                          </router-link>
                        </div>
                        <router-link :to="{name:'TAdynamic',params:{userid: secondItem.userId}}">
                        <div  class="user-name">{{secondItem.userName}}</div>
                        </router-link>
                        <div>{{secondItem.createdAt|formatDate}}</div>
                      </div>
                      <div class="content">{{secondItem.content}}</div>
                    </li>
                    <div v-if="secondCommentList && item.replyTotal>secondCommentList.length" class="twoLeve_show_more"@click="get_twoleve_judge_more(item.id)">点击加载更多</div>
                  </ul>
                  <div class="add_second_content">
                    <Input v-model="secondComment" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
                    <div class="float-right">
                      <Button @click="submit_inner_judge(item)" type="primary">提交评论</Button>
                    </div>
                  </div>
                </div>
                <!--二级评论列表结束-->

              </div><!--评论列表结束-->
            </div>
            <!--主体评论加载更多-->
            <div class="add_more" v-if="judgeTotal>0">
              <div v-if="showMore" class="show_more" @click="load_more">
                点击加载更多
              </div>
              <div v-else class="hide_more">
                没有更多数据了
              </div>
            </div>

            <div class="add-comment">
              <div class="header-box"  @click="toPersonelPage(userNes.data.id)" v-show="userNes.data && userNes.data.avatarUrl">
                <Avatar icon="ios-person" :src="userNes.data.avatarUrl" style="cursor: pointer"/>
                <img v-show="userNes.data && userNes.data.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
              </div>
                 <textarea rows="6" maxlength="300" v-model="commentContent"
                           @keyup="contentChange"
                           @change ="contentChange"
                           placeholder="请输入评论内容"></textarea>
                <span class="count_num">已输入{{countNum}}/300</span>
            </div>
            <div class="clear btn_wrapper">
              <span class="submit_btn" @click="submitContent">发表评论</span>
            </div>
          </div>
        </Col>
        <Col span="6">
          <div class="report_article" @click="toArticle">我要发文</div>

          <div class="atic_brife_line_box" v-if="articleHeaders.length>0">
            <span class="line_title">目录</span>
            <ul class="articleIndex">
              <li v-for="(item,index) of articleHeaders" class="item" :style="{ 'list-style': (item.name == 'h1' ? '':'none')}" :key="index">
                <a v-if="item.name == 'h1'" :href="'#'+item.id">{{item.text}}</a><!--一级目录-->
                <ul v-if="item.name == 'h2'"><!--二级目录-->
                  <li>
                    <a :href="'#'+item.id">{{item.text}}</a>
                  </li>
                </ul>
                <ul v-if="item.name == 'h3'"><!--三级目录-->
                  <ul>
                    <li>
                      <a :href="'#'+item.id">{{item.text}}</a>
                    </li>
                  </ul>
                </ul>
              </li>
            </ul>


          </div>
          <div class="similar-article" v-if="similarArtic.length>0">
            <div class="similar-article-title">
              <span class="similar-name">相似文章</span>
              <!--<a href="javascript:void(0);" class="hot-more">
                更多<Icon type="ios-arrow-forward" size="11"/>
              </a>-->
            </div>
            <div class="similar-info">
              <div class="article-box" v-for="(item,index) in similarArtic" :key="index">
                <div class="article-info">
                  <div class="article_user_img">
                    <a href="javascript:void(0)" class="box1" @click="toPersonelPage(item.userId)">
                      <Avatar icon="ios-person" class="box-logo" :src="item.avatarUrl"/>
                      <img v-show="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
                    </a>
                  </div>
                  <div class="article-title" @click="toArticleDetail(item.id)">
                    <div class="text">{{item.title}}</div>
                  </div>
                </div>
                <div class="article-total">
                  <Icon type="md-eye" size="12" class="icon"/><span>{{item.views}}</span>
                  <Icon custom="icon-gper-message" size="12" class="icon"/><span> {{item.comments}}</span>
                </div>
              </div>
            </div>
          </div>
          <about></about>
        </Col>
      </Row>

      <div class="reward_dailog" v-show="showReward">
        <div class="cont_reward">
          <div style="padding:10px 0; border-bottom: 1px solid #dcdee2;position: relative;">
            <Icon @click="showReward = false" style="cursor:pointer; font-size: 23px;position: absolute;right: 10px;color: #b5b5b5;" type="md-close" />
            <img v-lazy="articleData.avatarUrl" :key="articleData.avatarUrl" class="user_img" />
            <img v-show="articleData.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
          </div>
          <div style="margin: 10px 0; font-size: 14px">
					<span>
						如果觉得我的文章对您有用，请随意打赏。你的支持将鼓励我继续创作！
					</span>
          </div>
          <img v-lazy="articleData.qrcodeUrl" :key="articleData.qrcodeUrl" class="qrcode_img" />
        </div>
      </div>

      <BackTop></BackTop>
    </div>
</template>

<script>
  import Vue from "vue"
  import Cookies from "js-cookie"
  import about from '@/components/footer/about';
  import hotArticle from '@/components/article/hotArticle';
    export default {
      name: "articleContent",
      components:{
        hotArticle,
        about
      },
      data () {
          return {
            showReward:false,
            articleData: {
              vipSign:false
            },
            articleHeaders: [], // 文章目录
            judge_rank_type:"default",
            judgeTotal:0,//总评论数
            judgeList: [],//评论列表
            judgeParam:{
              sourceType:"App\\Models\\Article",
              pageNum:1,
              pageSize:10
            },
            commentContent: '',
            countNum: 0,
            showMore: true,
            isReco:false,
            SecondCommentIndex: '',
            secondCommentList: [],
            twoLeveParam:{
              pageNum:1,
              pageSize:10
            },
            secondComment: '',//二级评论添加内容
            addSupportsParams: {},
            similarAticParams:{
              pageNum:'1',
              pageSize:'6',
            },
            similarArtic: [],
        	leftSideFixed:true
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
      mounted () {
        if(this.$route.query.audit){
          this.leftSideFixed = false;
        }else{
          this.leftSideFixed = true;
        }
        this.get_artic_data(); // 获取文章内容
        this.get_judge_data();// 获取文章评论
        this.get_similar_artic();
        this.$nextTick(()=>{
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
        window.addEventListener('scroll', this.handleScroll);
      },
      destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
      },
      computed: {
        userNes(){
          return this.$store.state.login.userResult;
        },
        showEdit(){//是登陆id 显示编辑按钮     是登陆ID  右侧不显示关注 发笃信按钮
          return this.articleData.userId == Cookies.get('userId') ? true : false;
        },
        user(){
          return this.$store.state.login.userResult;
        }
      },
      methods: {
        toTagDetail(tagid){
          this.$router.push({name:'tagDetail',params:{tagid:tagid}});
        },
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
        support_yes_artic(){//推荐文章
          if(this.articleData.recommendSign == 0){
            var param = {
              userId:this.$cookie.get("userId"),
              supportableId:this.$route.query.id,
              supportableType:'App\\Models\\Article'
            };
            this.$post('support/addSupports', param).then((res) =>{
              if(res.data.success){
                this.$Message.success("推荐文章成功！");
                this.get_artic_data();
              }
            });
          }
        },
        support_not_artic2(){//不推荐文章
          if(this.articleData.recommendSign == 0){
            var param = {
              userId:this.$cookie.get("userId"),
              supportableId:this.$route.query.id,
              supportableType:'App\\Models\\Article'
            };
            this.$post('support/oppositions', param).then((res) =>{
              if(res.data.data){
                this.$Message.success("不推荐文章成功！");
                this.get_artic_data();
              }
            });
          }
        },
        get_artic_data(){   //获取文章内容  文章详情查询接口
          var id = this.$route.query.id;
          this.$get('article/selectArticlesById', {
            id: id
          }).then((res) =>{
            if (res.data.success) {
              this.articleData = res.data.data.articleInfo;
             this.$nextTick(() =>{
                  var h_list = document.getElementsByClassName('artic_content')[0].querySelectorAll('h1,h2,h3');
                  var articleHeaders = [];
                    for(var i=0; i< h_list.length;i++){
                      h_list[i].id = 'articleHeader'+i;
                      articleHeaders.push({
                        id:h_list[i].id,
                        text:h_list[i].innerText,
                        name:h_list[i].nodeName.toLocaleLowerCase()
                      });
                    }
                  this.articleHeaders = articleHeaders;
                  let imgs =  document.getElementsByClassName('artic_content')[0].getElementsByTagName('img');
                  for(let i=0;i<imgs.length;i++){
                    let img =  imgs[i];
                    img.onclick= () => {
                      window.open(img.src);
                    }
                  }
                });
              document.title = this.articleData.title + ' - GPer生态圈';
              this.check_user_artical_sopport(); //查询用户点赞  文章的情况,也就是推荐文章
              this.check_collect_state();//查询用户收藏情况
            }
          });

        },
        toArticleDetail (id) {
          this.$router.push({
            path:"/articleContent",
            query:{id:id}
          });
        },
        //相似文章
        get_similar_artic(){
          this.similarAticParams.articleId = this.$route.query.id;;
          this.$post('article/similarArticle', this.similarAticParams).then((res) =>{
            if (res.data.success && res.data.data.list && res.data.data.list.length>0) {
              this.similarArtic = res.data.data.list;
            }
          });
        },
        toPersonelPage(userid){
          if (userid) {
            this.$router.push({
              name: 'TAdynamic',
              params: {userid: userid}
            });
          }
        },
        toEditarticle(userId,id){//点击编辑跳转到详情细编页
          if(userId == Cookies.get('userId')){
            this.$router.push({path:'/editarticle',query:{id:id}});
          }
        },
        // 根据条件查询评论
        getCommentToCondition (judge_rank_type) {
          this.judge_rank_type = judge_rank_type;
          this.judgeList = []
          this.get_judge_data()
        },
        load_more(){//加载更多
          this.judgeParam.pageNum = this.judgeParam.pageNum + 1;
          this.get_judge_data()
        },
        // 查询文章评论
        get_judge_data(){
          this.judgeParam.sourceId = this.$route.query.id;
          this.judgeParam.orderType = this.judge_rank_type;
          this.$post('comment/pageQueryByCommentsReply', this.judgeParam).then((res) =>{
            if(res.data.data && res.data.data.list.length > 0){
              if(this.judgeList.length < 1){
                this.judgeList = res.data.data.list;
                this.judgeTotal = res.data.data.total
              }else{
                this.judgeList = this.judgeList.concat(res.data.data.list)
              }
              if(res.data.data.list.length < this.judgeParam.pageSize){
                this.showMore = false
              }
            }else{
              this.showMore = false
            }
          });
        },
        check_user_artical_sopport(){//查询用户点赞文章的情况
          var param = {};
          param.userId = Cookies.get("userId");
          param.supportableId = this.$route.query.id;
          param.supportableType = "App\\Models\\Article";
          this.$post('support/selectSupportsBySourceId', param).then((res) =>{
            this.isReco = res.data.data;
          });
        },
        //
        support_not_artic(){//点赞 或取消点赞文章，推荐或取消推荐文章
          if(this.handleLoginActive()){
            var param = {
              userId:Cookies.get("userId"),
              supportableId:this.$route.query.id,
              supportableType:'App\\Models\\Article'
            };
            if(this.isReco){//取消点赞文章
              this.$post('support/cancelSupports',param).then((res)=>{
                if(res.data.data){
                  this.isReco = false
                  this.articleData.supports -= 1
                }
              });
            }else{//点赞文章
              this.$post('support/addSupports',param).then((res)=>{
                if(res.data.data){
                  this.isReco = true
                  this.articleData.supports++
                }
              });
            }
          }
        },
        check_collect_state(){// 查询 用户是否收藏了文章
          var param = {};
          param.userId = Cookies.get("userId");
          param.sourceId = this.articleData.id;
          param.sourceType = "App\\Models\\Article";

          this.$post('collection/selectCollectionsBySourceId', param).then((res) =>{
            Vue.set(this.articleData,"collect_state",res.data.data);
          });
        },
        collect_artic(){//取消收藏操作
          if(this.handleLoginActive()){
            var param = {
              userId:Cookies.get("userId"),
              sourceId:this.articleData.id,
              sourceType:'App\\Models\\Article'
            };
            if(this.articleData.collect_state){//取消收藏

              this.$post('collection/cancelCollections',param).then((res)=>{
                if(res.data.data){
                  this.articleData.collect_state = false;
                }
              });
            }else{//收藏
              this.$post('collection/addCollections',param).then((res)=>{
                if(res.data.data){
                  this.articleData.collect_state = true;
                }
              });
            }
          }
        },
        contentChange () {
          this.commentContent = this.commentContent.substring(0, 300);
          this.countNum = this.commentContent.length
        },
        // 提交评论
        submitContent () {
          if(this.handleLoginActive()){
            var param = {};
            param.userId = Cookies.get("userId");
            param.content = this.commentContent.trim();
            param.sourceId = this.articleData.id;
            param.sourceType = "App\\Models\\Article";
            param.type = "add";
            if(param.content == ""){
              this.error("内容不能为空");
              return;
            }
            this.$post('comment/addUpdateComments',param).then((res)=>{
              if(res.data.success){
                this.getFirstComment();
                this.success("评论成功")
                this.commentContent = '';
              }else{
                this.error("评论失败")
              }
            });
          }
        },
        getFirstComment(){
          this.judgeParam.sourceId = this.articleData.id;
          this.judgeParam.orderType = 'new';
          this.$post('comment/selectCommentsByPage', this.judgeParam).then((res) =>{
            if(res.data.data.list[0]){
              this.judgeList.push(res.data.data.list[0])
            }
          });
        },
        handleLoginActive(){
          if(this.$cookie.get('isSightseer') === 'true'){
            this.$store.state.login.isSightseer = !this.$store.state.login.isSightseer;
            return false;
          }else if(this.$cookie.get('isActive') !== 'true'){
            this.$store.state.login.isActivated = !this.$store.state.login.isActivated;
            return false;
          }else{
            return true;
          }
        },
        //显示隐藏二级评论
        toggle_back(sourceId,index){
          if(this.handleLoginActive()) {
            this.SecondCommentIndex = this.SecondCommentIndex === index ? '' : index;
            if(this.SecondCommentIndex === index) {
              this.secondCommentList = [];
              this.twoLeveParam.pageNum = 1;
              this.get_twoleve_judge(sourceId)
            }
          }
        },
        // 二级评论加载更多
        get_twoleve_judge_more(sourceId){
          this.twoLeveParam.pageNum = this.twoLeveParam.pageNum + 1;
          this.get_twoleve_judge(sourceId);
        },
        get_twoleve_judge(sourceId){//获取二级评论的内容
          var param = {
            pageSize:this.twoLeveParam.pageSize,
            pageNum:this.twoLeveParam.pageNum,
            sourceType:'App\\Models\\Comment',
            sourceId:sourceId,
            orderType:'new'
          };

          this.$post('comment/selectCommentsByPage', param).then((res) =>{
            if(res.data.data.list.length > 0){
              if(this.secondCommentList.length > 0){
                this.secondCommentList = this.secondCommentList.concat(res.data.data.list)
              }else{
                this.secondCommentList = res.data.data.list
              }
            }
          });
        },
        submit_inner_judge(item){//提交二级评论的回复
          var param = {};
          param.userId = Cookies.get("userId");
          param.content = this.secondComment.trim();
          param.sourceId = item.id;
          param.toUserId = item.userId;
          param.sourceType = "App\\Models\\Comment";
          if(param.content == ""){
            this.error("内容不能为空");
            return;
          }
          this.$post('comment/replyComment', param).then((res) =>{
            if(res.data.success){
              this.success("回复成功");
              this.secondComment = "";
              this.getTwoCommentFirst(item.id)
            }else{
              this.error("回复失败")
            }
          });
        },
        // 获取第一条二级评论
        getTwoCommentFirst(sourceId){
          var param = {
            pageSize:10,
            pageNum:1,
            sourceType:'App\\Models\\Comment',
            sourceId:sourceId,
            orderType:'new'
          };
          this.$post('comment/selectCommentsByPage', param).then((res) =>{
            this.secondCommentList.push(res.data.data.list[0]);
          });
        },
        support_judge(val){//点赞某个评论,
          //评论列表点赞，和回答列表，冒泡列表点赞，都有返回是否点赞标志，只可以点赞不可以取消
          if(this.handleLoginActive()){
            if (!val.hasSupport) {
              this.addSupportsParams.userId = Cookies.get('userId');
              this.addSupportsParams.supportableId = val.id;
              this.addSupportsParams.supportableType = 'App\\Models\\Comment';
              this.$post('support/addSupports',this.addSupportsParams).then((res)=>{
                if (res.data.data) {
                  val.hasSupport = true;
                  val.supports = val.supports + 1;
                }
              });
            }
          }
        },
        success(nodesc){
          this.$Message.success(nodesc);
        },
        error(nodesc){
          this.$Message.error(nodesc);
        },
        toArticle(){
          if(this.handleLoginActive()){
            this.$router.push({path:'/editarticle'});
          }
        },
        putLinkRecord () {
          let param = {
            userId: Cookies.get("userId"),
            sourceId: this.articleData.id,
            sourceType: 'ARTICLE',
            jumpUrl: 'https://www.gupaoedu.com/course-java.html'
          }
          this.$post('channel/add',param).then((res)=>{
          })
        }
      },
      watch: {
        '$route'(to,from){
          if(to.name === from.name && to.query.id !== from.query.id){
            this.judgeList = [];
            this.judgeTotal = 0;
            this.judgeParam.pageNum = 1;
            this.SecondCommentIndex = '';
            this.get_artic_data(); // 获取文章内容
            this.get_judge_data();// 获取文章评论
            this.get_similar_artic();
            this.$nextTick(()=>{
              document.body.scrollTop = document.documentElement.scrollTop = 0
            })
          }
        }
      }

    }
</script>

<style scoped>
  @import './articleContent.css';
</style>

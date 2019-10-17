import Vue from 'vue';
import iView from 'iview';
import axios from 'axios';
import Cookies from "js-cookie";
import qs from 'qs';
Vue.use(iView);


const state={
	private_mes_pa:{//私信的参数
//		content:"",
//		fromUserId:"",
//		toUserId:"",
	},
	private_res:[],
	reportParam:{//举报的参数
//		id:"",
//		userId:"",
//		sourceId:"",
//		sourceType:"",
//		reportType:"",
//		description:"",
//		type:"",
	},
	reportRes:[],
	attenParam:{//关注参数
//		userId:"",
//		sourceId:"",
//		sourceType:"",
	},
	attenDetailRes:{},
  attenState:false,//是否关注
	attenRes:[],
	cancelAttPas:{//取消关注参数
		userId:"",
		sourceId:'',
		//id:'',
		sourceType:''
	},
	cancelAttres:[],//取消关注的结果
	attenDetal:{//用户关注的情况
		userId:"",
		sourceId:"",
		sourceType:"",
	},
	attenDetalRes:{},
	cancel_colect:{//取消收藏
//		userId:"",
//		id:''
	},
	cancel_cole_res:[],
	colectDetail:{//收藏情况
//		userId:"",
//		sourceId:"",
//		sourceType:"",
	},
	colectDetalres:false,
	collectActionParam:{//收藏动作参数
		//id:"",
		userId:"",
		sourceId:"",
		sourceType:"",
	},
	colelectRes:[],
	supportParam:{
//		userId:"",
//		supportableId:"",
//		supportableType:"",
	},
	supportRes:[],
	qcAddJudge:{//添加评论
		userId:"",
		content:"",
		sourceId:"",
		toUserId:"",
		sourceType:"",
	},
	addJudgeRes:[],
	tec_type_param:{//技术分类参数
    type:'',
		pageNum:"1",
		pageSize:"20"
	},
	tec_list:[],
	them_search_par:{//热门话题查询
		//name:''
	},
	them_list:[],
	questionWords:{//提问的内容参数
		userId:'',       //必填
		title:'',		//必填
		description:'',
		price:'',
		categoryId:'',
		type:'',
		hide:'',
		tagsList:[

		]
	},
  articleWords:{
    userId:'',       //必填
    title:'',		//必填
    content:'',//必填
    summary:'',
    categoryId:'',
    type:'',
    tagsList:[
    ]
  },
	questres:[],
	code_res:[],
  captchakey:'',
	checke_coderes:[],//验证验证码的结果
  notitc_read_res:[],//通知提醒标记已读的结果
  private_read_res:[],//私信消息标记已读的结果
  detailList:[]
}

const mutations={
	sendPrivatMes(state){//发私信动作

    Vue.prototype.$post('message/addMessages', state.private_mes_pa).then((res) =>{
      state.private_res=res.data;
    });
	},
	reportAction(state){//举报新增修改接口
    Vue.prototype.$post('report/addUpdateReports', state.reportParam).then((res) =>{
      state.reportRes=res;
      if(res.data.message=='成功'){
        iView.Message.success({
          content:'举报成功'
        })
      }
    });
	},
	cancellAtt(state){//取消关注的动作
    Vue.prototype.$post('attention/cancelAttentions', state.attenParam).then((res) =>{
      state.attenDetailRes = res.data;
    });
	},
	attenAction(state){
    Vue.prototype.$post('attention/addAttentions', state.attenParam).then((res) =>{
      state.attenDetailRes = res.data;
    });
	},
	cancel_colect_ac(state){//取消收藏
    Vue.prototype.$post('collection/cancelCollections', state.attenParam).then((res) =>{
      state.cancel_cole_res = res;
    });
	},
	collectAction(state){
    Vue.prototype.$post('collection/addCollections', state.collectActionParam).then((res) =>{
      state.colelectRes = res;
    });
	},
	attenDetail(state){//根据用户id关注类型查询关注详情
    Vue.prototype.$post('attention/selectAttentionsBySourceId', state.attenDetal).then((res) =>{
      state.attenDetalRes = res.data;
    });
	},
	collecDetail(state){
    Vue.prototype.$post('collection/selectCollectionsBySourceId', state.colectDetail).then((res) =>{
      state.colectDetalres = res.data.data;
    });
	},
	supportAction(state){
    Vue.prototype.$post('support/addSupports', state.supportParam).then((res) =>{
      state.supportRes = res.data.data;
    });
	},
	qcAddJudge(state){
    Vue.prototype.$post('comment/replyComment', state.qcAddJudge).then((res) =>{
      state.addJudgeRes = res.data.data;
    });
	},

	getTecList(state){
    Vue.prototype.$post('category/selectCategoryByPage', state.tec_type_param).then((res) =>{
      state.tec_list = res.data.data.list;
    });
	},
	getThem(state){
    Vue.prototype.$post('tag/pageQuery', state.them_search_par).then((res) =>{
      state.them_list = res.data.data.list;
    });
	},
	mack_quest(state,obj){
		state.questionWords=obj;
    Vue.prototype.$appost('question/addUpdateQuestions', state.questionWords).then((res) =>{
      state.questres = res.data;
    });
	},
	edit_article(state,obj){
		state.articleWords=obj;
    Vue.prototype.$appost('article/addUpdateArticles', state.articleWords).then((res) =>{
      state.questres = res.data;
    });
	},
	get_code(state){

		axios({
			url:"/captcha/get",
			method:"GET",
      responseType: "arraybuffer"
		}).then((res)=>{
			//console.log(res,"验证码结果");
			state.code_res=res.data;
			state.captchakey = res.headers.captchakey;
		}).catch((err)=>{
			//console.log(err)
		})
	},
	check_code(state,obj){
		var captchaKey=obj.captchaKey;
		var captcha=obj.captcha;
    Vue.prototype.$get('/captcha/verity', {
      captchaKey: captchaKey,
      captcha:captcha
    }).then((res) =>{
      state.checke_coderes = res.data;
    });

	},
  update_notitc_read(state,obj){
    Vue.prototype.$get('/notifications/updateReadByUserId', {
      userId: obj.userid,
    }).then((res) =>{
      state.notitc_read_res = res.data;
    });
  },
  update_private_read(state,obj){

    Vue.prototype.$get('/message/updateReadByUserId', {
      userId: obj.userid,
    }).then((res) =>{
      state.private_read_res = res.data;
    });
  },
  selectArticlesById(state,id){
    Vue.prototype.$get('/article/selectArticlesById', {
      id: id,
    }).then((res) =>{
      state.detailList = res.data.data.articleInfo;
    });
  },
}
const getters={}
const actions={
	cancel_colect_ac({commit}){//取消收藏动作
		commit("cancel_colect_ac");
	},
	sendPrivatMes({commit}){//发私信动作
		commit("sendPrivatMes");
	},
	reportAction({commit}){//举报动作
		commit("reportAction");
	},
	cancellAtt({commit}){//取消关注动作
		commit("cancellAtt");
	},
	attenAction({commit}){//关注动作
		commit("attenAction");
	},
	attenDetail({commit}){//关注详情
		commit("attenDetail");
	},
	collecDetail({commit}){//收藏详情
		commit("collecDetail");
	},
	collectAction({commit}){//收藏动作
		commit("collectAction");
	},
	supportAction({commit}){//点赞动作
		commit("supportAction");
	},
	qcAddJudge({commit}){//评论动作
		commit("qcAddJudge");
	},
	getTecList({commit}){//技术分类
		commit("getTecList");
	},
	getThem({commit}){//模糊查询话题
		commit("getThem")
	},
	mack_quest({commit},obj){//提问的结果
		commit('mack_quest',obj);
	},
  edit_article({commit},obj){//发布文章的结果
    commit('edit_article',obj);
  },
	get_code({commit}){//获取验证码
		commit("get_code")
	},
	check_code({commit},obj){//检查验证码
		commit("check_code",obj);
	},
  update_notitc_read({commit},obj){//通知提醒标记已读
    commit("update_notitc_read",obj);
  },
  update_private_read({commit},obj){//私信消息标记已读
    commit("update_private_read",obj);
  },
  selectArticlesById({commit},id){
    commit('selectArticlesById',id)
  },
}

export default{
	state,
	mutations,
	getters,
	actions
}

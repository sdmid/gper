import Vue from 'vue'
import iView from 'iview';
import axios from 'axios'
import Cookies from "js-cookie"
Vue.use(iView);



const state={

  userInfoParams:{

  },
  otheruserInfoData:{},
  usersUpdataParams:{
//  id:'',
//  gender:'',
//  city:'',
//  qrcode:'',
//  mobile:'',
//  title:'',
//  description:''
  },
  usersUpdataData:{},

  imgUploadParams:{
//  type:'',
//  file:''
  },
  updatePwdByOriginalPwdParams:{
    id:'',
    password:'',
    newPassword:'',
    confirmPassword:'',
  },
  updatePwdRes:{},
  queryProvinceListData:[],
  queryCityListData:[],

  doingsPageQueryParams:{
  userId:'',
  page:'1',
  pageSize:'10'
  },
  doingsPageQueryData:[],

  pageQueryByCoinsParams:{
//  userId:'',
  page:'1',
  pageSize:'10'
  },
  pageQueryByCoinsData:{},
  pageQueryByCreditsParmas:{
   userId:'',
   page:'1',
   pageSize:'10'
  },
  pageQueryByCreditsData:{},
	myArticalParam:{//我的文章列表参数
//		userId:'',
//		title:'',
//		startTime:'',
//		endTime:'',
//		status:'',
//		categoryId:'',
//		orderType:'',
//		pageNum:'',
		pageSize:'10',
	},
	myArticalList:[],
	fansParam:{//粉丝列表参数
		userId:"",
		sourceType:"fans",
		pageNum:"1",
		pageSize:"10",
	},
	fansList:[],
  talkParam:{//私信列表参数
    userId:"",
    pageNum:"1",
    pageSize:"10",
  },
  talkList:[],
  deltalkParam:{//私信删除参数
    fromUserId:"",
    userId:""
  },
  deltalkList:[],

  deltalkByIdParam:{//私信单个删除参数
    id:"",
    type:"toDeleted"
  },
  deltalkByIdList:[],

	bind_res:[],//刚进页面查询绑定qq信息
	unbind_res:null,//解绑的返回结果
	bind_params:{//绑定的参数
		authCode:"",
		userId:"",
		authType:"QQ",
	},
	bind_act_res:null,//绑定动作的结果


  redeemQueryParmas:{
    userId:"",
    page:"1",
    pageSize:"10",
  },
  redeemInfoData:[],
  redeemInfoData_total:0,
  queryCityListParams:{
    provinceId:''
  },
  collectionQueryParmas:{
    userId:"",
    pageNum:"1",
    pageSize:"10",
    sourceType:"",
  },
  collectionResult:[],
  auditArticleParmas:{
    userId:'',
    page:"1",
    pageSize:"10",
  },
  auditArticleResult:[],
  auditQuestionParmas:{
    userId:'',
    page:"1",
    pageSize:"10",
  },
  auditQuestionResult:[],
  selectAnswersByPageParams:{},
  selectAnswersByPageList:[]
}

const getters={

}

const mutations={
	bind(state){
		state.bind_params.userId=Cookies.get("userId");

    Vue.prototype.$post('/3rd/bind', state.bind_params).then((res) =>{
      state.bind_act_res = res.data;
    });
	},
	release_bind(state,atype){//解绑某个第三方软件
		var userId=Cookies.get("userId");
		var obj={};
		obj.userId=userId;
		obj.authType=atype;

    Vue.prototype.$post('/3rd/unbind', obj).then((res) =>{
      state.unbind_res = res;
    });
	},
	get_buding_mes(state){//获取是否绑定了qq等
		var userId=Cookies.get("userId");
    Vue.prototype.$get('/3rd/queryListByUserId', {
      userId: userId,
    }).then((res) =>{
      state.bind_res = res.data;
    });
	},
	fansList(state){
    Vue.prototype.$post('attention/selectAttentionByType', state.fansParam).then((res) =>{
      state.fansList = res.data.data.list;
      state.fansList.total = res.data.data.total;
    });
	},
  talkList(state){
    Vue.prototype.$post('message/pageQuery', state.talkParam).then((res) =>{
      state.talkList = res.data.data.list;
      state.talkList.total = res.data.data.total;
    });
  },
  del_private_state(state){
    Vue.prototype.$post('message/deleteMessagesByUserId', state.deltalkParam).then((res) =>{
      state.deltalkList = res.data;
    });
  },
  del_private_stateById(state){
    Vue.prototype.$post('message/deleteMessagesById', state.deltalkByIdParam).then((res) =>{
      state.deltalkByIdList = res.data;
    });
  },
 	myArticList(state){//'article/selectArticlesByPage'
    Vue.prototype.$post('article/selectArticlesByPage', state.myArticalParam).then((res) =>{
      state.myArticalList = res.data.data.list;
      state.myArticalList.total = res.data.data.total;
    });
 	},

  //修改个人资料  地址：users/update
  usersUpdata(state){
    Vue.prototype.$post('users/update', state.usersUpdataParams).then((res) =>{
      if(res.data.message === '成功'){
        iView.Message.success('修改成功');
      }
      state.usersUpdataData = res.data;
    });
  },
  updatePwdByOriginalPwd(state){// 修改密码  地址：users/updatePwdByOriginalPwd
    Vue.prototype.$post('users/updatePwdByOriginalPwd', state.updatePwdByOriginalPwdParams).then((res) =>{
      state.updatePwdRes = res.data;
    });
  },

  //查询省份  地址：/areas/queryProvinceList
  queryProvinceList(state){
    Vue.prototype.$get('/areas/queryProvinceList', {}).then((res) =>{
      state.queryProvinceListData = res.data.data;
    });
  },
  //查询城市 地址：queryCityList/{provinceId}
  queryCityList(state){
    Vue.prototype.$get('areas/queryCityList', state.queryCityListParams).then((res) =>{
      state.queryCityListData = res.data.data;
    });
  },

  //个人主页最近动态  地址：doings/pageQuery
  doingsPageQuery(state,id){
  	state.doingsPageQueryParams.userId=id;
    Vue.prototype.$post('doings/pageQuery', state.doingsPageQueryParams).then((res) =>{
      state.doingsPageQueryData = res.data.data.list;
      if(res.data.data.total){
        state.doingsPageQueryData.total = res.data.data.total;
      }
    });
  },
  //个人主页我的金币  地址：credits/pageQueryByCoins
  pageQueryByCoins(state){
    Vue.prototype.$post('credits/pageQueryByCoins', state.pageQueryByCoinsParams).then((res) =>{
      state.pageQueryByCoinsData = res.data.data;
    });
  },
  //个人主页我的经验 地址：credits/pageQueryByCredits
  pageQueryByCredits(state){
    Vue.prototype.$post('credits/pageQueryByCredits', state.pageQueryByCreditsParmas).then((res) =>{
      state.pageQueryByCreditsData = res.data.data;
    });
  },
  //获取用户信息  地址：/users/getUserInfo/{userId}-{operateUid}
  othergetUserInfo(state,uid){
    var userId = '';
  	if(uid){
      userId=uid;
    }else{
      userId = Cookies.get("userId");
    }
  	var operateUid=Cookies.get("userId");

    Vue.prototype.$get('/users/getUserInfo', {
      userId: userId,
      operateUid: operateUid
    }).then((res) =>{
      state.otheruserInfoData = res.data;
    });
  },
  redeemUserInfo(){
    Vue.prototype.$post('/exchange/pageQueryByUserId', state.redeemQueryParmas).then((res) =>{
      state.redeemInfoData = res.data.data.list;
      state.redeemInfoData_total = res.data.data.total;
    });
  },
  selectCollection(){
    Vue.prototype.$post('collection/selectCollectionByPage', state.collectionQueryParmas).then((res) =>{
      state.collectionResult = res.data.data;
    });
  },
  getAuditArticle(){
    Vue.prototype.$post('article/auditArticleList', state.auditArticleParmas).then((res) =>{
      state.auditArticleResult = res.data.data;
    });
  },
  getAuditQuestion(){
    Vue.prototype.$post('question/auditQuestionList', state.auditQuestionParmas).then((res) =>{
      state.auditQuestionResult = res.data.data;
    });
  },
}

const actions={
	bind({commit}){
    commit('bind')
  },
	release_bind({commit},atype){
    commit('release_bind',atype)
  },
	get_buding_mes({commit}){
    commit('get_buding_mes')
  },
	othergetUserInfo({commit},uid){
    commit('othergetUserInfo',uid)
  },
	fansList({commit}){
		commit('fansList');
	},
  talkList({commit}){
    commit('talkList');
  },
  del_private_state({commit}){
    commit('del_private_state');
  },
  del_private_stateById({commit}){
    commit('del_private_stateById');
  },
 	myArticList({commit}){
	 	commit('myArticList')
	 },
  usersUpdata({commit}){
    commit('usersUpdata')
  },
  updatePwdByOriginalPwd({commit}){
    commit('updatePwdByOriginalPwd')
  },
  queryProvinceList({commit}){
    commit('queryProvinceList')
  },
  queryCityList({commit}){
    commit('queryCityList')
  },
  doingsPageQuery({commit},id){//最新动态
    commit('doingsPageQuery',id)
  },
  pageQueryByCoins({commit},id){
    state.pageQueryByCoinsParams.userId = id;
    commit('pageQueryByCoins')
  },
  pageQueryByCredits({commit},id){
    state.pageQueryByCreditsParmas.userId = id;
    commit('pageQueryByCredits')
  },
  redeemUserInfo({commit},id){
    commit('redeemUserInfo')
  },
  selectCollection({commit},id){
    commit('selectCollection')
  },
  getAuditArticle({commit},id){
    commit('getAuditArticle')
  },
  getAuditQuestion({commit},id){
    commit('getAuditQuestion')
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}

import Vue from 'vue'
import iView from 'iview';
import axios from 'axios'
import Cookies from "js-cookie"
import qs from 'qs'
Vue.use(iView);


const state = {
	answerParams:{
    userId:'',
    tagIds:'',
    pageNum:'1',
    orderType:'new',
    pageSize:'20',
    categoryId:'',
  },
  answerList:[],

  detailPrams:{
//	id:'',
  },
  detailList:[],


  similarQuestionParams:{
	questionId:'',
	pageNum:1,
	pageSize:10,
  },
  quest_total:0,
  answer_current_page:1,
  similarQuestionList:[],

  privateQuestionParams:{
    pageNum:'1',
    pageSize:'10',
    id:''
  },
  privateQuestionList:[],
  privateQuestionList_total:0,
  selectAnswersByPageParams:{
//	userId:'',
//	questionId:'',
//	startTime:'',
//	endTime:'',
//	status:'',
//	orderType:'',
    pageNum:'1',
    pageSize:'10',
  },
  selectAnswersByPageList:[],

  selectTaskListByUserIdParams:{

  },
  selectTaskListByUserIdData:[],
  answerQuesPara:{//回答问题上传的内容
  	userId:'',
  	content:'',
  	questionId:'',
  	followed:'',
  	type:'add',
  },
  answerQuesRes:[],
  answerModTemp:'',//问题富文本插件缓存变量
  addUpdateCommentsPamras:{
  	userId:'',
  	content:'',
  	sourceId:'',
  	sourceType:'',
  	type:''
  },
  answerResult:{},
  answerMkdmTemp:'',
  answerHtmlTemp:'',

  userAnswerParams:{
    questionId:'',
    userId:''
  },
  userAnswerQuestion:[]
};
const mutations = {
	answerQuestAct(state){
    Vue.prototype.$appost('answer/addUpdateAnswers', state.answerQuesPara).then((res) =>{
      state.answerQuesRes = res.data;
    });
	},
	//问题查询列表接口  地址：question/selectQuestionsByPage
	selectQuestionsByPage(state){
      Vue.prototype.$post('question/selectQuestionsByPage', state.answerParams).then((res) =>{
        if(res.data.success){
          state.answerResult = res.data.data;
          state.answerList = res.data.data.list;
          state.quest_total = res.data.data.total;
          state.answerList.total = res.data.data.total;
          state.answer_current_page = res.data.data.pageNum;
        }
      });
	},
	//问题查询详情接口  地址：question/selectQuestionsById?id={id}
	selectQuestionsById(state,id){
		state.detailPrams.id=id;
    Vue.prototype.$get('question/selectQuestionsById', {
      id: id,
    }).then((res) =>{
      state.detailList = res.data.data.questionInfo;
    });
	},
  //私信详情接口  地址：question/selectQuestionsById?id={id}
  selectMessageDetail(state){
    Vue.prototype.$post('message/pageQueryDetail', state.privateQuestionParams).then((res) =>{
      state.privateQuestionList = res.data.data.list;
      state.privateQuestionList_total = res.data.data.total;
    });
  },
	//问答相似问题  地址：question/similarQuestion
	similarQuestion(state, questionId){
		state.similarQuestionParams.questionId=questionId;
    Vue.prototype.$post('question/similarQuestion', state.similarQuestionParams).then((res) =>{
      state.similarQuestionList = res.data.data.list;
    });
	},
	// 回答查询列表接口 地址：answer/selectAnswersByPage
	selectAnswersByPage(state,id){
    state.selectAnswersByPageParams.userId=id;
    Vue.prototype.$post('answer/selectAnswersByPage', state.selectAnswersByPageParams).then((res) =>{
      state.selectAnswersByPageList = res.data.data.list;
      if(res.data.data.total){
        state.selectAnswersByPageList.total = res.data.data.total;
      }
    });
	},
	//查询新手任务列表用户完成状态接口  地址：newbietask/selectTaskListByUserId
	selectTaskListByUserId(state){
    state.selectTaskListByUserIdParams.userId = Cookies.get('userId');
    Vue.prototype.$get('newbietask/selectTaskListByUserId', state.selectTaskListByUserIdParams).then((res) =>{
      state.selectTaskListByUserIdData = res.data.data;
    });
	},
  getUserAnswer(state){
    state.userAnswerParams.userId = Cookies.get('userId');
    Vue.prototype.$post('answer/selectAnswersByQuestionAndUserId', state.userAnswerParams).then((res) =>{
      state.userAnswerQuestion = res.data.data;
    });
  }
};
const actions = {
  selectQuestionsByPage({commit},id){
    state.answerParams.userId=id;
    commit('selectQuestionsByPage')
  },
	selectQuestionsById({commit},id){
		commit('selectQuestionsById',id)
	},
  selectMessageDetail({commit},id){
    commit('selectMessageDetail',id)
  },
	similarQuestion({commit}, questionId){
		commit('similarQuestion', questionId)
	},
	selectAnswersByPage({commit},id){
		commit('selectAnswersByPage',id)
	},
	selectTaskListByUserId({commit}){
		commit('selectTaskListByUserId')
	},
	answerQuestAct({commit}){
		commit('answerQuestAct')
	},
  getUserAnswer({commit}){
    commit('getUserAnswer')
  },
	// addUpdateComments({commit}){
	// 	commit('addUpdateComments')
	// }
};
const getters = {

};
export default {
  state,
  mutations,
  actions,
  getters
}

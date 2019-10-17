import Vue from "vue"
import iView from "iview"
import Cookies from "js-cookie"

Vue.use(iView);

const state = {
  categoryParams:{
    type:'questions',
    pageNum:'1',
    pageSize:'20',
  },
  categoryResult:{},
  hotTagParams:{
		pageNum:'1',
		pageSize:'20'
  },
  hotTagResult:{},
  answerParams:{
    pageNum:'1',
    pageSize:'10'
  },
  answerResult:{},
  hotQuestionParams:{
    categoryId:'',
    orderType:'hot',
    pageNum:'1',
    pageSize:'20'
  },
  hotQuestionResult:{},
  signResult:{}
};

const mutations = {
  //技术分类查询列表接口
  getCategory(state) {
    Vue.prototype.$post('category/selectCategoryByPage', state.categoryParams).then((res) =>{
      state.categoryResult = res.data;
    });
  },
  //热门标签查询列表接口
  getHotTags(state) {
    Vue.prototype.$post('tag/pageQueryByHotTags', state.hotTagParams).then((res) =>{
      state.hotTagResult = res.data;
    });
  },
  //问题查询列表接口
  /*selectQuestionsByPage(state){
    console.log(456);
    Vue.prototype.$post('question/selectQuestionsByPage', state.answerParams).then((res) =>{
      state.answerResult = res.data.data;
    });
  },*/
  //热门问答列表接口
  selectHotQuestions(state){
    Vue.prototype.$post('question/selectQuestionsByPage', state.hotQuestionParams).then((res) =>{
      state.hotQuestionResult = res.data.data;
    });
  },
  //签到动作
  todaySign(state){
    Vue.prototype.$get('users/sign', {
      userId: Cookies.get("userId"),
    }).then((res) =>{
      state.signResult = res.data;
    });
  },
  //根据分类id查询标签接口
  selectTagByCategoryId(state){
    Vue.prototype.$post('tag/pageQueryByCategoryId', state.hotQuestionParams).then((res) =>{
      state.hotTagResult = res.data;
    });
  }
}

const actions = {
  getCategory({commit},param){
    commit("getCategory",param);
  },
  getHotTags({commit},param){
    commit("getHotTags",param);
  },
  /*selectQuestionsByPage({commit},param){
    commit("selectQuestionsByPage",param);
  },*/
  selectHotQuestions({commit},param){
    commit("selectHotQuestions",param);
  },
  todaySign({commit},param){
    commit("todaySign",param);
  },
  selectTagByCategoryId({commit},param){
    commit("selectTagByCategoryId",param);
  },
}

const getter = {}

export default {
  state,
  mutations,
  actions,
  getter
}

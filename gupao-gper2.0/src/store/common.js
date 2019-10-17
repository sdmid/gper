import Vue from "vue"
import iView from "iview"
import Cookies from "js-cookie"

Vue.use(iView);

const state = {
  topListParams:{
    page:1,
    pageSize:5,
    orderType:'',
    timeType:''
  },
  topListResult:{
    dataL:''
  },
  addUpdateCommentsParams:{
    userId:'',
    content:'',
    sourceId:'',
    sourceType:'',
    type:''
  },
};

const mutations = {

  //作家榜，解答榜，悬赏榜接口
  getTopList(state){
    Vue.prototype.$post('top/pageQuery', state.topListParams).then((res) =>{
      state.topListResult = res.data;
    });
  },
  //评论新增修改接口  地址：comment/addUpdateComments
  addUpdateComments(state){
    Vue.prototype.$post('comment/addUpdateComments', state.addUpdateCommentsParams).then((res) =>{

    });
  },
}

const actions = {
  getTopList({commit},param){
    commit("getTopList",param);
  },
  addUpdateComments({commit},param){
    commit("addUpdateComments",param);
  },
}

const getter = {}

export default {
  state,
  mutations,
  actions,
  getter
}

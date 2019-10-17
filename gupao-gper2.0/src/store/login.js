import Vue from "vue"
import iView from "iview"
import Cookies from "js-cookie"

Vue.use(iView);

const state = {
  //注册接口参数
  registParams:{},
  registResult:{},
  userResult:{
    data:{
      vipSign:false
    }
  },
  noticeResult:{},
  privateResult:{},
  isSightseer:true,
  isActivated:true
};

const mutations = {
  toRegist(state,param){ //注册接口
    state.registParams = param;
  },
  getUserInfo(state) {
    Vue.prototype.$get('/users/getUserInfo', {
      userId: Cookies.get("userId"),
      operateUid: Cookies.get("userId")
    }).then((res) =>{
      state.userResult = res.data;
    });
  },
  getNoticeNum(state) {
    Vue.prototype.$get('notifications/getUnReadCount', {
      userId: Cookies.get("userId")
    }).then((res) =>{
      state.noticeResult = res.data;
    });
  },
  getPrivateMesNum(state) {
    Vue.prototype.$get('message/getUnReadCount', {
      userId: Cookies.get("userId")
    }).then((res) =>{
      state.privateResult = res.data;
    })
  },
}

const actions = {
  toRegist({commit},param){
    commit("toRegist",param);
  },
  getUserInfo({commit},param){
    commit("getUserInfo",param);
  },
  getNoticeNum({commit},param){
    commit("getNoticeNum",param);
  },
  getPrivateMesNum({commit},param){
    commit("getPrivateMesNum",param);
  },
}

const getter = {}

export default {
  state,
  mutations,
  actions,
  getter
}

import Vue from 'vue'
import iView from 'iview';
import axios from 'axios'
import Cookies from "js-cookie"
Vue.use(iView);


const state={
	qqLoginParams:{
		authCode:''
	},
  qqLoginRes:'',
  qqRegisterParams:{
    openId:'',
    authType:'QQ',
    name:'',
    email:''
  },
  qqRegisterRes:''
}

const mutations={
	// QQ登陆 /3rd/login/qq
  qqLogin(state){
    Vue.prototype.$post('/3rd/login/qq', state.qqLoginParams).then((res) =>{
      state.qqLoginRes = res.data;
    });
	},
  qqRegister(state,params){
    Vue.prototype.$post('/3rd/qqregister', params).then((res) =>{
      state.qqRegisterRes = res.data;
    });
  },

}
const getters={}
const actions={
	qqLogin({commit}){
		commit("qqLogin");
	},
  qqRegister({commit},param){
    commit("qqRegister",param)
  },
}

export default{
	state,
	mutations,
	getters,
	actions
}

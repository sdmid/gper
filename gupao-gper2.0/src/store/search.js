import Vue from 'vue';
import Cookies from "js-cookie"

const state={
  se_answer_pa:{//搜索问题的参数
    word:"",
    page:1,
    pageSize:10
  },
  se_answer_res:[],
  se_artic_pa:{//搜索文章的参数
    word:"",
    page:1,
    pageSize:10
  },
  se_artic_res:[],
  se_tag_pa:{//搜索标签的参数
    word:"",
    page:1,
    pageSize:10
  },
  se_tag_res:[],
  se_user_pa:{//搜索用户的参数
    word:"",
    page:1,
    pageSize:10
  },
  se_user_res:[],
  search_total:0
}
const mutations={
  se_answer(state){//搜索问答动作
    Vue.prototype.$post('search/questions', state.se_answer_pa).then((res) =>{
      if(res.data.success){
        state.se_answer_res = res.data.data.list;
        state.search_total = res.data.data.total;
      }
    });

  },
  se_artic(state){//搜索文章动作
    Vue.prototype.$post('search/articles', state.se_artic_pa).then((res) =>{
      if(res.data.success){
        state.se_artic_res = res.data.data.list;
        state.search_total = res.data.data.total;
      }
    });

  },
  se_tag(state){//搜索标签动作
    Vue.prototype.$post('search/tags', state.se_tag_pa).then((res) =>{
      if(res.data.success){
        state.se_tag_res = res.data.data.list;
        state.search_total = res.data.data.total;
      }
    });

  },
  se_user(state){//搜索用户动作
    Vue.prototype.$post('search/users', state.se_user_pa).then((res) =>{
      if(res.data.success){
        state.se_user_res = res.data.data.list;
        state.search_total = res.data.data.total;
      }
    });
  }
}
const getters={}
const actions={
  se_answer({commit}){
    commit("se_answer");
  },
  se_artic({commit}){
    commit("se_artic");
  },
  se_tag({commit}){
    commit("se_tag");
  },
  se_user({commit}){
    commit("se_user");
  }
}

export default{
  state,
  mutations,
  getters,
  actions
}



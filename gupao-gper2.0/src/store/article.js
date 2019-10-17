import Vue from 'vue'
import iView from 'iview';
import axios from 'axios'
Vue.use(iView);


const state = {
  authorParam:{//热门作者查询参数
    orderType:'article',
    //timeType:'',
    page:1,
    pageSize:10,
  },
  authorRes:[],
  aticParams:{
//	    userId:'',
//	    title:'',
//	    startTime:'',
//	    endTime:'',
//	    status:'',
//	    categoryId:'',
    orderType:'hot',
    pageNum:'1',
    pageSize:'20',
  },
  articalsList:[],
  hot_total:0,
  aticNewParams:{
//	    userId:'',
//	    title:'',
//	    startTime:'',
//	    endTime:'',
//	    status:'',
//	    categoryId:'',
    orderType:'new',
    pageNum:'1',
    pageSize:'20',
  },
  new_total:0,
  articalNewsList:[],
  hotTipParams:{
//		pageNum:"",
//		pageSize:""
  },
  hotTipData:[],
  articleModTemp:'',//文章富文本插件缓存变量

  articleMkdmTemp:'',
  articleHtmlTemp:'',

};
const mutations = {

  selectArticlesByPage(state){//查询热门文章

    Vue.prototype.$post('article/selectArticlesByPage', state.aticParams).then((res) =>{
      state.articalsList = res.data.data.list;
      state.hot_total = res.data.data.total;
    });
  },
  selectNewArticlesByPage(state){//查询最新文章
    Vue.prototype.$post('article/selectArticlesByPage', state.aticNewParams).then((res) =>{
      state.articalNewsList = res.data.data.list;
      state.new_total = res.data.data.total;
    });
  },
  selectHotTips(state){//热门标签
    Vue.prototype.$post('tag/pageQueryByHotTags', state.hotTipParams).then((res) =>{
      state.hotTipData = res.data.data.list;
    });
  },
  hotAuthors(state){//热门作者
    Vue.prototype.$post('top/pageQuery', state.authorParam).then((res) =>{
      state.authorRes = res.data.data.list;
    });
  }

};
const actions = {
  selectArticlesByPage({commit}){
    commit('selectArticlesByPage')
  },
  selectNewArticlesByPage({commit}){
    commit('selectNewArticlesByPage')
  },
  selectHotTips({commit}){//热门标签
    commit("selectHotTips")
  },
  hotAuthors({commit}){//热门作者
    commit("hotAuthors")
  },
};
const getters = {

};
export default {
  state,
  mutations,
  actions,
  getters
}

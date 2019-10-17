import Vue from 'vue'
import iView from 'iview';
import axios from 'axios'
import Cookies from 'js-cookie'
Vue.use(iView);



const state={
	bannerParam:{
		page:1,
		pageSize:5
	},
	bannerRes:[],
  picked:0,
  hotPageQueryParams:{
    pageNum:1,
    pageSize:20,
 		type:'question',
    orderType:'new',
  	categoryId:null
  },
  pageQueryData:[],
  selectReAByPageParams:{
    pageNum:1,
    pageSize:100,
  },
  selectReAByPageData:{},


  jobPageQueryParams:{
//  page:'',
//  pageSize:'',
  },
  jobPageQueryData:{},

  selectNoticesByPageParams:{
  pageNum:1,
  pageSize:10,
  },
  selectNoticesByPageData:{},

  AttentionByPersonalParams:{
//  userId:'',
  pageNum:'',
  pageSize:20,
  },
  AttentionByPersonalData:{

  },
  RecentlyJoinedParams:{
     page:1,
     pageSize:6,
  },
  recentlyJoinedData:{},

  selectCategoryByPageParams:{
    type:'questions',
    pageNum:'1',
    pageSize:'20',
  },
  selectCategoryByPageData:{},
  exchangePageQueryParams:{
     page:1,
     pageSize:10
  },
  exchangePageQueryData:[],
  signRes:'',
  home_teck_id:null,//首页的选中的技术频道的id
  attentotal:0,
  recomtotal:0
}

const getters={

}

const mutations={
  getBanner(state){//查询banner

    Vue.prototype.$post('banner/pageQuery', state.bannerParam).then((res) =>{
      state.bannerRes = res.data.data.list;
    });
  },
  //常用功能热门查询接口 地址：hot/pageQuery
  hotPageQuery(state){//查询热门文章
  	state.hotPageQueryParams.categoryId=state.home_teck_id;
    Vue.prototype.$post('hot/pageQuery', state.hotPageQueryParams).then((res) =>{
      if(state.hotPageQueryParams.pageNum == 1){
        state.pageQueryData = res.data.data.list;
      }else{
        res.data.data.list.forEach((val)=>{
          state.pageQueryData.push(val);
        });
        state.pageQueryData.total = res.data.data.total;
      }
    });
  },
  // 首页推荐查询列表接口  地址：recommendation/selectRecommendationsByPage
  selectRecommendationsByPage(state){//查询推荐文章
    state.selectReAByPageParams.categoryId=state.home_teck_id;

    Vue.prototype.$post('recommendation/selectRecommendationsByPage', state.selectReAByPageParams).then((res) =>{
      if(state.selectReAByPageParams.pageNum == 1){
        state.selectReAByPageData = res.data.data;
      }else{
        res.data.data.list.forEach((val)=>{
          state.selectReAByPageData.list.push(val);
        });
      }
      state.selectReAByPageData.recomtotal = res.data.data.total;
    });
  },

  // 常用功能关注接口  地址：attention/selectAttentionByPersonal
  AttentionByPersonal(state){
  	state.AttentionByPersonalParams.categoryId=state.home_teck_id;

    Vue.prototype.$post('attention/selectAttentionByPersonal', state.AttentionByPersonalParams).then((res) =>{
      if(state.AttentionByPersonalParams.pageNum == 1){
        state.AttentionByPersonalData = res.data.data;
      }else{
        res.data.data.list.forEach((val)=>{
          state.AttentionByPersonalData.list.push(val);
        });
      }
      state.AttentionByPersonalData.attentotal = res.data.data.total;
    });
  },

  //工作推荐  地址：recommend/job/pageQuery
  jobPageQuery(state){//查询热门文章
    state.jobPageQueryParams.page=1;
    state.jobPageQueryParams.pageSize=10;
    Vue.prototype.$post('recommend/job/pageQuery', state.jobPageQueryParams).then((res) =>{
      state.jobPageQueryData = res.data.data;
    });
  },

  //首页公告类表查询接口 地址：notice/selectNoticesByPage
  selectNoticesByPage(state){
    Vue.prototype.$post('notice/selectNoticesByPage', state.selectNoticesByPageParams).then((res) =>{
      state.selectNoticesByPageData = res.data.data;
    });
  },

  //最近加入 地址：users/pageQueryRecentlyJoined
  RecentlyJoined(state){
    Vue.prototype.$post('users/pageQueryRecentlyJoined', state.RecentlyJoinedParams).then((res) =>{
      state.recentlyJoinedData = res.data.data;
    });
  },


  //  技术分类查询列表接口 地址：category/selectCategoryByPage
  selectCategoryByPage(state){
    Vue.prototype.$post('category/selectCategoryByPage', state.selectCategoryByPageParams).then((res) =>{
      state.selectCategoryByPageData = res.data.data;
    });
  },

  //分页查询兑换数据（首页兑换动态） 地址：exchange/pageQuery
  exchangePageQuery(){
    Vue.prototype.$post('exchange/pageQuery', state.exchangePageQueryParams).then((res) =>{
      state.exchangePageQueryData = res.data.data.list;
    });
  }
}

const actions={
	getBanner({commit}){
    commit('getBanner')
  },
  hotPageQuery({commit}){
    commit('hotPageQuery')
  },
  selectRecommendationsByPage({commit}){
    commit('selectRecommendationsByPage')
  },
  jobPageQuery({commit}){
    commit('jobPageQuery')
  },
  selectNoticesByPage({commit}){
    commit('selectNoticesByPage')
  },
  AttentionByPersonal({commit}){
    commit('AttentionByPersonal')
  },
  RecentlyJoined({commit}){
    commit('RecentlyJoined')
  },
  selectCategoryByPage({commit}){
    commit('selectCategoryByPage')
  },

  exchangePageQuery({commit}){
    commit('exchangePageQuery')
  },

}

export default {
  state,
  mutations,
  actions,
  getters
}

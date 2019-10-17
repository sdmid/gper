import Vue from "vue"
import Cookies from "js-cookie"
import iView from "iview"
import axios from "axios"
import qs from 'qs'

Vue.use(iView)

const state = {
  judgeParams:{
    // bubbleId:"",
    // userId:"",
    // content:"",
    // startTime:"",
    // endTime:"",
    // status:"",
    // orderType:"",
    // pageNum:"",
    pageSize:"20",
    //hasSupport:false
  },
  judgeDatas:[],
  bubbingListtotal:0,
  bubb_from_them_pa:{//根据话题查询冒泡列表
//		tagName:"",
//		orderType:"new"
    pageNum:1,
    pageSize:20
  },
  bubb_them_res:[],
  hotBubblingParam:{
//		pageNum:1,
//		pageSize:10
  },
  hotBubbling:[],
  brifeHotParam:{
//		bubbleId:"",
//		userId:"",
//		content:"",
//		startTime:"",
//		endTime:"",
//		status:"",
    orderType:"hot",
    pageNum:1,
    pageSize:10
  },
  brifeHots:[]
  ,
  bubDetail:{//冒泡详情
    id:""
  },
  bubDetailData:[],
  makeBubParam:{//创建冒泡要上传的参数
    userId:"",
    content:"",
    type:"",
    //bubbleId:"",
    tagsList:[],
    tagsJsonStr:''
  },
  bubbres:[],//冒泡的结果
  bubbTotal:1
};

const mutations = {
  Bubthe(state){//根据话题查询冒泡列表
    Vue.prototype.$post('bubble/pageQueryByTagName', state.bubb_from_them_pa).then((res) =>{
      state.bubb_them_res = res.data.data.list;
      state.bubbTotal = res.data.data.total;
    });
  },
  axGetJudgeData(state){//主页的冒泡列表
    Vue.prototype.$post('bubble/pageQuery', state.judgeParams).then((res) =>{
      state.judgeDatas = res.data.data.list;
      state.bubbingListtotal = res.data.data.total;
      state.judgeParams.hasSupport = res.data.hasSupport;
    });
  },
  brifeHot(state){//右侧的热门话题
    Vue.prototype.$post('btag/pageQueryByHotTag', state.brifeHotParam).then((res) =>{
      state.brifeHots = res.data.data.list;
    });
  }
  ,
  axGetHotBub(state){//右侧的热门冒泡
    Vue.prototype.$post('bubble/pageQuery', state.hotBubblingParam).then((res) =>{
      state.hotBubbling = res.data.data.list;
    });
  },
  getBubDetail(state,id){//冒泡详情
    state.bubDetail.id = id;

    Vue.prototype.$get('bubble/selectBubblesById', state.bubDetail).then((res) =>{
      state.bubDetailData = res.data.data;
    });
  },
  makeBUbbing(state,id){//创建冒泡
    state.makeBubParam.userId = Cookies.get("userId");
    state.makeBubParam.type = "add";
    delete state.makeBubParam.tagsList;
    Vue.prototype.$appost('bubble/addUpdateBubbles', state.makeBubParam).then((res) =>{
      state.bubbres = res.data;
      state.makeBubParam.tagsList = [];
    });
  }
};

const actions = {
  Bubthe({commit}){
    commit("Bubthe");
  },
  getJudgeData({commit}){
    commit("axGetJudgeData");
  },
  axGetHotBub({commit}){
    commit("axGetHotBub")
  },
  brifeHot({commit}){
    commit("brifeHot");
  },
  getBubDetail({commit},id){//冒泡详情
    commit("getBubDetail",id);
  },
  makeBUbbing({commit}){//创建冒泡
    commit("makeBUbbing");
  }
};
const getters = {}
export default {
  state,
  mutations,
  actions,
  getters
}





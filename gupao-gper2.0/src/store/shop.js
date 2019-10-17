
const state = {
  pageNum:1
};

const mutations = {
  UPDATE_PAGENUM(state, params){
    state.pageNum = params
  },
};
const actions = {
  updatePageNum ({commit},param){
    commit("UPDATE_PAGENUM",param);
  },
};

const getter = {};

export default {
  state,
  mutations,
  actions,
  getter
}

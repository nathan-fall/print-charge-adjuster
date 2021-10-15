const state = {
  loading: false,
  pageMovedFlag: false,
};

const mutations = {
  TOGGLE_LOADING_STATE: (state, boolean) => {
    state.loading = boolean;
  },
  TOGGLE_PAGE_MOVED_FLAG: (state) => {
    state.pageMovedFlag = true;
  },
};

const actions = {
  toggleLoadingState: function ({ commit }, boolean) {
    commit("TOGGLE_LOADING_STATE", boolean);
  },
  togglePageMovedFlag: function ({ commit }) {
    commit("TOGGLE_PAGE_MOVED_FLAG");
  },
};

export default {
  namespaced: false,
  state,
  mutations,
  actions,
};

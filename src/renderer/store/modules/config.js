export const defaultInkCharge = [
  // area: 平方ミリメートル
  { id: "l", area: 11303, label: "L版", price: 15 },
  { id: "postcard", area: 14800, label: "はがき", price: 20 },
  { id: "2l", area: 22606, label: "2L版", price: 30 },
  { id: "a4", area: 62370, label: "A4", price: 85 },
  { id: "a3", area: 124740, label: "A3", price: 165 },
  { id: "a3_plus", area: 158907, label: "A3ノビ", price: 210 },
];

const defaultTimeoutThreshold = 180;

if (typeof window.localStorage.inkCharge == "undefined") {
  window.localStorage.inkCharge = JSON.stringify(defaultInkCharge);
}
if (typeof window.localStorage.timeoutThreshold == "undefined") {
  window.localStorage.timeoutThreshold = JSON.stringify(
    defaultTimeoutThreshold
  );
}

const state = {
  inkCharge: JSON.parse(window.localStorage.inkCharge),
  timeoutThreshold: JSON.parse(window.localStorage.timeoutThreshold),
};

const getters = {
  inkChargePrice: (state) => state.inkCharge.map((item) => item.price),
  getInkChargePrice: (state) => (id) => {
    const target = state.inkCharge.findIndex((item) => item.id == id);
    if (target >= 0) {
      return state.inkCharge[target].price;
    } else {
      return 0;
    }
  },
  getInkChargeArea: (state) => (id) => {
    const target = state.inkCharge.findIndex((item) => item.id == id);
    if (target >= 0) {
      return state.inkCharge[target].area;
    } else {
      return 0;
    }
  },
};

const mutations = {
  CHENGE_INK_CHARGE: (state, object) => {
    //object: { id: string, price: number }
    const target = state.inkCharge.findIndex((item) => item.id === object.id);
    if (target >= 0) {
      if (object.price >= 0) {
        state.inkCharge[target].price = object.price;
      }
    }
    window.localStorage.inkCharge = JSON.stringify(state.inkCharge);
  },
  CHANGE_TIMEOUT_THRESHOLD: (state, value) => {
    if (value >= 0) {
      state.timeoutThreshold = value;
    }
    window.localStorage.timeoutThreshold = JSON.stringify(
      state.timeoutThreshold
    );
  },
};

const actions = {
  changeTimeoutThreshold: function ({ commit }, value) {
    commit("CHANGE_TIMEOUT_THRESHOLD", value);
  },
  changeInkCharge: function ({ commit }, object) {
    //object: { id: string, price: number }
    commit("CHENGE_INK_CHARGE", object);
  },
  loadDefaultInkCharge: function ({ commit }) {
    for (const charge of defaultInkCharge) {
      commit("CHENGE_INK_CHARGE", charge);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

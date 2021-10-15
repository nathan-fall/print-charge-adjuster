/* eslint no-irregular-whitespace: ["error", {"skipRegExps": true}] */

import db from "../database";

const state = {
  members: [],
  loading: true,
};

const getters = {
  findName: (state) => (studentId) => {
    const result = state.members.find(
      (member) => member.studentId == studentId
    );
    if (typeof result === "undefined") {
      return "";
    } else {
      return result.name;
    }
  },
  studentIdList: (state) => {
    return state.members.map((member) => member.studentId);
  },
  filteredStudentIdList: (state, getters) => (inputedValue) => {
    {
      return getters.studentIdList.filter((option) => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(
              inputedValue
                .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
                  return String.fromCharCode(s.charCodeAt(0) - 65248);
                })
                .toLowerCase()
            ) >= 0
        );
      });
    }
  },
  countByGeneration: (state, getters) => {
    let result = [];
    getters.studentIdList.forEach((element) => {
      const index = result.findIndex(
        (item) => item.generation == element.slice(0, 3)
      );
      if (index == -1) {
        result.push({ generation: element.slice(0, 3), count: 1 });
      } else {
        result[index].count += 1;
      }
    });
    return result;
  },
};

const mutations = {
  UPDATE_TABLE: (state, data) => {
    state.members = data;
  },
  TOGGLE_LOADING_STATE: (state, data) => {
    state.loading = data;
  },
};

const actions = {
  getData: async function ({ commit }) {
    commit("TOGGLE_LOADING_STATE", true);
    const data = await db.members.orderBy("studentId").toArray();
    commit("UPDATE_TABLE", data);
    commit("TOGGLE_LOADING_STATE", false);
  },
  createMember: async function ({ dispatch, getters }, data) {
    if (getters["studentIdList"].indexOf(data.studentId) == -1) {
      await db.members.add({
        studentId: String(data.studentId).trim().replace(/　/g, " "),
        name: String(data.name).trim(),
      });
      dispatch("getData");
    }
  },
  bulkCreateMember: async function ({ dispatch, getters }, array) {
    const data = array
      .filter((data, index, array) => {
        return (
          array.map((item) => item.studentId).indexOf(data.studentId) == index
        );
      })
      .filter((data) => getters["studentIdList"].indexOf(data.studentId) == -1)
      .map((item) => {
        return {
          studentId: String(item.studentId).trim().replace(/　/g, " "),
          name: String(item.name).trim(),
        };
      });
    await db.members.bulkAdd(data);
    dispatch("getData");
  },
  deleteMember: async function ({ dispatch }, array) {
    await db.members.where("id").anyOf(array).delete();
    dispatch("getData");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

import Dexie from "dexie";
const db = new Dexie("PrintChargeAdjusterDatabase");
db.version(1).stores({
  printjobs: "++id, date, studentId, size, paperType, collected, &serialNumber", // name, count
  members: "++id,studentId", //  name
});

const convertDate = (dateNumber) => {
  const date = `${String(dateNumber).slice(0, 4)}/${String(dateNumber).slice(
    4,
    6
  )}/${String(dateNumber).slice(6, 8)}`;
  const day = ["日", "月", "火", "水", "木", "金", "土"][
    new Date(Date.parse(date)).getDay()
  ];
  return `${date} (${day})`;
};

const state = {
  pastPrintjobs: [],
  oldestPrintjobDate: 20000000,
  printjobs: [],
  loading: true,
  backupData: [],
  serialNumberList: [],
};

const getters = {
  tableData: (state, getters, rootState) => {
    return state.printjobs
      .map((printjob) => {
        return {
          id: printjob.id,
          date: convertDate(printjob.date),
          name: printjob.name,
          size: rootState.config.inkCharge.find(
            (item) => item.id == printjob.size
          ).label,
          count: `${printjob.count} 枚`,
        };
      })
      .reverse();
  },
  serialNumberList: (state) => {
    return state.printjobs.map((printjob) => printjob.serialNumber);
  },
  chargeList: (state, getters, rootState) => {
    const sizePriceList = rootState.config.inkCharge.map((item) => item.price);
    const sizeLabel = rootState.config.inkCharge.map((item) => item.label);
    const studentIdUniqueList = state.printjobs
      .map((job) => job.studentId)
      .filter((studentId, index, array) => {
        return (
          array.indexOf(studentId) == index && state.printjobs[index].count > 0
        );
      })
      .sort();
    let result = studentIdUniqueList.map((studentId) => {
      return {
        studentId: studentId,
        name: "",
        list: sizePriceList.map(() => 0),
      };
    });
    let from = 30000000;
    let to = 0;
    state.printjobs.forEach((job) => {
      const index = result.findIndex((item) => item.studentId == job.studentId);
      result[index].list[
        rootState.config.inkCharge.findIndex((item) => item.id == job.size)
      ] += Number(job.count);
      if (result[index].name == "") {
        result[index].name = job.name;
      }
      if (from > Number(job.date)) {
        from = Number(job.date);
      }
      if (to < Number(job.date)) {
        to = Number(job.date);
      }
    });
    return {
      from: convertDate(from),
      to: convertDate(to),
      data: result.map((item) => {
        return {
          name: item.name,
          rawList: item.list,
          list: item.list
            .reduce((acc, cur, idx) => {
              if (cur > 0) {
                return acc + `, ${sizeLabel[idx]}: ${cur}枚`;
              } else {
                return acc;
              }
            }, "")
            .slice(2),
          price:
            item.list
              .reduce((acc, cur, idx) => acc + sizePriceList[idx] * cur, 0)
              .toString()
              .replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " 円",
        };
      }),
    };
  },
};

const mutations = {
  UPDATE_TABLE: (state, data) => {
    state.printjobs = data;
  },
  UPDATE_PAST_DATA: (state, data) => {
    state.pastPrintjobs = data;
  },
  UPDATE_OLDEST_PRINTJOB_DATE: (state, data) => {
    state.oldestPrintjobDate = data;
  },
  TOGGLE_LOADING_STATE: (state, data) => {
    state.loading = data;
  },
  UPDATE_BACKUP_DATA: (state, data) => {
    state.backupData = data;
  },
  UPDATE_SERIAL_NUMBER_LIST: (state, data) => {
    state.serialNumberList = data;
  },
};

const actions = {
  getData: async function ({ commit }) {
    commit("TOGGLE_LOADING_STATE", true);
    const data = await db.printjobs.where("collected").equals(0).toArray();
    commit("UPDATE_TABLE", data);
    commit("TOGGLE_LOADING_STATE", false);
  },
  getPastData: async function ({ commit }, object) {
    // object = {from: Number, to: Number}
    const from = Math.min(object.from, object.to);
    const to = Math.max(object.from, object.to);
    const data = await db.printjobs
      .where("date")
      .between(from, to, true, true)
      .toArray();
    commit("UPDATE_PAST_DATA", data);
  },
  getOldestPrintjobDate: async function ({ commit }) {
    const data = await db.printjobs.orderBy("date").first();
    commit("UPDATE_OLDEST_PRINTJOB_DATE", data.date);
  },
  getSerialNumberList: async function ({ commit }) {
    const data = await db.printjobs.orderBy("serialNumber").keys();
    commit("UPDATE_SERIAL_NUMBER_LIST", data);
  },
  createPrintjob: async function ({ dispatch }, data) {
    await db.printjobs.add({
      date: Number(data.date),
      studentId: String(data.studentId),
      name: String(data.name),
      size: String(data.size),
      count: Number(data.count),
      paperType: Number(data.paperType),
      collected: 0,
      serialNumber: Number(new Date()),
    });
    dispatch("getData");
  },
  bulkCreatePrintjobs: async function ({ dispatch, state }, array) {
    await dispatch("getSerialNumberList");
    const data = array
      .map((item) => {
        return {
          date: Number(item.date),
          studentId: String(item.studentId),
          name: String(item.name),
          size: String(item.size),
          count: Number(item.count),
          paperType: Number(item.paperType),
          collected: Number(item.collected),
          serialNumber: Number(item.serialNumber),
        };
      })
      .filter(
        (data) => state.serialNumberList.indexOf(data.serialNumber) == -1
      );
    await db.printjobs.bulkAdd(data);
    dispatch("getData");
  },
  collectPrintjobs: async function ({ dispatch }) {
    await db.printjobs.where("collected").equals(0).modify({ collected: 1 });
    dispatch("getData");
  },
  rollbackPrintjobs: async function ({ dispatch }, data) {
    await db.printjobs
      .where("date")
      .aboveOrEqual(data)
      .modify({ collected: 0 });
    dispatch("getData");
  },
  backup: async function ({ commit }) {
    const data = await db.printjobs
      .where("date")
      .aboveOrEqual(
        (new Date().getFullYear() - 1 + parseInt(new Date().getMonth() / 6)) *
          10000
      )
      .toArray();
    commit("UPDATE_BACKUP_DATA", data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

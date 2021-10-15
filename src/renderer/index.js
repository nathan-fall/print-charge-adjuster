import Vue from "vue";
import Buefy from "buefy";

import App from "./App";
import router from "./router";
import store from "./store";

import { DateTime } from "luxon";

Vue.config.productionTip = false;

Vue.use(Buefy, {
  defaultIconPack: "fas",
  defaultDayNames: ["日", "月", "火", "水", "木", "金", "土"],
  defaultMonthNames: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  defaultFirstDayOfWeek: 1,
  defaultDateCreator: () => new Date(DateTime.now().toFormat("yyyy-MM-dd")),
  defaultDateFormatter: (date) =>
    DateTime.fromJSDate(date).toFormat("yyyy年MM月dd日"),
  defaultDateParser: (date) =>
    new Date(DateTime.fromJSDate(date).toFormat("yyyy-MM-dd")),
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

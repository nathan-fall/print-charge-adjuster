import Vue from "vue";
import VueRouter from "vue-router";
import ThePrintjobsTop from "@/views/printjobs/ThePrintjobsTop";
import ThePrintjobsNew from "@/views/printjobs/ThePrintjobsNew";
import ThePrintjobsCalc from "@/views/printjobs/ThePrintjobsCalc";
import TheMembersTop from "@/views/members/TheMembersTop";
import TheMembersBulkNew from "@/views/members/TheMembersBulkNew";
import TheConfigTop from "@/views/config/TheConfigTop";

Vue.use(VueRouter);

const routes = [
  {
    path: "/printjobs",
    name: "ThePrintjobsTop",
    component: ThePrintjobsTop,
  },
  {
    path: "/printjobs/new",
    name: "ThePrintjobsNew",
    component: ThePrintjobsNew,
  },
  {
    path: "/printjobs/calc",
    name: "ThePrintjobsCalc",
    component: ThePrintjobsCalc,
  },
  {
    path: "/members",
    name: "TheMembersTop",
    component: TheMembersTop,
  },
  {
    path: "/members/bulknew",
    name: "TheMembersBulkNew",
    component: TheMembersBulkNew,
  },
  {
    path: "/config",
    name: "TheConfigTop",
    component: TheConfigTop,
  },
  {
    path: "*",
    redirect: "/printjobs/new",
  },
];

const router = new VueRouter({
  routes,
});

export default router;

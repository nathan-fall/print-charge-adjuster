<template>
  <div id="app">
    <header>
      <app-header />
    </header>
    <router-view id="view" />
    <b-loading :active="$store.state.common.loading" />
  </div>
</template>

<script>
import { autoBackup } from "./autoBackup";
import appHeader from "./components/AppHeader";

let backupTimer = 0;

export default {
  components: { appHeader },
  created: async function () {
    document.ondragover = document.ondrop = function (e) {
      e.preventDefault();
    };

    window.mainProcess.recieveURL((event, url) => {
      console.log(event, url);
      url = url.split(":/")[1];
      if (url === "/printjobs/new") {
        if (this.$route.name !== "ThePrintjobsNew") {
          console.log("Moving to /printjobs/new !");
          this.$router.push({ name: "ThePrintjobsNew" });
        }
      }
    });

    const backupTimerCallback = () => {
      autoBackup(this.$store);
    };
    backupTimerCallback();
    backupTimer = setInterval(backupTimerCallback, 60 * 60 * 1000);
  },
  beforeDestroy: function () {
    clearInterval(backupTimer);
  },
};
</script>

<style lang="scss" src="./style.scss" />

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
// if (typeof window.localStorage.lastAutoBackup == "undefined") {
//   window.localStorage.lastAutoBackup = 0;
// }

import appHeader from "./components/AppHeader";
export default {
  components: { appHeader },
  created: async function () {
    document.ondragover = document.ondrop = function (e) {
      e.preventDefault();
    };

    if (
      (await window.mainProcess.getProcessArgs()).findIndex(
        (arg) => arg === "--new"
      ) >= 0 &&
      this.$route.name !== "ThePrintjobsNew"
    ) {
      this.$router.push({ name: "ThePrintjobsNew" });
    }

    // window.mainProcess.recieveNewArgv((event, argv) => {
    //   console.log(event, argv);
    //   if (this.$route.name !== "ThePrintjobsNew") {
    //     this.$router.push({ name: "ThePrintjobsNew" });
    //   }
    // });

    // this.$store.dispatch("printjobs/getData");
    // let promiseTask = this.$store.dispatch("members/getData");

    // if (
    //   Number(new Date()) - window.localStorage.lastAutoBackup >=
    //   3 * 24 * 60 * 1000
    // ) {
    //   await Promise.all([
    //     promiseTask,
    //     this.$store.dispatch("printjobs/backup"),
    //   ]);
    //   const backupFileDir = path.join(
    //     remote.app.getPath("home"),
    //     "印刷代管理アプリ"
    //   );
    //   if (!fs.existsSync(backupFileDir)) {
    //     fs.mkdirSync(backupFileDir);
    //   }
    //   fs.writeFile(
    //     path.join(
    //       backupFileDir,
    //       "auto_backup_" + moment().format("YYYY_MM_DD") + ".json"
    //     ),
    //     JSON.stringify({
    //       printjobs: this.$store.state.printjobs.backupData,
    //       members: this.$store.state.members.members,
    //     }),
    //     (err) => {
    //       if (err) {
    //         console.log(
    //           "定期バックアップの作成中にエラーが発生しました。パソコン担当にお知らせください。" +
    //             err
    //         );
    //         throw err;
    //       }
    //       window.localStorage.lastAutoBackup = Number(new Date());
    //     }
    //   );
    // }
  },
};
</script>

<style lang="scss" src="./style.scss" />

export const autoBackup = async (store) => {
  if (typeof window.localStorage.lastAutoBackup == "undefined") {
    window.localStorage.lastAutoBackup = 0;
  }

  // 3日バックアップを作成していなかったらバックアップを作成して保存する。
  if (
    Number(new Date()) - window.localStorage.lastAutoBackup >=
    3 * 24 * 60 * 60 * 1000
  ) {
    window.localStorage.lastAutoBackup = Number(new Date());
    await Promise.all([
      store.dispatch("printjobs/backup"),
      store.dispatch("members/getData"),
    ]);
    const data = JSON.stringify(
      {
        printjobs: store.state.printjobs.backupData,
        members: store.state.members.members,
      },
      undefined,
      "  "
    );
    try {
      await window.mainProcess.saveBackup(data, false);
    } catch (e) {
      console.log(
        "定期バックアップの作成中にエラーが発生しました。パソコン担当にお知らせください。" +
          e
      );
      throw e;
    }
  }
};

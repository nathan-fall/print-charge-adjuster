// https://qiita.com/hibara/items/c59fb6924610fc22a9db

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("mainProcess", {
  getProcessArgs: async () => await ipcRenderer.invoke("getProcessArgs"),
  saveBackup: async (data = "", askPath = false) =>
    await ipcRenderer.invoke("saveBackup", data, askPath),
  recieveNewArgv: (callback) =>
    ipcRenderer.on("recieveNewArgv", (event, argv) => callback(event, argv)),
});

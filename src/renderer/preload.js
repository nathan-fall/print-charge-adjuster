// https://qiita.com/hibara/items/c59fb6924610fc22a9db

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("mainProcess", {
  saveBackup: async (data = "", askPath = false) =>
    await ipcRenderer.invoke("saveBackup", data, askPath),
  recieveURL: (callback) =>
    ipcRenderer.on("recieveURL", (event, url) => callback(event, url)),
});

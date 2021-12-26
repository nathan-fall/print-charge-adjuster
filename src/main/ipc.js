import path from "path";
import fs from "fs/promises";
import { app, dialog, ipcMain } from "electron";
import { DateTime } from "luxon";

export const registerIPC = async () => {
  ipcMain.handle("saveBackup", async (event, data, askPath) => {
    let savePath;
    if (askPath) {
      const dialogResult = await dialog.showSaveDialog({
        title: "保存先を指定してください",
        defaultPath: path.join(
          app.getPath("desktop"),
          `印刷代管理アプリ_${DateTime.now().toFormat("yyyy-MM-dd")}.json`
        ),
        filters: [{ name: "JSON", extensions: ["json"] }],
      });
      if (dialogResult.canceled) {
        throw new Error("キャンセルされました");
      }
      savePath = dialogResult.filePath;
    } else {
      const backupDir = path.join(app.getPath("home"), "印刷代管理アプリ");
      try {
        await fs.access(backupDir);
      } catch {
        await fs.mkdir(backupDir);
      }
      savePath = path.join(
        backupDir,
        `自動バックアップ_${DateTime.now().toFormat("yyyy-MM-dd")}.json`
      );
    }
    await fs.writeFile(savePath, data);
  });
};

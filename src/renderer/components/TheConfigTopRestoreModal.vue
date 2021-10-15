<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">バックアップから追加</p>
    </header>
    <section class="modal-card-body">
      <section class="section">
        <b-field class="has-text-centered">
          <b-upload drag-drop="drag-drop" @input="loadFile">
            <p v-if="fileLoaded">他のファイルを選択する</p>
            <section v-else class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large"></b-icon>
                </p>
                <p>
                  バックアップファイルをドラッグ・アンド・ドロップするかクリックしてファイルを選んでください
                </p>
              </div>
            </section>
          </b-upload>
        </b-field>
      </section>
      <div v-if="fileLoaded">
        <p class="has-text-centered">
          以下の内容で間違いなければ『実行』をクリックしてください
        </p>
        <div class="section">
          <div class="level is-mobile">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">印刷履歴</p>
              </div>
              <div>
                <p class="title">
                  {{ parsedDataCount.printjobs.total }}<small>件</small>
                </p>
                <p class="heading">
                  (内{{
                    parsedDataCount.printjobs.total -
                    parsedDataCount.printjobs.new
                  }}件は登録済み)
                </p>
              </div>
            </div>
          </div>
          <div class="level is-mobile">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">名簿</p>
              </div>
              <div>
                <p class="title">
                  {{ parsedDataCount.members.total }}<small>件</small>
                </p>
                <p class="heading">
                  (内{{
                    parsedDataCount.members.total - parsedDataCount.members.new
                  }}件は登録済み)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="columns is-mobile is-gapless" style="width: 100%">
        <div class="column">
          <button
            class="button is-primary is-fullwidth"
            style="border-radius: 6px 0 0 6px; border-right-width: 1px"
            @click="$parent.close"
          >
            キャンセル
          </button>
        </div>
        <div class="column">
          <button
            class="button is-warning is-fullwidth"
            style="border-radius: 0 6px 6px 0; border-left-width: 1px"
            @click="execRestore"
          >
            <span class="icon"><i class="fas fa-undo"></i></span
            ><span>実行</span>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
// import * as fs from "fs";
// const { dialog } = require("electron").remote;

export default {
  data: function () {
    return {
      fileLoaded: false,
      parsedData: { printjobs: [], members: [], config: [] },
    };
  },
  computed: {
    parsedDataCount: function () {
      let result = {
        printjobs: { total: 0, new: 0 },
        members: { total: 0, new: 0 },
      };
      if (typeof this.parsedData.printjobs != "undefined") {
        result.printjobs.total = this.parsedData.printjobs.length;
        result.printjobs.new = this.parsedData.printjobs.filter(
          (data) =>
            this.$store.state.printjobs.serialNumberList.indexOf(
              data.serialNumber
            ) == -1
        ).length;
      }
      if (typeof this.parsedData.members != "undefined") {
        result.members.total = this.parsedData.members.length;
        result.members.new = this.parsedData.members.filter(
          (data) =>
            this.$store.getters["members/studentIdList"].indexOf(
              data.studentId
            ) == -1
        ).length;
      }
      return result;
    },
  },
  created: async function () {
    await this.$store.dispatch("printjobs/getSerialNumberList");
  },
  methods: {
    loadFile: async function (file) {
      this.fileLoaded = true;
      this.$store.dispatch("toggleLoadingState", true);
      try {
        this.parsedData = JSON.parse(await file.text());
      } catch (e) {
        window.alert(`読み込みに失敗しました: ${e.message}`);
        console.error(e);
      }
      this.$store.dispatch("toggleLoadingState", false);
    },
    execRestore: async function () {
      this.$store.dispatch("toggleLoadingState", true);
      if (typeof this.parsedData.printjobs != "undefined") {
        await this.$store.dispatch(
          "printjobs/bulkCreatePrintjobs",
          this.parsedData.printjobs
        );
      }
      if (typeof this.parsedData.members != "undefined") {
        await this.$store.dispatch(
          "members/bulkCreateMember",
          this.parsedData.members
        );
      }
      await new Promise((r) => setTimeout(r, 1000));
      this.$store.dispatch("toggleLoadingState", false);
      this.$emit("restore");
    },
  },
};
</script>

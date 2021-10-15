<template>
  <div>
    <main>
      <div class="section">
        <div class="container">
          <div class="content">
            <h4 class="has-text-centered title has-text-weight-bold">
              バックアップ＆復元
            </h4>
            <div class="columns">
              <div class="column">
                <button
                  class="button is-primary is-fullwidth"
                  @click="createBackup"
                >
                  バックアップを作成
                </button>
              </div>
              <div class="column">
                <button
                  class="button is-primary is-fullwidth"
                  @click="restoreModalActive = true"
                >
                  バックアップを使う
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr style="margin: 0.5rem 0" />
      <div class="section">
        <div class="container">
          <div class="content">
            <h4 class="has-text-centered title has-text-weight-bold">
              タイムアウト時間設定
            </h4>
            <div class="columns is-multiline is-vcentered">
              <div class="column is-8">
                <div class="content has-text-centered">
                  <p>
                    <span class="no-wrap">印刷履歴の一覧ページ、</span
                    ><span class="no-wrap">名簿の一覧ページで</span
                    ><span class="no-wrap">指定した</span
                    ><span class="no-wrap">時間以上</span
                    ><span class="no-wrap">操作がない場合は</span
                    ><span class="no-wrap">印刷履歴の</span
                    ><span class="no-wrap">新規作成画面に</span
                    ><span class="no-wrap">飛びます</span>
                  </p>
                  <p>0でこの機能はオフになります</p>
                </div>
              </div>
              <div class="column is-4">
                <div class="field has-addons">
                  <div class="control is-expanded">
                    <input
                      v-model="timeoutThreshold"
                      class="input"
                      type="text"
                      @change="setTimeoutThreshold(timeoutThreshold)"
                    />
                  </div>
                  <div class="control">
                    <button class="button is-static has-text-dark">秒</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr style="margin: 0.5rem 0" />
      <div class="section">
        <div class="container">
          <div class="content">
            <h4 class="has-text-centered title has-text-weight-bold">
              １枚あたりのインク代
            </h4>
            <div class="columns is-multiline is-mobile">
              <div
                v-for="(item, index) in $store.state.config.inkCharge"
                :key="item.id"
                class="column is-6"
              >
                <div class="field is-horizontal is-mobile">
                  <div class="field-label is-normal">
                    <label class="label">{{ item.label }}</label>
                  </div>
                  <div class="field-body">
                    <div class="field has-addons">
                      <div class="control is-expanded">
                        <input
                          v-model="price[index]"
                          class="input"
                          type="text"
                          @change="setPrice(item.id, price[index])"
                        />
                      </div>
                      <div class="control">
                        <button class="button is-static has-text-dark">
                          円
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <button
                  class="button is-primary is-fullwidth"
                  @click="loadDefault"
                >
                  デフォルト値に戻す
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <b-modal
      has-modal-card="has-modal-card"
      :active.sync="restoreModalActive"
      :can-cancel="['outside']"
    >
      <restore-modal
        @restore="
          restoreModalActive = false;
          $router.push({ name: 'ThePrintjobsTop' });
        "
      ></restore-modal>
    </b-modal>
    <footer>
      <div class="container">
        <div class="columns is-mobile is-gapless">
          <div class="column">
            <button class="button is-dark is-fullwidth" disabled="disabled">
              変更は自動的に反映されます
            </button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import restoreModal from "@/components/TheConfigTopRestoreModal";

export default {
  components: { restoreModal },
  data: function () {
    return {
      restoreModalActive: false,
      price: Object.assign({}, this.$store.getters["config/inkChargePrice"]),
      timeoutThreshold: this.$store.state.config.timeoutThreshold,
    };
  },
  methods: {
    createBackup: async function () {
      await Promise.all([
        this.$store.dispatch("printjobs/backup"),
        this.$store.dispatch("members/getData"),
      ]);
      const data = JSON.stringify(
        {
          printjobs: this.$store.state.printjobs.backupData,
          members: this.$store.state.members.members,
        },
        undefined,
        "  "
      );
      try {
        await window.mainProcess.saveBackup(data, true);
        window.alert("バックアップを作成しました");
      } catch {
        window.alert("バックアップをキャンセルしました");
      }
    },
    setTimeoutThreshold: function (value) {
      value = Number(
        value.replace(/[０-９]/g, function (s) {
          return String.fromCharCode(s.charCodeAt(0) - 65248);
        })
      );
      this.$store.dispatch("config/changeTimeoutThreshold", value);
    },
    setPrice: function (id, price) {
      price = Number(
        price.replace(/[０-９]/g, function (s) {
          return String.fromCharCode(s.charCodeAt(0) - 65248);
        })
      );
      this.$store.dispatch("config/changeInkCharge", { id: id, price: price });
    },
    loadDefault: async function () {
      await this.$store.dispatch("config/loadDefaultInkCharge");
      this.price = Object.assign(
        {},
        this.$store.getters["config/inkChargePrice"]
      );
    },
  },
};
</script>

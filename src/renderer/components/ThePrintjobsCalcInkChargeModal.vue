<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">インク代の確認</p>
    </header>
    <section class="modal-card-body">
      <div class="content">
        <p>各サイズ1枚あたりのインク代を確認してください</p>
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
                      :disabled="!editPhase"
                      @change="setPrice(item.id, price[index])"
                    />
                  </div>
                  <div class="control">
                    <button class="button is-static has-text-dark">円</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div
        v-if="!editPhase"
        class="columns is-mobile is-gapless"
        style="width: 100%"
      >
        <div class="column is-9">
          <button
            class="button is-primary is-fullwidth"
            style="border-radius: 6px 0 0 6px; border-left-width: 1px"
            @click="$parent.close"
          >
            <span class="icon"><i class="fas fa-check"></i></span
            ><span>続行</span>
          </button>
        </div>
        <div class="column">
          <button
            class="button is-fullwidth"
            style="border-radius: 0 6px 6px 0; border-right-width: 1px"
            @click="editPhase = true"
          >
            <span class="icon"><i class="fas fa-edit"></i></span
            ><span>変更</span>
          </button>
        </div>
      </div>
      <div v-else class="columns is-mobile is-gapless" style="width: 100%">
        <div class="column">
          <button
            class="button is-primary is-fullwidth"
            style="border-radius: 6px 0 0 6px; border-left-width: 1px"
            @click="$parent.close"
          >
            <span class="icon"><i class="fas fa-check"></i></span
            ><span>完了</span>
          </button>
        </div>
        <div class="column">
          <button
            class="button is-fullwidth"
            style="border-radius: 0 6px 6px 0; border-right-width: 1px"
            @click="loadDefault"
          >
            デフォルト値に戻す
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      price: Object.assign({}, this.$store.getters["config/inkChargePrice"]),
      editPhase: false,
    };
  },
  methods: {
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

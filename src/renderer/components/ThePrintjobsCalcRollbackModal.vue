<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">未精算に戻す</p>
    </header>
    <section class="modal-card-body">
      <div class="content">
        <p>選んだ日付から今日までの印刷分が【未精算】に戻ります。</p>
        <p>対象の日付を選び、『実行』ボタンを押してください。</p>
        <b-datepicker
          v-model="date"
          inline="inline"
          :min-date="
            new Date(
              new Date().getFullYear() -
                1 +
                parseInt(new Date().getMonth() / 6),
              0,
              1
            )
          "
          :max-date="
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            )
          "
        ></b-datepicker>
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
            @click="execRollback"
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
export default {
  data: function () {
    return { date: new Date() };
  },
  methods: {
    execRollback: function () {
      let from =
        this.date.getFullYear() * 10000 +
        (this.date.getMonth() + 1) * 100 +
        this.date.getDate();
      this.$store.dispatch("printjobs/rollbackPrintjobs", from);
      this.$emit("rollback");
    },
  },
};
</script>

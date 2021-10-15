<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">確認</p>
    </header>
    <section class="modal-card-body">
      <div class="content">
        <p>すべて【清算済み】にしてもよろしいですか？</p>
        <p>よろしければ『実行』ボタンを押してください。</p>
        <p>あとから【未精算】に戻すことも可能です。</p>
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
            @click="execCollect"
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
  methods: {
    execCollect: function () {
      this.$store.dispatch("printjobs/collectPrintjobs");
      this.$emit("collect");
    },
  },
};
</script>

<template>
  <div>
    <div v-if="targets.length == 0" class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">削除のしかた</p>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <p>
            一覧で削除したい項目にチェックを入れ、もう一度この画面に戻ってきてください
          </p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="columns is-mobile is-gapless" style="width: 100%">
          <div class="column">
            <button
              class="button is-primary is-fullwidth"
              @click="$parent.close"
            >
              OK
            </button>
          </div>
        </div>
      </footer>
    </div>
    <div v-else class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">削除確認</p>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <p>本当にチェックを入れた項目を削除しますか？</p>
          <div class="tags">
            <span
              v-for="target in targets"
              :key="target.id"
              class="tag is-info"
              >{{ target.name }}</span
            >
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
              class="button is-danger is-fullwidth"
              style="border-radius: 0 6px 6px 0; border-left-width: 1px"
              @click="execDelete"
            >
              <span class="icon"><i class="fas fa-trash"></i></span
              ><span>削除</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    targets: {
      type: Array,
      reqired: true,
      default: () => [],
    },
  },
  methods: {
    execDelete: function () {
      let deleteTarget = this.targets.map((item) => item.id);
      this.$store.dispatch("members/deleteMember", deleteTarget);
      this.$emit("delete");
    },
  },
};
</script>

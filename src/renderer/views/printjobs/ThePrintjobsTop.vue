<template>
  <div>
    <main>
      <div class="section">
        <div class="container">
          <b-table
            :data="$store.getters['printjobs/tableData']"
            :columns="columns"
            :loading="false"
            hogeloading="$store.state.printjobs.loading"
            paginated="paginated"
            per-page="10"
            :default-sort="['id', 'desc']"
            default-sort-direction="desc"
            ><template slot="empty">
              <section class="section is-large">
                <div class="container">
                  <div class="content has-text-grey has-text-centered">
                    <b-icon
                      pack="fab"
                      icon="creative-commons-zero"
                      size="is-large"
                    ></b-icon>
                    <p>0件です</p>
                  </div>
                </div>
              </section>
            </template></b-table
          >
        </div>
      </div>
    </main>

    <footer>
      <div class="container">
        <div class="columns is-mobile is-gapless">
          <div class="column is-9">
            <router-link
              class="button is-primary is-fullwidth"
              :to="{ name: 'ThePrintjobsNew' }"
              style="border-radius: 6px 0 0 6px; border-right-width: 1px"
              ><span class="icon"><i class="fas fa-plus-circle"></i></span
              ><span>登録</span></router-link
            >
          </div>
          <div class="column">
            <router-link
              class="button is-fullwidth"
              :to="{ name: 'ThePrintjobsCalc' }"
              style="border-radius: 0 6px 6px 0; border-left-width: 1px"
              >集計</router-link
            >
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
let timer;
let mainElement;

export default {
  data: function () {
    return {
      columns: [
        {
          field: "id",
          label: "No.",
          sortable: true,
          width: "60",
          numeric: true,
        },
        {
          field: "date",
          label: "印刷日",
          centered: true,
          sortable: true,
        },
        {
          field: "name",
          label: "名前",
          centered: true,
          sortable: true,
        },
        {
          field: "size",
          label: "サイズ",
          centered: true,
        },
        {
          field: "count",
          label: "枚数",
          centered: true,
        },
      ],
    };
  },
  mounted: function () {
    this.$store.dispatch("printjobs/getData");

    const timeoutFunction = () => {
      this.$router.push({ name: "ThePrintjobsNew" });
    };
    const timeoutThreshold = this.$store.state.config.timeoutThreshold * 1000;
    if (timeoutThreshold > 0) {
      let pivot = 0;
      mainElement = document.getElementsByTagName("main")[0];
      timer = setTimeout(timeoutFunction, timeoutThreshold);
      document.body.onmouseover = () => {
        if (Number(new Date()) - pivot >= 200) {
          clearTimeout(timer);
          timer = setTimeout(timeoutFunction, timeoutThreshold);
          pivot = Number(new Date());
        }
      };
      mainElement.onscroll = () => {
        if (Number(new Date()) - pivot >= 200) {
          clearTimeout(timer);
          timer = setTimeout(timeoutFunction, timeoutThreshold);
          pivot = Number(new Date());
        }
      };
    }
  },
  beforeDestroy: function () {
    clearTimeout(timer);
    document.body.onmouseover = null;
    mainElement.onscroll = null;
  },
};
</script>

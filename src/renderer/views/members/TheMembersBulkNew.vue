<template>
  <div>
    <main>
      <div class="section">
        <div class="container">
          <div class="columns">
            <div class="column">
              <div class="field">
                <div class="control">
                  <textarea
                    v-model="form"
                    class="textarea"
                    :rows="textareaRows"
                    placeholder="Excelからコピペしてください"
                  ></textarea>
                </div>
              </div>
              <button
                class="button is-warning is-outlined is-fullwidth"
                @click="form = ''"
              >
                リセット
              </button>
            </div>
            <div class="column">
              <b-table
                v-if="form != ''"
                :data="convertedData"
                :columns="columns"
                :mobile-cards="false"
                :row-class="(row, index) =&gt; (row.studentIdError == true || row.nameError == true) &amp;&amp; 'is-selected'"
                ><template slot="empty">
                  <section class="section is-large">
                    <div class="container">
                      <div class="content has-text-grey has-text-centered">
                        <p class="title">読み込みに失敗しました</p>
                        <p>[学籍番号]、[名前] の順に表が並んでいますか？</p>
                        <p>手動で入力せず、Excelからコピペしてください</p>
                      </div>
                    </div>
                  </section>
                </template></b-table
              >
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <div class="container">
        <div class="columns is-mobile is-gapless">
          <div class="column is-9">
            <button
              class="button is-info is-fullwidth"
              style="border-radius: 6px 0 0 6px; border-right-width: 1px"
              @click="submit"
            >
              <span class="icon"><i class="fab fa-telegram-plane"></i></span
              ><span>一括登録</span>
            </button>
          </div>
          <div class="column">
            <router-link
              class="button is-fullwidth"
              :to="{ name: 'TheMembersTop' }"
              style="border-radius: 0 6px 6px 0; border-left-width: 1px"
              >戻る</router-link
            >
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      form: "",
      columns: [
        {
          field: "studentId",
          label: "学籍番号",
          centered: true,
        },
        {
          field: "name",
          label: "名前",
          centered: true,
        },
      ],
    };
  },
  computed: {
    textareaRows: function () {
      if (this.form == "") {
        return 15;
      } else {
        return 5;
      }
    },
    convertedData: function () {
      let rows = this.form.split("\n");
      let arrayd_data = [];
      for (let row of rows) {
        if (row.indexOf("\t") != -1) {
          arrayd_data.push(row.split("\t"));
        }
      }
      let result = [];
      for (let input of arrayd_data) {
        let data = {
          studentId: input[0].trim().toUpperCase(),
          name: input[1].trim(),
          studentIdError: false,
          nameError: false,
        };
        if (!/^\d{2}[_BMR]\d{5}$/.test(data["studentId"])) {
          data["studentIdError"] = true;
        }
        if (data["name"] == "") {
          data["nameError"] = true;
        }
        result.push(data);
      }
      return result;
    },
  },
  methods: {
    submit: function () {
      const errorFlag = this.convertedData.reduce(
        (acc, cur) => acc || cur.studentIdError || cur.nameError,
        false
      );
      if (!errorFlag && this.convertedData.length > 0) {
        this.$store.dispatch("members/bulkCreateMember", this.convertedData);
        this.$router.push({ name: "TheMembersTop" });
      }
    },
  },
};
</script>

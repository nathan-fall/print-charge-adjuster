<template>
  <div>
    <main>
      <div class="section">
        <div class="container">
          <div class="columns is-multiline">
            <div class="column is-6">
              <div class="field">
                <label class="label">印刷日</label>
                <div class="control">
                  <b-datepicker
                    v-model="date"
                    :inline="inline"
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
              </div>
            </div>
            <div class="column is-6">
              <b-field
                label="学籍番号"
                :type="studentIdFormCheck.type"
                :message="studentIdFormCheck.message"
              >
                <b-autocomplete
                  v-model="studentId"
                  :data="
                    $store.getters['members/filteredStudentIdList'](studentId)
                  "
                  placeholder="17B12345"
                  @select="option =&gt; selected = option"
                  @input="clearError('studentId')"
                ></b-autocomplete>
              </b-field>
              <div class="field">
                <label class="label">名前</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="学籍番号を入力してください"
                    disabled="disabled"
                    :value="$store.getters['members/findName'](studentId)"
                  />
                </div>
              </div>
              <div class="field">
                <label class="label">サイズ</label>
                <div class="control">
                  <b-select v-model="size" expanded="expanded">
                    <option
                      v-for="option in $store.state.config.inkCharge"
                      :key="option.id"
                      :value="option.id"
                    >
                      {{ option.label }}
                    </option>
                  </b-select>
                </div>
              </div>
              <div class="field">
                <label class="label">枚数</label>
                <div class="field has-addons">
                  <div class="control is-expanded">
                    <input v-model="count" class="input" type="text" />
                  </div>
                  <div class="control">
                    <button class="button is-static has-text-dark">枚</button>
                  </div>
                  <div class="control">
                    <button class="button is-inverted" @click="countUp">
                      <span class="icon is-small"
                        ><i class="fas fa-plus"></i
                      ></span>
                    </button>
                  </div>
                  <div class="control">
                    <button class="button is-inverted" @click="countDown">
                      <span class="icon is-small"
                        ><i class="fas fa-minus"></i
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
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
              @click="submitForm"
            >
              <span class="icon"><i class="fab fa-telegram-plane"></i></span
              ><span>登録</span>
            </button>
          </div>
          <div class="column">
            <router-link
              class="button is-fullwidth"
              :to="{ name: 'ThePrintjobsTop' }"
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
import { DateTime } from "luxon";
import { defaultInkCharge } from "@/store/modules/config";

export default {
  data: function () {
    return {
      error: false,
      width: window.innerWidth,
      date: new Date(DateTime.now().toFormat("yyyy-MM-dd")),
      studentId: "",
      size: defaultInkCharge[defaultInkCharge.length - 1].id,
      count: 1,
    };
  },
  computed: {
    inline: function () {
      return this.width >= 769;
    },
    studentIdFormCheck: function () {
      let type = "";
      let message = "";
      if (
        this.$store.getters["members/findName"](this.studentId) == "" &&
        this.error
      ) {
        type = "is-danger";
        message = "学籍番号は正しいですか？";
      }

      return { type, message };
    },
  },
  created: function () {
    this.$store.dispatch("members/getData");

    window.addEventListener("resize", this.handleResize, false);
  },
  beforeDestroy: function () {
    this.$store.dispatch("togglePageMovedFlag");
    window.removeEventListener("resize", this.handleResize, false);
  },
  methods: {
    handleResize: function () {
      this.width = window.innerWidth;
    },
    countUp: function () {
      let numCount = Number(
        String(this.count).replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
          return String.fromCharCode(s.charCodeAt(0) - 65248);
        })
      );
      this.count = numCount + 1;
    },
    countDown: function () {
      let numCount = Number(
        String(this.count).replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
          return String.fromCharCode(s.charCodeAt(0) - 65248);
        })
      );
      if (numCount >= 2) {
        this.count = numCount - 1;
      }
    },
    submitForm: async function () {
      if (this.$store.getters["members/findName"](this.studentId) == "") {
        this.error = true;
      }
      if (!this.error) {
        const data = {
          date: Number(DateTime.fromJSDate(this.date).toFormat("yyyyMMdd")),
          studentId: this.studentId,
          name: this.$store.getters["members/findName"](this.studentId),
          size: this.size,
          count: this.count,
          paperType: 0,
        };
        await this.$store.dispatch("printjobs/createPrintjob", data);
        // if (
        //   !this.$store.state.common.pageMovedFlag &&
        //   remote.process.argv.findIndex((arg) => arg == "--new") >= 0
        // ) {
        //   require("electron").remote.getCurrentWindow().close();
        // }
        this.$router.push({ name: "ThePrintjobsTop" });
      }
    },
    clearError: function () {
      this.error = false;
    },
  },
};
</script>

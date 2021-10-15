<template>
  <div>
    <main>
      <div class="section">
        <div class="container">
          <div class="columns is-variable is-1">
            <div class="column is-10">
              <div class="columns is-variable is-1 is-mobile">
                <div class="column">
                  <b-field
                    :type="formError.name.type"
                    :message="formError.name.message"
                  >
                    <b-input
                      v-model="form.name"
                      placeholder="名前"
                      size="is-small"
                      @input="clearError('name')"
                      @keyup.native.enter="submit"
                    ></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field
                    :type="formError.studentId.type"
                    :message="formError.studentId.message"
                  >
                    <b-input
                      v-model="form.studentId"
                      placeholder="学籍番号"
                      size="is-small"
                      @input="clearError('studentId')"
                      @keyup.enter.native="submit"
                    ></b-input>
                  </b-field>
                </div>
              </div>
            </div>
            <div class="column">
              <button
                class="button is-info is-small is-fullwidth"
                @click="submit"
              >
                <span class="icon"><i class="fab fa-telegram-plane"></i></span
                ><span>登録</span>
              </button>
            </div>
          </div>
          <b-table
            :data="$store.state.members.members"
            :columns="columns"
            :mobile-cards="false"
            checkable="checkable"
            :checked-rows.sync="deleteTarget"
            :default-sort="['studentId', 'asc']"
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
    <b-modal
      has-modal-card="has-modal-card"
      :active.sync="deleteModalActive"
      :can-cancel="['outside']"
    >
      <delete-modal
        :targets="deleteTarget"
        @delete="
          deleteTarget = [];
          deleteModalActive = false;
        "
      ></delete-modal>
    </b-modal>
    <footer>
      <div class="container">
        <div class="columns is-mobile is-gapless">
          <div class="column">
            <router-link
              class="button is-primary is-fullwidth"
              :to="{ name: 'TheMembersBulkNew' }"
              style="border-radius: 6px 0 0 6px; border-right-width: 1px"
              >一括追加</router-link
            >
          </div>
          <div class="column">
            <button
              class="button is-danger is-fullwidth"
              style="border-radius: 0 6px 6px 0; border-left-width: 1px"
              @click="deleteModalActive = true"
            >
              <span class="icon"><i class="fas fa-trash"></i></span
              ><span>削除</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import deleteModal from "@/components/TheMembersTopDeleteModal";

let timer;
let mainElement;

export default {
  components: { deleteModal },
  data: function () {
    return {
      form: {
        name: "",
        studentId: "",
      },
      error: { name: false, studentId: false },
      deleteModalActive: false,
      deleteTarget: [],
      columns: [
        {
          field: "studentId",
          label: "学籍番号",
          sortable: true,
          centered: true,
        },
        {
          field: "name",
          label: "名前",
          sortable: true,
          centered: true,
        },
      ],
    };
  },
  computed: {
    formError: function () {
      let result = {
        name: { type: "", message: "" },
        studentId: { type: "", message: "" },
      };
      if (this.form.name.trim() == "" && this.error.name) {
        result.name.type = "is-danger";
        result.name.message = "入力してください";
      }
      if (
        !/^\d{2}[_BMR]\d{5}$/.test(this.form.studentId.trim().toUpperCase()) &&
        this.error.studentId
      ) {
        result.studentId.type = "is-danger";
        result.studentId.message = "半角英数字で入力してください";
      }
      if (
        this.$store.getters["members/studentIdList"].indexOf(
          this.form.studentId
        ) >= 0 &&
        this.error.studentId
      ) {
        result.studentId.type = "is-danger";
        result.studentId.message = "その学籍番号はすでに登録されています";
      }
      return result;
    },
  },
  mounted: function () {
    this.$store.dispatch("members/getData");

    const timeoutFunction = () => {
      this.$router.push({ name: "ThePrintjobsNew" });
    };
    const timeoutThreshold = this.$store.state.config.timeoutThreshold * 1000;
    if (timeoutThreshold > 0) {
      let pivot = 0;
      timer = setTimeout(timeoutFunction, timeoutThreshold);
      mainElement = document.getElementsByTagName("main")[0];
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
  destroyed: function () {
    clearTimeout(timer);
    document.body.onmouseover = null;
    mainElement.onscroll = null;
  },
  methods: {
    submit: function () {
      const data = {
        studentId: this.form.studentId.trim().toUpperCase(),
        name: this.form.name.trim(),
      };
      let errorFlag = false;
      if (data.name == "") {
        errorFlag = true;
      }
      if (!/^\d{2}[_BMR]\d{5}$/.test(data.studentId)) {
        errorFlag = true;
      }
      if (
        this.$store.getters["members/studentIdList"].indexOf(
          this.form.studentId
        ) >= 0
      ) {
        errorFlag = true;
      }
      if (!errorFlag) {
        this.$store.dispatch("members/createMember", data);
        Object.keys(this.form).forEach((key) => {
          this.form[key] = "";
        });
      } else {
        Object.keys(this.error).forEach((key) => {
          this.error[key] = true;
        });
      }
    },
    clearError: function (form) {
      this.error[form] = false;
    },
  },
};
</script>

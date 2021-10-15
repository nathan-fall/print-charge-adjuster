<template>
  <div>
    <main>
      <div class="section">
        <div class="container">
          <h1 class="printer-only">
            {{ $store.getters["printjobs/chargeList"].from }} 〜
            {{ $store.getters["printjobs/chargeList"].to }} の印刷代
          </h1>
          <b-table
            :data="$store.getters['printjobs/chargeList'].data"
            :columns="columns"
            checkable="checkable"
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
      :active.sync="collectModalActive"
      :can-cancel="['outside']"
    >
      <collect-modal
        @collect="
          collectModalActive = false;
          $router.push({ name: 'ThePrintjobsTop' });
        "
      ></collect-modal>
    </b-modal>
    <b-modal
      has-modal-card="has-modal-card"
      :active.sync="rollbackModalActive"
      :can-cancel="['outside']"
    >
      <rollback-modal @rollback="rollbackModalActive = false"></rollback-modal>
    </b-modal>
    <b-modal
      has-modal-card="has-modal-card"
      :active.sync="inkChargeConfigModalActive"
      :can-cancel="false"
    >
      <ink-charge-config-modal
        @confirmed="inkChargeConfigModalActive = false"
      ></ink-charge-config-modal>
    </b-modal>
    <footer>
      <div class="container">
        <div class="columns is-mobile is-gapless">
          <div class="column">
            <button
              class="button is-link is-fullwidth"
              style="border-radius: 6px 0 0 6px; border-right-width: 1px"
              @click="print"
            >
              <span class="icon"><i class="fas fa-print"></i></span
              ><span>印刷</span>
            </button>
          </div>
          <div class="column">
            <div class="dropdown is-up is-hoverable" style="width: 100%">
              <div class="dropdown-trigger" style="width: 100%">
                <button
                  class="button is-primary is-fullwidth"
                  style="
                    border-radius: 0 0 0 0;
                    border-left-width: 1px;
                    border-right-width: 1px;
                  "
                >
                  <span class="icon"><i class="fas fa-receipt"></i></span
                  ><span>操作</span>
                </button>
              </div>
              <div class="dropdown-menu">
                <div class="dropdown-content">
                  <a class="dropdown-item" @click="collectModalActive = true"
                    >【清算済み】にする</a
                  ><a class="dropdown-item" @click="rollbackModalActive = true"
                    >【未清算】に戻す</a
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <router-link
              class="button is-fullwidth"
              to="{ name: 'ThePrintjobsTop' }"
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
import collectModal from "../../components/ThePrintjobsCalcCollectModal";
import rollbackModal from "../../components/ThePrintjobsCalcRollbackModal";
import inkChargeConfigModal from "../../components/ThePrintjobsCalcInkChargeModal";

export default {
  components: { collectModal, rollbackModal, inkChargeConfigModal },
  data: function () {
    return {
      collectModalActive: false,
      rollbackModalActive: false,
      inkChargeConfigModalActive: true,
      columns: [
        {
          field: "name",
          label: "お名前",
          centered: true,
        },
        {
          field: "price",
          label: "印刷代金",
          centered: true,
        },
        {
          field: "list",
          label: "印刷内容",
          centered: true,
        },
      ],
    };
  },
  methods: {
    print: function () {
      window.print();
    },
  },
};
</script>

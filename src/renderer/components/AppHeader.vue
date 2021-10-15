<template>
  <div class="tabs is-boxed is-centered">
    <ul>
      <router-link
        v-slot="{ href, isActive }"
        custom
        :to="{ name: 'ThePrintjobsTop' }"
      >
        <li :class="{ 'is-active': isActive }">
          <a :href="href"
            ><span class="icon is-small"><i class="fas fa-print"></i></span
            ><span>印刷履歴</span></a
          >
        </li></router-link
      >
      <router-link
        v-slot="{ href, isActive }"
        custom
        :to="{ name: 'TheMembersTop' }"
      >
        <li :class="{ 'is-active': isActive }">
          <a :href="href"
            ><span class="icon is-small"><i class="fas fa-users"></i></span
            ><span>名簿</span></a
          >
        </li></router-link
      >
      <router-link
        v-slot="{ href, isActive }"
        custom
        :to="{ name: 'TheConfigTop' }"
      >
        <li :class="{ 'is-active': isActive }">
          <a :href="href"
            ><span class="icon is-small"><i class="fas fa-cog"></i></span
            ><span>設定</span></a
          >
        </li></router-link
      >
    </ul>
  </div>
</template>

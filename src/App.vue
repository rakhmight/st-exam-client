<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  }),
}
</script>

<style>
html{
  overflow-y: auto;
}

.v-main{
  background-color: var(--bg-color)
}

::-webkit-scrollbar {
    width: 12px;
    background-color: #b9b9b9;
    display: none;
}

::-webkit-scrollbar-thumb {
    background-color: #1b6eec9a;
    border-radius: 1em;
}

:root{
  --main-color: #0d5fd8;
  --special-color: #0c2242;;
  --bg-color: #D9E3E3;
  --red-color: #d53b12;
}

*{
  overflow-y: auto;
}
</style>

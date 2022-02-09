<script lang="ts" setup>
import {defineProps} from 'vue'
import SearchFilter from '../components/SearchFilter.vue'
import SearchResult from '../components/SearchResult.vue'

const props = defineProps({
  options: Object
})

const onSubmit = (event: Event) => {
  event.preventDefault()
  alert('submitted!')
}
</script>

<template>
  <div class="search-page">
    <form @submit="onSubmit">
      <div class="search-form">
        <SearchFilter :options="props.options"></SearchFilter>
        <div class="search-form__footer">
          <button class="button">
            Найти
          </button>
        </div>
      </div>
    </form>
    <SearchResult></SearchResult>
  </div>
</template>

<style lang="scss">
.search-form {
  background-color: #e1ebf3;
  padding: 48px 0;
}
</style>
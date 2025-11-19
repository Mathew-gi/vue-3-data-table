<script setup>
import { ref } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { useThemeStore } from '@/stores/themeStore';

const dataStore = useDataStore();
const themeStore = useThemeStore();
const titleFilter = ref('');

function handleSearch() {
  dataStore.fetchPosts(titleFilter.value);
}
</script>

<template>
  <header class="p-4 shadow-md bg-white dark:bg-gray-800 transition-colors duration-300">
    <div class="max-w-xl mx-auto flex items-center space-x-4">
      
      <input
        v-model="titleFilter"
        type="text"
        placeholder="Поиск по заголовку публикации..."
        class="grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        @keyup.enter="handleSearch"
      />
      
      <button
        @click="handleSearch"
        :disabled="dataStore.isLoading"
        :class="[
          'px-4 py-2 rounded-md transition duration-150 cursor-pointer',
          dataStore.isLoading 
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-200'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
        ]"
      >
        <span v-if="dataStore.isLoading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Загрузка...
        </span>
        <span v-else>Поиск</span>
      </button>
      
      <button
        @click="themeStore.toggleTheme"
        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150"
        :title="themeStore.isDarkTheme ? 'Светлая тема' : 'Темная тема'"
      >
        <span v-if="themeStore.isDarkTheme">🌙</span>
        <span v-else>☀️</span>
      </button>
    </div>
  </header>
</template>
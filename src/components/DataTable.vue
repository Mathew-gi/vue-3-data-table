<script setup>
import { useDataStore } from '@/stores/dataStore';
import { onMounted, ref, watch, onUnmounted } from 'vue';

const store = useDataStore();
const tableContainer = ref(null);
const loadMoreSentinel = ref(null);
const sortKey = ref(null);
const sortDirection = ref('asc');

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Заголовок' },
  { key: 'email', label: 'Автор' },
  { key: 'body', label: 'Контент' },
];

const emit = defineEmits(['openUserModal']);

function handleSort(key) {
  const newDirection = sortKey.value === key && sortDirection.value === 'asc' ? 'desc' : 'asc';
  
  sortKey.value = key;
  sortDirection.value = newDirection;
  
  store.sortPosts(key, newDirection === 'asc');
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && store.posts.length < store.allPosts.length && !store.isLoading) {
      store.loadMorePosts();
    }
  }, {
    root: tableContainer.value,
    threshold: 0.1, 
  });
  
  watch(loadMoreSentinel, (newSentinel) => {
    if (newSentinel) {
      observer.observe(newSentinel);
    }
  }, { immediate: true });
  
  onUnmounted(() => observer.disconnect());
});
</script>

<template>
  <div class="p-4">
    <div 
      ref="tableContainer"
      class="mx-auto w-[600px] h-[600px] overflow-y-scroll overflow-x-hidden bg-white dark:bg-gray-800 shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300"
    >
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="sticky top-0 bg-gray-100 dark:bg-gray-700 z-10 shadow-md">
          <tr>
            <th 
              v-for="col in columns" 
              :key="col.key" 
              @click="handleSort(col.key)"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-150"
              :class="{ 'w-1/12': col.key === 'id', 'w-3/12': col.key === 'email' }"
            >
              {{ col.label }} 
              <span v-if="sortKey === col.key" class="ml-1">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
          </tr>
        </thead>
        
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          
          <tr v-if="store.errorMessage">
             <td :colspan="columns.length" class="px-4 py-8 text-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-semibold">
                {{ store.errorMessage }}
             </td>
          </tr>
          
          <tr v-else-if="store.isLoading && store.posts.length === 0" v-for="i in 15" :key="i" class="animate-pulse">
            <td v-for="j in columns.length" :key="j" class="px-4 py-3">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </td>
          </tr>

          <tr v-else v-for="post in store.posts" :key="post.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              {{ post.id }}
            </td>
            <td 
              class="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis"
              :title="post.title"
            >
              {{ post.title }}
            </td>
            <td 
              @click="emit('openUserModal', post.userId)"
              :class="[
                  'px-4 py-3 whitespace-nowrap text-sm cursor-pointer',
                  store.isUserViewed(post.userId) 
                    ? 'text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 font-semibold' 
                    : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200'
              ]"
              :title="`Открыть профиль пользователя: ${store.getUserEmail(post.userId)}`"
            >
              {{ store.getUserEmail(post.userId) }}
            </td>
            <td 
              class="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"
              :title="post.body.replace(/\n/g, ' ')"
            >
              {{ post.body }}
            </td>
          </tr>
        </tbody>
      </table>

      <div 
        v-if="store.posts.length < store.allPosts.length" 
        class="h-10 flex justify-center items-center text-gray-400 dark:text-gray-600"
        ref="loadMoreSentinel"
      >
        ... Подгрузка данных ...
      </div>
      
    </div>
  </div>
</template>
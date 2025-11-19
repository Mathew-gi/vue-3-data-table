<script setup>
import { onMounted, ref } from 'vue';
import TheHeader from '@/components/TheHeader.vue';
import DataTable from '@/components/DataTable.vue';
import UserModal from '@/components/UserModal.vue';
import { useDataStore } from '@/stores/dataStore';
import { useThemeStore } from '@/stores/themeStore';

const dataStore = useDataStore();
const themeStore = useThemeStore();

const selectedUserId = ref(null);

function openModal(userId) {
  selectedUserId.value = userId;
}

function closeModal() {
  selectedUserId.value = null;
}

onMounted(() => {
  themeStore.initializeTheme();
  dataStore.fetchUsers();
  dataStore.fetchPosts();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    
    <TheHeader />
    
    <div v-if="dataStore.errorMessage" class="p-4">
      <div class="max-w-xl mx-auto bg-red-500 text-white p-3 rounded-md text-center font-medium shadow-lg">
        {{ dataStore.errorMessage }}
      </div>
    </div>
    
    <main class="py-8">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white transition-colors duration-300">
        Публикации
      </h1>
      
      <DataTable @open-user-modal="openModal" />
      
    </main>
    
    <Teleport to="body">
      <UserModal 
        v-if="selectedUserId" 
        :user-id="selectedUserId" 
        @close="closeModal" 
      />
    </Teleport>

  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';

const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close']);
const store = useDataStore();

const user = computed(() => store.getUserById(props.userId));

const fullAddress = computed(() => {
  if (!user.value || !user.value.address) return 'Адрес отсутствует';
  const { street, suite, city } = user.value.address;

  const parts = [street, suite, city].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Адрес отсутствует';
});

function closeModal() {
  store.markUserAsViewed(props.userId);
  emit('close');
}
</script>

<template>
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100">
      
      <div class="flex justify-between items-start">
        <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white">
          👤 {{ user?.name || 'Нет данных' }}
        </h3>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-150 text-3xl leading-none"
        >
          &times;
        </button>
      </div>
      
      <div class="mt-6 space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <p><strong class="font-semibold text-gray-900 dark:text-white">Логин:</strong> {{ user?.username || '—' }}</p>
        <p><strong class="font-semibold text-gray-900 dark:text-white">Email:</strong> {{ user?.email || '—' }}</p>
        <p><strong class="font-semibold text-gray-900 dark:text-white">Телефон:</strong> {{ user?.phone || '—' }}</p>
        <p>
          <strong class="font-semibold text-gray-900 dark:text-white">Веб-сайт: </strong> 
          <a v-if="user?.website" :href="`http://${user.website}`" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">
            {{ user.website }}
          </a>
          <span v-else>—</span>
        </p>
        <p><strong class="font-semibold text-gray-900 dark:text-white">Компания:</strong> {{ user?.company?.name || '—' }}</p>
        <p><strong class="font-semibold text-gray-900 dark:text-white">Адрес:</strong> {{ fullAddress }}</p>
      </div>

      <button 
        @click="closeModal"
        class="mt-8 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 font-semibold shadow-md"
      >
        Закрыть
      </button>
    </div>
  </div>
</template>
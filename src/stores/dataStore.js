import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
const USERS_URL = 'https://jsonplaceholder.typicode.com/users';
const POSTS_PER_PAGE = 30;

const MOCK_USERS = [
  {
    "id": 1, 
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": { "street": "Kulas Light", "suite": "Apt. 556", "city": "Gwenborough" },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": { "name": "Romaguera-Crona" }
  },
  {
    "id": 2, 
    "name": "Ervin Howell",
    "username": "Antonette",
    "email": "Shanna@melissa.tv",
    "address": { "street": "Victor Plains", "suite": "Suite 879", "city": "Wisokyburgh" },
    "phone": "010-692-7773",
    "website": "anastasia.net",
    "company": { "name": "Deckow-Crist" }
  }
];

const MOCK_POSTS = [
  { "userId": 1, "id": 1, "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit", "body": "quia et suscipit..." },
  { "userId": 2, "id": 2, "title": "qui est esse", "body": "est rerum tempore vitae..." },
  { "userId": 1, "id": 3, "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut", "body": "et iusto sed quo iure..." },
  { "userId": 1, "id": 4, "title": "eum et est occaecati", "body": "tempore vitae..." },
  { "userId": 2, "id": 5, "title": "nesciunt quas odio", "body": "laborum est quidem..." },
  { "userId": 1, "id": 6, "title": "dolorem eum magni", "body": "omnis eligendi aut ad..." },
];

const USE_MOCK_DATA = false;

export const useDataStore = defineStore('data', () => {
  const allPosts = ref([]);
  const posts = ref([]);
  const users = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref(null);
  const currentPage = ref(1);
  const viewedUserIds = ref(JSON.parse(localStorage.getItem('viewedUserIds') || '[]'));

  async function fetchUsers() {
   if (USE_MOCK_DATA) {
      users.value = MOCK_USERS;
      return; 
   }
   
   try {
     const response = await axios.get(USERS_URL);
     users.value = response.data;
   } catch (e) {
     errorMessage.value = 'Сервис временно недоступен. Пожалуйста, попробуйте позже.';
   }
}

async function fetchPosts(titleFilter = '') {
   isLoading.value = true;
   errorMessage.value = null;

   if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredPosts = MOCK_POSTS;
      if (titleFilter) {
          filteredPosts = MOCK_POSTS.filter(p => p.title.includes(titleFilter));
      }

      allPosts.value = filteredPosts;
      currentPage.value = 1;
      loadInitialPosts();
      isLoading.value = false;
      return;
   }
   
   let url = POSTS_URL;
   if (titleFilter) {
     url += `?title_like=${titleFilter}`; 
   }

   try {
     const response = await axios.get(url);
     allPosts.value = response.data;
     currentPage.value = 1;
     loadInitialPosts();
   } catch (e) {
     errorMessage.value = 'Сервис временно недоступен. Пожалуйста, попробуйте позже.';
     allPosts.value = [];
     posts.value = [];
   } finally {
     isLoading.value = false;
   }
}

  function loadInitialPosts() {
    posts.value = allPosts.value.slice(0, POSTS_PER_PAGE);
  }

  function loadMorePosts() {
    if (posts.value.length < allPosts.value.length && !isLoading.value) {
      currentPage.value++;
      const start = (currentPage.value - 1) * POSTS_PER_PAGE;
      const end = currentPage.value * POSTS_PER_PAGE;
      posts.value.push(...allPosts.value.slice(start, end));
    }
  }

  function sortPosts(key, isAsc) {
    allPosts.value.sort((a, b) => {
      let valA, valB;
      
      if (key === 'email') {
        valA = getUserEmail.value(a.userId) || '';
        valB = getUserEmail.value(b.userId) || '';
      } else {
        valA = a[key];
        valB = b[key];
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        const comparison = valA.localeCompare(valB);
        return isAsc ? comparison : -comparison;
      }
      
      const comparison = valA - valB;
      return isAsc ? comparison : -comparison;
    });

    currentPage.value = 1;
    loadInitialPosts();
  }
  
  function markUserAsViewed(userId) {
      if (!viewedUserIds.value.includes(userId)) {
          viewedUserIds.value.push(userId);
          localStorage.setItem('viewedUserIds', JSON.stringify(viewedUserIds.value));
      }
  }

  const getUserEmail = computed(() => (userId) => {
    return users.value.find(u => u.id === userId)?.email || 'Неизвестный Email';
  });

  const getUserById = computed(() => (userId) => {
    return users.value.find(u => u.id === userId);
  });
  
  const isUserViewed = computed(() => (userId) => {
    return viewedUserIds.value.includes(userId);
  });


  return { 
    posts, allPosts, users, isLoading, errorMessage, 
    fetchUsers, fetchPosts, loadMorePosts, sortPosts, 
    getUserEmail, getUserById, markUserAsViewed, isUserViewed
  };
});
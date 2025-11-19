import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDarkTheme = ref(false);

  function initializeTheme() {
    const savedTheme = localStorage.getItem("isDarkTheme");
    if (savedTheme !== null) {
      isDarkTheme.value = JSON.parse(savedTheme);
    } else {
      isDarkTheme.value = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    }
    applyThemeClass();
  }

  function toggleTheme() {
    isDarkTheme.value = !isDarkTheme.value;
    localStorage.setItem("isDarkTheme", JSON.stringify(isDarkTheme.value));
    applyThemeClass();
  }

function applyThemeClass() {
    const html = document.documentElement;
    
    if (isDarkTheme.value) {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
    }

}

  return { 
    isDarkTheme,
    initializeTheme,
    toggleTheme,
  };
});

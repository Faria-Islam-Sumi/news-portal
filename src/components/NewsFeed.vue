<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-4xl font-bold text-white mb-2">Latest News</h1>
        <p class="text-gray-400">Stay updated with the latest stories</p>
      </div>
      <router-link
        v-if="user"
        to="/create"
        class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create News
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && news.length === 0" class="text-center py-20">
      <svg class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-300 mb-2">No News Yet</h3>
      <p class="text-gray-500">Be the first to create a news article!</p>
    </div>

    <!-- News Grid -->
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="item in news"
        :key="item.id"
        class="bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1"
      >
        <!-- Card Header -->
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h2 class="text-xl font-bold text-white mb-2 line-clamp-2">{{ item.title }}</h2>
              <p class="text-gray-400 text-sm">
                By <span class="text-blue-400 font-medium">{{ getAuthorName(item.author_id) }}</span>
              </p>
            </div>
          </div>

          <!-- Body Preview -->
          <p class="text-gray-300 mb-4 line-clamp-3">{{ item.body }}</p>

          <!-- Stats -->
          <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {{ item.comments ? item.comments.length : 0 }} comments
            </span>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2">
            <router-link
              :to="'/news/' + item.id"
              class="flex-1 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Read More
            </router-link>
            <router-link
              v-if="canEdit(item)"
              :to="'/edit/' + item.id"
              class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Edit
            </router-link>
            <button
              v-if="canEdit(item)"
              @click="confirmDelete(item.id)"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
        <h3 class="text-xl font-bold text-white mb-4">Confirm Delete</h3>
        <p class="text-gray-300 mb-6">Are you sure you want to delete this news article? This action cannot be undone.</p>
        <div class="flex gap-3">
          <button
            @click="deleteNews"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Delete
          </button>
          <button
            @click="showDeleteModal = false; deleteId = null"
            class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiFetch, getCurrentUser } from '../app.js';

export default {
  data() {
    return {
      news: [],
      users: [],
      user: null,
      loading: true,
      showDeleteModal: false,
      deleteId: null
    };
  },
  async created() {
    this.user = getCurrentUser();
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const [newsItems, usersData] = await Promise.all([
          apiFetch('/news'),
          apiFetch('/users')
        ]);
        this.news = newsItems;
        this.users = usersData;
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        this.loading = false;
      }
    },
    getAuthorName(authorId) {
      const author = this.users.find(u => u.id === authorId);
      return author ? author.name : 'Unknown';
    },
    canEdit(item) {
      return this.user && this.user.id === item.author_id;
    },
    confirmDelete(id) {
      this.deleteId = id;
      this.showDeleteModal = true;
    },
    async deleteNews() {
      try {
        await apiFetch(`/news/${this.deleteId}`, { method: 'DELETE' });
        this.showDeleteModal = false;
        this.deleteId = null;
        await this.loadData();
      } catch (error) {
        alert(error.message || 'Failed to delete news');
      }
    }
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

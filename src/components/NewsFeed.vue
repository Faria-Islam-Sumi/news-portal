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

    <!-- Search Bar -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        v-model="searchQuery"
        @input="debouncedSearch"
        placeholder="Search news by title..."
        class="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Results Info -->
    <div v-if="!loading && pagination.totalItems > 0" class="text-gray-400 text-sm">
      Showing {{ (pagination.currentPage - 1) * pagination.itemsPerPage + 1 }} - 
      {{ Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems) }} 
      of {{ pagination.totalItems }} articles
      <span v-if="searchQuery"> matching "{{ searchQuery }}"</span>
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
      <h3 class="text-xl font-semibold text-gray-300 mb-2">
        {{ searchQuery ? 'No Results Found' : 'No News Yet' }}
      </h3>
      <p class="text-gray-500">
        {{ searchQuery ? 'Try a different search term' : 'Be the first to create a news article!' }}
      </p>
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Clear Search
      </button>
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

          <!-- Stats - Comment Count -->
          <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <span class="flex items-center bg-gray-700/50 px-3 py-1 rounded-full">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span class="text-gray-300 font-medium">{{ item.commentCount || 0 }}</span>
              <span class="ml-1">{{ item.commentCount === 1 ? 'comment' : 'comments' }}</span>
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

    <!-- Pagination -->
    <div v-if="!loading && pagination.totalPages > 1" class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
      <div class="flex items-center gap-2">
        <!-- First Page -->
        <button
          @click="goToPage(1)"
          :disabled="!pagination.hasPrevPage"
          class="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="First page"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        
        <!-- Previous Page -->
        <button
          @click="goToPage(pagination.currentPage - 1)"
          :disabled="!pagination.hasPrevPage"
          class="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Page Numbers -->
        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              page === pagination.currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <!-- Next Page -->
        <button
          @click="goToPage(pagination.currentPage + 1)"
          :disabled="!pagination.hasNextPage"
          class="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Last Page -->
        <button
          @click="goToPage(pagination.totalPages)"
          :disabled="!pagination.hasNextPage"
          class="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Last page"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Page Info -->
      <div class="text-gray-500 text-sm">
        Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
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
      deleteId: null,
      searchQuery: '',
      searchTimeout: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 9,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  },
  computed: {
    visiblePages() {
      const pages = [];
      const total = this.pagination.totalPages;
      const current = this.pagination.currentPage;
      
      let start = Math.max(1, current - 2);
      let end = Math.min(total, start + 4);
      
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  async created() {
    this.user = getCurrentUser();
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const params = new URLSearchParams({
          page: this.pagination.currentPage,
          limit: this.pagination.itemsPerPage
        });
        
        if (this.searchQuery.trim()) {
          params.append('search', this.searchQuery.trim());
        }

        const [newsResponse, usersData] = await Promise.all([
          apiFetch(`/news?${params.toString()}`),
          apiFetch('/users')
        ]);
        
        this.news = newsResponse.data;
        this.pagination = newsResponse.pagination;
        this.users = usersData;
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        this.loading = false;
      }
    },
    debouncedSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.currentPage = 1;
        this.loadData();
      }, 300);
    },
    clearSearch() {
      this.searchQuery = '';
      this.pagination.currentPage = 1;
      this.loadData();
    },
    goToPage(page) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.pagination.currentPage = page;
        this.loadData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- News Content -->
    <div v-else-if="newsItem" class="space-y-6">
      <!-- Back Button -->
      <router-link
        to="/"
        class="inline-flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to News Feed
      </router-link>

      <!-- Article Card -->
      <div class="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
        <div class="p-8">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-4xl font-bold text-white mb-4">{{ newsItem.title }}</h1>
            <div class="flex items-center space-x-4 text-gray-400">
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                By <span class="text-blue-400 font-medium ml-1">{{ getAuthorName(newsItem.author_id) }}</span>
              </span>
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {{ newsItem.comments.length }} comments
              </span>
            </div>
          </div>

          <!-- Body -->
          <div class="prose prose-invert max-w-none mb-8">
            <p class="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{{ newsItem.body }}</p>
          </div>

          <!-- Action Buttons -->
          <div v-if="canEdit(newsItem)" class="flex gap-3 pt-6 border-t border-gray-700">
            <router-link
              :to="'/edit/' + newsItem.id"
              class="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium"
            >
              Edit Article
            </router-link>
            <button
              @click="confirmDelete"
              class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Delete Article
            </button>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-8">
        <h3 class="text-2xl font-bold text-white mb-6">Comments ({{ newsItem.comments.length }})</h3>

        <!-- Comments List -->
        <div class="space-y-4 mb-8">
          <div
            v-for="comment in newsItem.comments"
            :key="comment.id"
            class="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
          >
            <div class="flex items-start justify-between mb-2">
              <span class="text-blue-400 font-medium">{{ getUserName(comment.user_id) }}</span>
              <span class="text-gray-500 text-sm">{{ formatDate(comment.timestamp) }}</span>
            </div>
            <p class="text-gray-300">{{ comment.text }}</p>
          </div>
          
          <div v-if="newsItem.comments.length === 0" class="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        </div>

        <!-- Add Comment Form -->
        <div v-if="user" class="border-t border-gray-700 pt-6">
          <h4 class="text-lg font-semibold text-white mb-4">Add a Comment</h4>
          <form @submit.prevent="addComment">
            <textarea
              v-model="newComment"
              rows="4"
              required
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              placeholder="Share your thoughts..."
            ></textarea>
            <div class="flex justify-end mt-4">
              <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {{ submitting ? 'Posting...' : 'Post Comment' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Login Prompt -->
        <div v-else class="border-t border-gray-700 pt-6">
          <div class="text-center py-8 bg-gray-900/50 rounded-lg">
            <p class="text-gray-400 mb-4">Please log in to comment</p>
            <router-link
              to="/login"
              class="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Log In
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
        <h3 class="text-xl font-bold text-white mb-4">Confirm Delete</h3>
        <p class="text-gray-300 mb-6">Are you sure you want to delete this article? This action cannot be undone.</p>
        <div class="flex gap-3">
          <button
            @click="deleteArticle"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Delete
          </button>
          <button
            @click="showDeleteModal = false"
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
      newsItem: null,
      users: [],
      newComment: '',
      user: null,
      loading: true,
      submitting: false,
      showDeleteModal: false
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
        const newsId = this.$route.params.id;
        const [item, usersData] = await Promise.all([
          apiFetch(`/news/${newsId}`),
          apiFetch('/users')
        ]);
        this.newsItem = item;
        this.users = usersData;
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load news article');
        this.$router.push('/');
      } finally {
        this.loading = false;
      }
    },
    getUserName(userId) {
      const user = this.users.find(u => u.id === userId);
      return user ? user.name : 'Unknown';
    },
    getAuthorName(authorId) {
      const author = this.users.find(u => u.id === authorId);
      return author ? author.name : 'Unknown';
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    canEdit(item) {
      return this.user && this.user.id === item.author_id;
    },
    async addComment() {
      if (!this.newComment.trim()) return;
      
      this.submitting = true;
      try {
        const newsId = this.$route.params.id;
        const newComment = {
          id: Date.now(),
          text: this.newComment.trim(),
          user_id: this.user.id,
          timestamp: new Date().toISOString()
        };
        const updatedComments = [...this.newsItem.comments, newComment];
        
        await apiFetch(`/news/${newsId}`, {
          method: 'PATCH',
          body: JSON.stringify({ comments: updatedComments })
        });
        
        this.newComment = '';
        await this.loadData();
      } catch (error) {
        alert(error.message || 'Failed to add comment');
      } finally {
        this.submitting = false;
      }
    },
    confirmDelete() {
      this.showDeleteModal = true;
    },
    async deleteArticle() {
      try {
        const newsId = this.$route.params.id;
        await apiFetch(`/news/${newsId}`, { method: 'DELETE' });
        this.$router.push('/');
      } catch (error) {
        alert(error.message || 'Failed to delete article');
        this.showDeleteModal = false;
      }
    }
  }
};
</script>

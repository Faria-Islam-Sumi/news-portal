<template>
  <div class="max-w-3xl mx-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else>
      <!-- Back Button -->
      <router-link
        to="/"
        class="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to News Feed
      </router-link>

      <!-- Form Card -->
      <div class="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-8">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-white mb-2">Edit News Article</h1>
          <p class="text-gray-400">Update your article content</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="updateNews" class="space-y-6">
          <!-- Title Input -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-300 mb-2">
              Article Title <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              v-model="title"
              required
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter a compelling title..."
            />
          </div>

          <!-- Body Textarea -->
          <div>
            <label for="body" class="block text-sm font-medium text-gray-300 mb-2">
              Article Content <span class="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              v-model="body"
              rows="12"
              required
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              placeholder="Write your article content here... (minimum 20 characters)"
            ></textarea>
            <div class="flex justify-between items-center mt-2">
              <p class="text-sm text-gray-500">Minimum 20 characters required</p>
              <p :class="[
                'text-sm',
                body.length < 20 ? 'text-red-400' : 'text-green-400'
              ]">
                {{ body.length }} / 20
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="submitting || body.length < 20"
              class="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <svg v-if="submitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Updating...' : 'Update Article' }}
            </button>
            <router-link
              to="/"
              class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-center"
            >
              Cancel
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { apiFetch, getCurrentUser } from '../app.js';

export default {
  data() {
    return {
      title: '',
      body: '',
      user: null,
      loading: true,
      submitting: false,
      errorMessage: ''
    };
  },
  async created() {
    this.user = getCurrentUser();
    if (!this.user) {
      this.$router.push('/login');
      return;
    }
    
    try {
      const newsId = this.$route.params.id;
      const newsItem = await apiFetch(`/news/${newsId}`);
      
      if (newsItem.author_id !== this.user.id) {
        alert('You can only edit your own articles');
        this.$router.push('/');
        return;
      }
      
      this.title = newsItem.title;
      this.body = newsItem.body;
    } catch (error) {
      alert('Failed to load article');
      this.$router.push('/');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async updateNews() {
      this.errorMessage = '';
      
      if (this.body.length < 20) {
        this.errorMessage = 'News body must be at least 20 characters.';
        return;
      }
      
      this.submitting = true;
      try {
        const newsId = this.$route.params.id;
        await apiFetch(`/news/${newsId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: this.title,
            body: this.body
          })
        });
        this.$router.push('/');
      } catch (error) {
        this.errorMessage = error.message || 'Failed to update article';
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

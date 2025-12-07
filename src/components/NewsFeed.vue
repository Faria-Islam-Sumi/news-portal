
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>News Feed</h1>
      <router-link to="/create" class="btn btn-primary">Create News</router-link>
    </div>
    <div class="list-group">
      <div v-for="item in news" :key="item.id" class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ item.title }}</h5>
          <small>{{ new Date(item.createdAt).toLocaleDateString() }}</small>
        </div>
        <p class="mb-1">By {{ item.author.name }}</p>
        <div class="mt-2">
          <router-link :to="'/news/' + item.id" class="btn btn-secondary btn-sm me-2">View Details</router-link>
          <router-link v-if="canEdit(item)" :to="'/edit/' + item.id" class="btn btn-warning btn-sm me-2">Edit</router-link>
          <button v-if="canEdit(item)" @click="deleteNews(item.id)" class="btn btn-danger btn-sm">Delete</button>
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
      user: null
    };
  },
  async created() {
    this.user = getCurrentUser();
    this.loadNews();
  },
  methods: {
    async loadNews() {
      const newsItems = await apiFetch('/news?_expand=user');
      this.news = newsItems.map(item => ({
        ...item,
        author: item.user
      }));
    },
    canEdit(item) {
      return this.user && this.user.id === item.author_id;
    },
    async deleteNews(id) {
      if (confirm('Are you sure you want to delete this news item?')) {
        await apiFetch(`/news/${id}`, { method: 'DELETE' });
        this.loadNews();
      }
    }
  }
};
</script>

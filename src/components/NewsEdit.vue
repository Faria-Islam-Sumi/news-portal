
<template>
  <div>
    <h1>Edit News</h1>
    <form @submit.prevent="updateNews">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" class="form-control" id="title" v-model="title" required />
      </div>
      <div class="mb-3">
        <label for="body" class="form-label">Body</label>
        <textarea class="form-control" id="body" v-model="body" rows="5" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Update</button>
    </form>
  </div>
</template>

<script>
import { apiFetch, getCurrentUser } from '../app.js';

export default {
  data() {
    return {
      title: '',
      body: '',
      user: null
    };
  },
  async created() {
    this.user = getCurrentUser();
    const newsId = this.$route.params.id;
    const newsItem = await apiFetch(`/news/${newsId}`);
    if (newsItem.author_id !== this.user.id) {
      this.$router.push('/');
      return;
    }
    this.title = newsItem.title;
    this.body = newsItem.body;
  },
  methods: {
    async updateNews() {
       if (this.body.length < 20) {
        alert('News body must be at least 20 characters.');
        return;
      }
      const newsId = this.$route.params.id;
      await apiFetch(`/news/${newsId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: this.title,
          body: this.body
        })
      });
      this.$router.push('/');
    }
  }
};
</script>

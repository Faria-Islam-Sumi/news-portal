
<template>
  <div>
    <div v-if="newsItem">
      <h1>{{ newsItem.title }}</h1>
      <p class="text-muted">By {{ newsItem.author.name }} on {{ new Date(newsItem.createdAt).toLocaleDateString() }}</p>
      <hr />
      <p>{{ newsItem.body }}</p>
      <hr />
      <h3>Comments</h3>
      <div v-for="comment in newsItem.comments" :key="comment.id" class="card mb-2">
        <div class="card-body">
          <p class="card-text">{{ comment.text }}</p>
          <p class="card-subtitle text-muted">By {{ comment.user.name }} on {{ new Date(comment.timestamp).toLocaleDateString() }}</p>
        </div>
      </div>
      <div class="card mt-4">
        <div class="card-body">
          <h5 class="card-title">Add a Comment</h5>
          <form @submit.prevent="addComment">
            <div class="mb-3">
              <textarea class="form-control" v-model="newComment" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
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
      newComment: '',
      user: null
    };
  },
  async created() {
    this.user = getCurrentUser();
    this.loadNewsDetail();
  },
  methods: {
    async loadNewsDetail() {
      const newsId = this.$route.params.id;
      const item = await apiFetch(`/news/${newsId}?_expand=user`);
      const commentsWithUsers = await Promise.all(
        item.comments.map(async (comment) => {
          const user = await apiFetch(`/users/${comment.user_id}`);
          return { ...comment, user };
        })
      );
      this.newsItem = { ...item, author: item.user, comments: commentsWithUsers };
    },
    async addComment() {
      const newsId = this.$route.params.id;
      const newComment = {
        id: Date.now(),
        text: this.newComment,
        user_id: this.user.id,
        timestamp: new Date().toISOString()
      };
      const updatedComments = [...this.newsItem.comments, newComment];
      await apiFetch(`/news/${newsId}`, {
        method: 'PATCH',
        body: JSON.stringify({ comments: updatedComments })
      });
      this.newComment = '';
      this.loadNewsDetail();
    }
  }
};
</script>

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/add-task',
      component: () => import('../views/AddTaskView.vue'),
    },
    {
      path: '/tasks',
      component: () => import('../views/TaskCollectionView.vue'),
    },
  ],
});

export default router;

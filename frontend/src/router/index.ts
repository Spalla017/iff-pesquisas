import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

// Importar paginas
const HomePage = () => import('@/pages/HomePage.vue');
const LoginPage = () => import('@/pages/LoginPage.vue');
const FeedPage = () => import('@/pages/FeedPage.vue');
const PesquisaDetailPage = () => import('@/pages/PesquisaDetailPage.vue');
const CreatePostPage = () => import('@/pages/CreatePostPage.vue');
const MyPostsPage = () => import('@/pages/MyPostsPage.vue');
const NotFoundPage = () => import('@/pages/NotFoundPage.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/feed',
    name: 'Feed',
    component: FeedPage,
  },
  {
    path: '/pesquisa/:id',
    name: 'PesquisaDetail',
    component: PesquisaDetailPage,
  },
  {
    path: '/criar-post',
    name: 'CreatePost',
    component: CreatePostPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/meus-posts',
    name: 'MyPosts',
    component: MyPostsPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guard de autenticacao
router.beforeEach((to) => {
  const authStore = useAuthStore();
  const requerAuth = to.meta.requiresAuth;
  const requerGuest = to.meta.requiresGuest;

  if (requerAuth && !authStore.isAutenticado) {
    return '/login';
  }

  if (requerGuest && authStore.isAutenticado) {
    return '/feed';
  }

  return true;
});

export default router;

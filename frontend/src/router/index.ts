import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';

// Importar paginas
const HomePage = () => import('@/pages/HomePage.vue');
const LoginPage = () => import('@/pages/LoginPage.vue');
const FeedPage = () => import('@/pages/FeedPage.vue');
const PesquisaDetailPage = () => import('@/pages/PesquisaDetailPage.vue');
const CreatePostPage = () => import('@/pages/CreatePostPage.vue');
const MyPostsPage = () => import('@/pages/MyPostsPage.vue');
const RecoverPasswordPage = () => import('@/pages/RecoverPasswordPage.vue');
const NotFoundPage = () => import('@/pages/NotFoundPage.vue');
const ColaboracoesPage = () => import('@/pages/ColaboracoesPage.vue');
const ColaboracaoDetailPage = () => import('@/pages/ColaboracaoDetailPage.vue');
const CriarSolicitacaoPage = () => import('@/pages/CriarSolicitacaoPage.vue');

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
    path: '/recuperar-senha',
    name: 'RecoverPassword',
    component: RecoverPasswordPage,
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
    path: '/editar-post/:id',
    name: 'EditPost',
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
    path: '/colaboracoes',
    name: 'Colaboracoes',
    component: ColaboracoesPage,
  },
  {
    path: '/colaboracoes/:id',
    name: 'ColaboracaoDetail',
    component: ColaboracaoDetailPage,
  },
  {
    path: '/solicitar-colaboracao',
    name: 'CriarSolicitacao',
    component: CriarSolicitacaoPage,
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.fullPath !== from.fullPath) {
      return { top: 0 };
    }

    return false;
  },
});

// Guard de autenticacao
router.beforeEach((to) => {
  const authStore = useAuthStore();
  const toastStore = useToastStore();
  const requerAuth = to.meta.requiresAuth;
  const requerGuest = to.meta.requiresGuest;

  if (requerAuth && !authStore.isAutenticado) {
    toastStore.notificar('Faça login para acessar esta página.', 'warning');
    return {
      name: 'Login',
      query: { redirect: to.fullPath },
    };
  }

  if (requerGuest && authStore.isAutenticado) {
    return '/feed';
  }

  return true;
});

export default router;

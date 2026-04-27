import { useAuthStore } from '@/stores/auth.store';
import { computed } from 'vue';

export const useAuth = () => {
  const authStore = useAuthStore();

  const usuario = computed(() => authStore.usuario);
  const isAutenticado = computed(() => authStore.isAutenticado);
  const carregando = computed(() => authStore.carregando);
  const erro = computed(() => authStore.erro);

  const login = (email: string, senha: string) => {
    return authStore.login({ email, senha });
  };

  const logout = () => {
    authStore.logout();
  };

  return {
    usuario,
    isAutenticado,
    carregando,
    erro,
    login,
    logout,
  };
};

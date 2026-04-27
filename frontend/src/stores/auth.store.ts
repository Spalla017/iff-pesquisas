import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Usuario, LoginPayload } from '@/types';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>(null);
  const token = ref<string | null>(null);
  const carregando = ref(false);
  const erro = ref<string | null>(null);

  // Computed
  const isAutenticado = computed(() => !!token.value);

  // Carregar usuario salvo ao iniciar
  const carregarUsuarioSalvo = () => {
    const usuarioSalvo = localStorage.getItem('usuario');
    const tokenSalvo = localStorage.getItem('token');
    
    if (usuarioSalvo && tokenSalvo) {
      usuario.value = JSON.parse(usuarioSalvo);
      token.value = tokenSalvo;
    }
  };

  // Login
  const login = async (payload: LoginPayload) => {
    carregando.value = true;
    erro.value = null;

    try {
      const response = await api.post('/auth/login', payload);
      token.value = response.data.token;
      usuario.value = response.data.usuario;

      if (token.value) {
        localStorage.setItem('token', token.value);
      }
      if (usuario.value) {
        localStorage.setItem('usuario', JSON.stringify(usuario.value));
      }

      return true;
    } catch (err: any) {
      erro.value = err.response?.data?.message || 'Erro ao fazer login';
      return false;
    } finally {
      carregando.value = false;
    }
  };

  // Logout
  const logout = () => {
    usuario.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  return {
    usuario,
    token,
    carregando,
    erro,
    isAutenticado,
    login,
    logout,
    carregarUsuarioSalvo,
  };
});

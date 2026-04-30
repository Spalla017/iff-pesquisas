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
      if (usarLoginDev(payload)) {
        token.value = 'dev-token';
        usuario.value = criarUsuarioDev(payload.email);

        localStorage.setItem('token', token.value);
        localStorage.setItem('usuario', JSON.stringify(usuario.value));

        return true;
      }

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

  const usarLoginDev = (payload: LoginPayload) =>
    import.meta.env.DEV &&
    import.meta.env.VITE_USE_API_AUTH !== 'true' &&
    payload.email.trim().toLowerCase().endsWith('@iff.edu.br') &&
    payload.senha.trim().length >= 4;

  const criarUsuarioDev = (email: string): Usuario => ({
    id: 'dev-user',
    nome: extrairNomeDev(email),
    email,
    matricula: '0000000',
    perfil: 'aluno',
  });

  const extrairNomeDev = (email: string) => {
    const [usuarioEmail] = email.split('@');
    return usuarioEmail
      .split(/[._-]/)
      .filter(Boolean)
      .map(parte => parte.charAt(0).toUpperCase() + parte.slice(1))
      .join(' ') || 'Aluno IFF';
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

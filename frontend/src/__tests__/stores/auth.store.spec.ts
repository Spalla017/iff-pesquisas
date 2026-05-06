import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';

describe('auth.store', () => {
  let authStore: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    authStore = useAuthStore();
  });

  describe('login — validações de entrada', () => {
    it('rejeita e-mail fora de @iff.edu.br', async () => {
      const resultado = await authStore.login({
        email: 'usuario@gmail.com',
        senha: '1234',
      });

      expect(resultado).toBe(false);
      expect(authStore.erro).toBe('Use seu e-mail institucional (@iff.edu.br).');
    });

    it('rejeita senha com menos de 4 caracteres', async () => {
      const resultado = await authStore.login({
        email: 'aluno@iff.edu.br',
        senha: '123',
      });

      expect(resultado).toBe(false);
      expect(authStore.erro).toBe('A senha deve ter no mínimo 4 caracteres.');
    });

    it('aceita credenciais válidas em modo dev', async () => {
      const resultado = await authStore.login({
        email: 'joao.silva@iff.edu.br',
        senha: 'senha123',
      });

      expect(resultado).toBe(true);
      expect(authStore.erro).toBeNull();
      expect(authStore.token).toBe('dev-token');
      expect(authStore.usuario).not.toBeNull();
      expect(authStore.usuario?.email).toBe('joao.silva@iff.edu.br');
    });
  });

  describe('isAutenticado', () => {
    it('é false quando não há token', () => {
      expect(authStore.isAutenticado).toBe(false);
    });

    it('é true após login bem-sucedido', async () => {
      await authStore.login({ email: 'aluno@iff.edu.br', senha: '1234' });
      expect(authStore.isAutenticado).toBe(true);
    });
  });

  describe('logout', () => {
    it('limpa usuario, token e localStorage', async () => {
      await authStore.login({ email: 'aluno@iff.edu.br', senha: '1234' });
      expect(authStore.isAutenticado).toBe(true);

      authStore.logout();

      expect(authStore.usuario).toBeNull();
      expect(authStore.token).toBeNull();
      expect(authStore.isAutenticado).toBe(false);
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('usuario')).toBeNull();
    });
  });

  describe('carregarUsuarioSalvo', () => {
    it('restaura sessão do localStorage', () => {
      const usuario = { id: '1', nome: 'Teste', email: 'teste@iff.edu.br', matricula: '0000', perfil: 'aluno' };
      localStorage.setItem('token', 'saved-token');
      localStorage.setItem('usuario', JSON.stringify(usuario));

      authStore.carregarUsuarioSalvo();

      expect(authStore.token).toBe('saved-token');
      expect(authStore.usuario?.nome).toBe('Teste');
      expect(authStore.isAutenticado).toBe(true);
    });

    it('não restaura sessão quando localStorage está vazio', () => {
      authStore.carregarUsuarioSalvo();

      expect(authStore.token).toBeNull();
      expect(authStore.usuario).toBeNull();
    });
  });
});

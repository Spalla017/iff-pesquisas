import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MensagensPage from '@/pages/MensagensPage.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';

const criarRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/mensagens', component: MensagensPage },
      { path: '/colaboracoes/:id', component: { template: '<div />' } },
    ],
  });

describe('MensagensPage.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('mostra estado vazio quando nao ha conversas', async () => {
    const pinia = createPinia();
    const router = criarRouter();
    await router.push('/mensagens');
    await router.isReady();

    const wrapper = mount(MensagensPage, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.text()).toContain('Sem conversas ativas');
  });

  it('renderiza lista de conversas quando existem mensagens', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const chatStore = useChatStore();

    await authStore.login({
      email: 'vinicius@iff.edu.br',
      senha: 'senha123',
    });
    await chatStore.enviarMensagem('colab-1', 'Conversa visivel na central');

    const router = criarRouter();
    await router.push('/mensagens?colab=colab-1');
    await router.isReady();

    const wrapper = mount(MensagensPage, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.findAll('.mensagens-page__item').length).toBe(1);
    expect(wrapper.text()).toContain('Conversa visivel na central');
  });
});

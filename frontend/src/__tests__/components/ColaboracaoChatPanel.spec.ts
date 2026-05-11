import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ColaboracaoChatPanel from '@/components/common/ColaboracaoChatPanel.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';

describe('ColaboracaoChatPanel.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('exibe estado bloqueado para visitante', () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(ColaboracaoChatPanel, {
      props: {
        colaboracaoId: 'colab-1',
      },
      global: {
        plugins: [pinia],
        stubs: { RouterLink: true },
      },
    });

    expect(wrapper.text()).toContain('Faca login para acessar o chat.');
  });

  it('envia mensagem e renderiza no historico', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const chatStore = useChatStore();

    await authStore.login({
      email: 'vinicius@iff.edu.br',
      senha: 'senha123',
    });

    const wrapper = mount(ColaboracaoChatPanel, {
      props: {
        colaboracaoId: 'colab-1',
      },
      global: {
        plugins: [pinia],
        stubs: { RouterLink: true },
      },
    });

    await wrapper.find('textarea').setValue('Mensagem enviada no painel');
    await wrapper.find('form').trigger('submit');

    expect(chatStore.mensagens).toHaveLength(1);
    expect(wrapper.text()).toContain('Mensagem enviada no painel');
  });
});

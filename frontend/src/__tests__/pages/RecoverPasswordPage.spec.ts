import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RecoverPasswordPage from '@/pages/RecoverPasswordPage.vue';

const montarPagina = () =>
  mount(RecoverPasswordPage, {
    global: {
      plugins: [createPinia()],
      stubs: {
        RouterLink: true,
      },
    },
  });

describe('RecoverPasswordPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('exibe mensagem do recoverPasswordSchema para e-mail nao institucional', async () => {
    const wrapper = montarPagina();

    await wrapper.find('#recover-email').setValue('usuario@gmail.com');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.text()).toContain('Use seu e-mail institucional (@iff.edu.br).');
  });
});

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchFilters from '@/components/common/SearchFilters.vue';
import { AREAS_DISPONIVEIS } from '@/data/mockPesquisas';

const montarFilters = (props: Record<string, unknown> = {}) =>
  mount(SearchFilters, {
    props: {
      termoBusca: '',
      areaSelecionada: '',
      autorBusca: '',
      orientadorBusca: '',
      areas: AREAS_DISPONIVEIS,
      totalResultados: 12,
      temFiltrosAtivos: false,
      ...props,
    },
  });

describe('SearchFilters.vue', () => {
  it('renderiza campo de busca com id "search-input"', () => {
    const wrapper = montarFilters();
    const input = wrapper.find('#search-input');
    expect(input.exists()).toBe(true);
  });

  it('renderiza pills de áreas com opções corretas', () => {
    const wrapper = montarFilters();
    const pills = wrapper.findAll('.filter-pills .pill');
    // "Todas" + 8 áreas = 9
    expect(pills.length).toBe(AREAS_DISPONIVEIS.length + 1);
  });

  it('emite evento ao digitar no campo de busca', async () => {
    const wrapper = montarFilters();
    const input = wrapper.find('#search-input');
    await input.setValue('Arduino');
    expect(wrapper.emitted('update:termoBusca')).toBeTruthy();
    expect(wrapper.emitted('update:termoBusca')![0]).toEqual(['Arduino']);
  });

  it('botão "Limpar filtros" dispara evento limpar quando filtros ativos', async () => {
    const wrapper = montarFilters({ temFiltrosAtivos: true });
    // Precisa abrir os filtros avançados primeiro para ver o botão
    const toggle = wrapper.find('#toggle-advanced-filters');
    await toggle.trigger('click');
    const clearButton = wrapper.find('#btn-clear-filters');
    expect(clearButton.exists()).toBe(true);
    await clearButton.trigger('click');
    expect(wrapper.emitted('limpar')).toBeTruthy();
  });

  it('exibe contagem de resultados quando filtros ativos', () => {
    const wrapper = montarFilters({ totalResultados: 42, temFiltrosAtivos: true });
    expect(wrapper.text()).toContain('42');
  });
});

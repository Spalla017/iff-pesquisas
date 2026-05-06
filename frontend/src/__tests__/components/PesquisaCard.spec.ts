import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import PesquisaCard from '@/components/common/PesquisaCard.vue';
import type { Pesquisa } from '@/types';

const criarRouter = () =>
  createRouter({
    history: createWebHistory(),
    routes: [{ path: '/pesquisa/:id', name: 'PesquisaDetail', component: { template: '<div />' } }],
  });

const pesquisaBase: Pesquisa = {
  id: '42',
  titulo: 'Título de Teste da Pesquisa',
  resumo: 'Resumo completo para verificar renderização do card de pesquisa.',
  area: 'Tecnologia',
  autor: 'Maria Clara',
  orientador: 'Prof. Dr. André Ferreira',
  dataPublicacao: new Date('2026-03-15'),
  pdfUrl: 'https://example.com/test.pdf',
  imagemUrl: 'https://images.unsplash.com/photo-test',
  status: 'publica',
  palavrasChave: ['IoT', 'Vue.js', 'Arduino', 'extra'],
};

const montarCard = (pesquisa: Partial<Pesquisa> = {}) =>
  mount(PesquisaCard, {
    props: { pesquisa: { ...pesquisaBase, ...pesquisa } },
    global: { plugins: [criarRouter()] },
  });

describe('PesquisaCard.vue', () => {
  it('renderiza o título da pesquisa', () => {
    const wrapper = montarCard();
    expect(wrapper.text()).toContain('Título de Teste da Pesquisa');
  });

  it('renderiza nome do autor e orientador', () => {
    const wrapper = montarCard();
    expect(wrapper.text()).toContain('Maria Clara');
    expect(wrapper.text()).toContain('Prof. Dr. André Ferreira');
  });

  it('exibe badge de PDF quando pdfUrl está disponível', () => {
    const wrapper = montarCard({ pdfUrl: 'https://example.com/test.pdf' });
    expect(wrapper.find('.card-pdf-badge').exists()).toBe(true);
  });

  it('NÃO exibe badge de PDF quando pdfUrl é vazio', () => {
    const wrapper = montarCard({ pdfUrl: '' });
    expect(wrapper.find('.card-pdf-badge').exists()).toBe(false);
  });

  it('renderiza imagem de capa com loading="lazy"', () => {
    const wrapper = montarCard();
    const img = wrapper.find('.card-media img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('loading')).toBe('lazy');
  });

  it('link "Ver detalhes" aponta para /pesquisa/:id', () => {
    const wrapper = montarCard();
    const link = wrapper.find(`[id="link-pesquisa-42"]`);
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toContain('/pesquisa/42');
  });

  it('exibe no máximo 3 palavras-chave', () => {
    const wrapper = montarCard({ palavrasChave: ['A', 'B', 'C', 'D', 'E'] });
    const keywords = wrapper.findAll('.keyword');
    expect(keywords.length).toBe(3);
  });
});

import { createRouter, createWebHistory } from 'vue-router';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ColaboracaoCard from '@/components/common/ColaboracaoCard.vue';
import type { Colaboracao } from '@/types';

const criarRouter = () =>
  createRouter({
    history: createWebHistory(),
    routes: [{ path: '/colaboracoes/:id', name: 'ColaboracaoDetail', component: { template: '<div />' } }],
  });

const colaboracaoBase: Colaboracao = {
  id: 'colab-42',
  titulo: 'Projeto de colaboração entre cursos',
  descricao: 'Descrição de base para renderização do card e validação dos elementos visuais.',
  cursoOrigem: 'Sistemas de Informação',
  cursosDesejados: ['Administração', 'Mecânica'],
  autor: 'Aluno Teste',
  autorId: 'dev-aluno@iff.edu.br',
  autorEmail: 'aluno@iff.edu.br',
  orientador: 'Prof. Teste',
  area: 'Tecnologia',
  urgencia: 'alta',
  status: 'aberta',
  dataCriacao: new Date('2026-05-01'),
  dataAtualizacao: new Date('2026-05-01'),
  competenciasNecessarias: ['Gestão', 'UX', 'Análise de dados', 'Negociação'],
  interessados: [
    {
      id: 'int-1',
      usuarioId: 'user-1',
      usuarioNome: 'Joana',
      usuarioCurso: 'Administração',
      usuarioEmail: 'joana@iff.edu.br',
      dataInteresse: new Date('2026-05-02'),
    },
    {
      id: 'int-2',
      usuarioId: 'user-2',
      usuarioNome: 'Rafael',
      usuarioCurso: 'Mecânica',
      usuarioEmail: 'rafael@iff.edu.br',
      dataInteresse: new Date('2026-05-03'),
    },
  ],
  imagemUrl: 'https://images.unsplash.com/photo-test',
};

const montarCard = (overrides: Partial<Colaboracao> = {}) =>
  mount(ColaboracaoCard, {
    props: { colaboracao: { ...colaboracaoBase, ...overrides } },
    global: { plugins: [criarRouter()] },
  });

describe('ColaboracaoCard.vue', () => {
  it('renderiza título da colaboração', () => {
    const wrapper = montarCard();
    expect(wrapper.text()).toContain('Projeto de colaboração entre cursos');
  });

  it('renderiza badges de urgência e status', () => {
    const wrapper = montarCard({ urgencia: 'media', status: 'em_andamento' });
    expect(wrapper.find('.colab-card__urgencia').text().length).toBeGreaterThan(0);
    expect(wrapper.text()).toContain('Em andamento');
  });

  it('renderiza cursos desejados', () => {
    const wrapper = montarCard();
    const cursos = wrapper.findAll('.colab-card__curso-badge--destino');
    expect(cursos.length).toBe(2);
    expect(wrapper.text()).toContain('Administração');
    expect(wrapper.text()).toContain('Mecânica');
  });

  it('limita competências a 3 e mostra +N', () => {
    const wrapper = montarCard({
      competenciasNecessarias: ['A', 'B', 'C', 'D', 'E'],
    });
    const tags = wrapper.findAll('.colab-card__tag');
    expect(tags.length).toBe(4);
    expect(wrapper.text()).toContain('+2');
  });

  it('trunca descrição longa com reticências', () => {
    const wrapper = montarCard({
      descricao: 'A'.repeat(200),
    });
    const texto = wrapper.find('.colab-card__descricao').text();
    expect(texto.endsWith('...')).toBe(true);
    expect(texto.length).toBeLessThan(200);
  });

  it('torna o card inteiro clicável para /colaboracoes/:id', () => {
    const wrapper = montarCard();
    const link = wrapper.find('.colab-card-link');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toContain('/colaboracoes/colab-42');
  });

  it('exibe contagem de interessados', () => {
    const wrapper = montarCard();
    expect(wrapper.find('.colab-card__interessados').text()).toContain('2');
  });
});

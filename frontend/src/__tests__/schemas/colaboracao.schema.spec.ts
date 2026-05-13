import { describe, expect, it } from 'vitest';
import { createColaboracaoSchema, extrairErroZod } from '@/schemas';

describe('createColaboracaoSchema', () => {
  const payloadValido = {
    titulo: 'Projeto interdisciplinar de teste',
    descricao: 'Descrição completa com mais de vinte caracteres para validar corretamente.',
    cursosDesejados: ['Administração'],
    orientador: 'Prof. Teste',
    area: 'Tecnologia',
    urgencia: 'media' as const,
    competenciasNecessarias: ['Gestão de processos'],
  };

  it('aceita payload completo válido', () => {
    const result = createColaboracaoSchema.safeParse(payloadValido);
    expect(result.success).toBe(true);
  });

  it('rejeita título vazio', () => {
    const result = createColaboracaoSchema.safeParse({
      ...payloadValido,
      titulo: '',
    });
    expect(result.success).toBe(false);
    expect(extrairErroZod(result)).toBe('Informe o título da solicitação de colaboração.');
  });

  it('rejeita título maior que 150 caracteres', () => {
    const result = createColaboracaoSchema.safeParse({
      ...payloadValido,
      titulo: 'A'.repeat(151),
    });
    expect(result.success).toBe(false);
    expect(extrairErroZod(result)).toBe('O título da solicitação deve ter no máximo 150 caracteres.');
  });

  it('rejeita descrição curta', () => {
    const result = createColaboracaoSchema.safeParse({
      ...payloadValido,
      descricao: 'Muito curta',
    });
    expect(result.success).toBe(false);
    expect(extrairErroZod(result)).toBe('Descreva o projeto com pelo menos 20 caracteres.');
  });

  it('rejeita cursos desejados vazio', () => {
    const result = createColaboracaoSchema.safeParse({
      ...payloadValido,
      cursosDesejados: [],
    });
    expect(result.success).toBe(false);
    expect(extrairErroZod(result)).toBe('Selecione ao menos um curso para receber colaboração.');
  });

  it('rejeita urgência inválida', () => {
    const result = createColaboracaoSchema.safeParse({
      ...payloadValido,
      urgencia: 'urgentissima',
    });
    expect(result.success).toBe(false);
    expect(extrairErroZod(result)).toBe('Selecione a urgência da solicitação.');
  });

  it('aplica competências como array vazio por padrão', () => {
    const { competenciasNecessarias, ...semCompetencias } = payloadValido;
    const result = createColaboracaoSchema.safeParse(semCompetencias);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.competenciasNecessarias).toEqual([]);
    }
  });

  it('rejeita mais de 8 competências', () => {
    const result = createColaboracaoSchema.safeParse({
      ...payloadValido,
      competenciasNecessarias: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    });
    expect(result.success).toBe(false);
    expect(extrairErroZod(result)).toBe('Informe no máximo 8 competências necessárias.');
  });
});

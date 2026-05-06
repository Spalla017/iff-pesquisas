import { describe, it, expect } from 'vitest';
import { loginSchema, createPostSchema, recoverPasswordSchema, extrairErroZod } from '@/schemas';

describe('schemas - loginSchema', () => {
  it('rejeita email fora de @iff.edu.br', () => {
    const resultado = loginSchema.safeParse({ email: 'user@gmail.com', senha: '1234' });
    expect(resultado.success).toBe(false);
    expect(extrairErroZod(resultado)).toBe('Use seu e-mail institucional (@iff.edu.br).');
  });

  it('rejeita senha com menos de 4 caracteres', () => {
    const resultado = loginSchema.safeParse({ email: 'aluno@iff.edu.br', senha: '12' });
    expect(resultado.success).toBe(false);
    expect(extrairErroZod(resultado)).toBe('A senha deve ter no mínimo 4 caracteres.');
  });

  it('aceita credenciais validas', () => {
    const resultado = loginSchema.safeParse({ email: 'aluno@iff.edu.br', senha: 'senha123' });
    expect(resultado.success).toBe(true);
  });
});

describe('schemas - createPostSchema', () => {
  it('rejeita titulo vazio', () => {
    const resultado = createPostSchema.safeParse({
      titulo: '',
      resumo: 'Resumo',
      area: 'Tecnologia',
      orientador: 'Prof. Teste',
    });
    expect(resultado.success).toBe(false);
    expect(extrairErroZod(resultado)).toBe('O título é obrigatório.');
  });

  it('rejeita titulo com mais de 200 caracteres', () => {
    const resultado = createPostSchema.safeParse({
      titulo: 'A'.repeat(201),
      resumo: 'Resumo',
      area: 'Tecnologia',
      orientador: 'Prof. Teste',
    });
    expect(resultado.success).toBe(false);
    expect(extrairErroZod(resultado)).toBe('O título deve ter no máximo 200 caracteres.');
  });

  it('rejeita resumo com mais de 500 caracteres', () => {
    const resultado = createPostSchema.safeParse({
      titulo: 'Pesquisa',
      resumo: 'A'.repeat(501),
      area: 'Tecnologia',
      orientador: 'Prof. Teste',
      palavrasChave: [],
    });
    expect(resultado.success).toBe(false);
    expect(extrairErroZod(resultado)).toBe('O resumo deve ter no máximo 500 caracteres.');
  });

  it('aceita formulario completo valido', () => {
    const resultado = createPostSchema.safeParse({
      titulo: 'Pesquisa sobre IoT',
      resumo: 'Resumo da pesquisa sobre IoT',
      area: 'Tecnologia',
      orientador: 'Prof. Dr. Andre',
      palavrasChave: ['IoT', 'Arduino'],
    });
    expect(resultado.success).toBe(true);
  });

  it('rejeita mais de 5 palavras-chave', () => {
    const resultado = createPostSchema.safeParse({
      titulo: 'Pesquisa',
      resumo: 'Resumo',
      area: 'Tecnologia',
      orientador: 'Prof. Teste',
      palavrasChave: ['a', 'b', 'c', 'd', 'e', 'f'],
    });
    expect(resultado.success).toBe(false);
    expect(extrairErroZod(resultado)).toBe('Máximo de 5 palavras-chave permitidas.');
  });
});

describe('schemas - recoverPasswordSchema', () => {
  it('rejeita email fora de @iff.edu.br', () => {
    const resultado = recoverPasswordSchema.safeParse({ email: 'user@gmail.com' });
    expect(resultado.success).toBe(false);
    expect(extrairErroZod(resultado)).toBe('Use seu e-mail institucional (@iff.edu.br).');
  });

  it('aceita email @iff.edu.br', () => {
    const resultado = recoverPasswordSchema.safeParse({ email: 'aluno@iff.edu.br' });
    expect(resultado.success).toBe(true);
  });
});

import { z } from 'zod';

/**
 * Schema de validação para login institucional.
 * Exige e-mail @iff.edu.br e senha com mínimo de 4 caracteres.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório.')
    .email('Formato de e-mail inválido.')
    .refine((email) => email.toLowerCase().endsWith('@iff.edu.br'), {
      message: 'Use seu e-mail institucional (@iff.edu.br).',
    }),
  senha: z
    .string()
    .min(4, 'A senha deve ter no mínimo 4 caracteres.'),
});

/**
 * Schema de validação para criação/edição de posts.
 * Campos obrigatórios: título, resumo, área e orientador.
 * Palavras-chave: array com máximo de 5 itens.
 */
export const createPostSchema = z.object({
  titulo: z
    .string()
    .min(1, 'O título é obrigatório.')
    .max(200, 'O título deve ter no máximo 200 caracteres.'),
  resumo: z
    .string()
    .min(1, 'O resumo é obrigatório.')
    .max(500, 'O resumo deve ter no máximo 500 caracteres.'),
  area: z
    .string()
    .min(1, 'Selecione uma área de conhecimento.'),
  orientador: z
    .string()
    .min(1, 'O nome do orientador é obrigatório.'),
  palavrasChave: z
    .array(z.string())
    .max(5, 'Máximo de 5 palavras-chave permitidas.')
    .default([]),
});

/**
 * Schema de validação para recuperação de senha.
 * Exige e-mail institucional @iff.edu.br.
 */
export const recoverPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório.')
    .email('Formato de e-mail inválido.')
    .refine((email) => email.toLowerCase().endsWith('@iff.edu.br'), {
      message: 'Use seu e-mail institucional (@iff.edu.br).',
    }),
});

/**
 * Extrai a primeira mensagem de erro de um resultado Zod.
 * Útil para exibir feedback no formulário.
 */
export const extrairErroZod = (result: { success: boolean; error?: { issues: { message: string }[] } }): string | null => {
  if (result.success) return null;
  return result.error!.issues[0]?.message ?? 'Dados inválidos.';
};

export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type RecoverPasswordInput = z.infer<typeof recoverPasswordSchema>;

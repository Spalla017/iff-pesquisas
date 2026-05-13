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
 * Schema de validação para criação/edição de publicações acadêmicas.
 * Campos obrigatórios: título, resumo, área e orientador.
 * Palavras-chave: array com máximo de 5 itens.
 */
export const createPostSchema = z.object({
  titulo: z
    .string()
    .min(1, 'Informe o título da pesquisa.')
    .max(200, 'O título da pesquisa deve ter no máximo 200 caracteres.'),
  resumo: z
    .string()
    .min(1, 'Informe o resumo da pesquisa.')
    .max(500, 'O resumo deve ter no máximo 500 caracteres.'),
  area: z
    .string()
    .min(1, 'Selecione uma área de conhecimento.'),
  orientador: z
    .string()
    .min(1, 'Informe o nome do professor orientador.'),
  palavrasChave: z
    .array(z.string())
    .max(5, 'Informe no máximo 5 palavras-chave.')
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

/**
 * Schema de validação para solicitação de colaboração entre cursos.
 * Campos obrigatórios: título, descrição, cursos desejados, orientador, área e urgência.
 * Competências necessárias: array com máximo de 8 itens.
 */
export const createColaboracaoSchema = z.object({
  titulo: z
    .string()
    .min(1, 'Informe o título da solicitação de colaboração.')
    .max(150, 'O título da solicitação deve ter no máximo 150 caracteres.'),
  descricao: z
    .string()
    .min(20, 'Descreva o projeto com pelo menos 20 caracteres.')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres.'),
  cursosDesejados: z
    .array(z.string())
    .min(1, 'Selecione ao menos um curso para receber colaboração.'),
  orientador: z
    .string()
    .min(1, 'Informe o nome do professor orientador.'),
  area: z
    .string()
    .min(1, 'Selecione a área de conhecimento da solicitação.'),
  urgencia: z
    .enum(['baixa', 'media', 'alta'], {
      message: 'Selecione a urgência da solicitação.',
    }),
  competenciasNecessarias: z
    .array(z.string())
    .max(8, 'Informe no máximo 8 competências necessárias.')
    .default([]),
});

export type CreateColaboracaoInput = z.infer<typeof createColaboracaoSchema>;

/**
 * Schema de validação para mensagens do chat de colaboração.
 * Conteúdo obrigatório com limite de 2000 caracteres.
 */
export const chatMessageSchema = z.object({
  conteudo: z
    .string()
    .min(1, 'A mensagem não pode estar vazia.')
    .max(2000, 'A mensagem deve ter no máximo 2000 caracteres.'),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;


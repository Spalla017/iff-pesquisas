import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ToastTipo = 'info' | 'success' | 'warning' | 'danger';

export interface Toast {
  id: number;
  mensagem: string;
  tipo: ToastTipo;
  timeoutId?: ReturnType<typeof setTimeout>;
}

let proximoToastId = 0;

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);

  /**
   * Remove um toast da lista pelo ID, cancelando seu timer se existir.
   *
   * @param id - ID do toast a ser removido
   */
  const remover = (id: number) => {
    const toast = toasts.value.find(item => item.id === id);
    if (toast?.timeoutId) {
      clearTimeout(toast.timeoutId);
    }
    toasts.value = toasts.value.filter(item => item.id !== id);
  };

  /**
   * Exibe uma notificação toast na interface.
   * O toast é removido automaticamente após a duração especificada.
   *
   * @param mensagem - Texto a ser exibido
   * @param tipo - Tipo visual: 'info' | 'success' | 'warning' | 'danger'
   * @param duracao - Tempo em ms antes da remoção automática (0 = persistente)
   */
  const notificar = (mensagem: string, tipo: ToastTipo = 'info', duracao = 3500) => {
    const toast: Toast = {
      id: ++proximoToastId,
      mensagem,
      tipo,
    };

    toasts.value.push(toast);

    if (duracao > 0) {
      toast.timeoutId = setTimeout(() => remover(toast.id), duracao);
    }
  };

  return {
    toasts,
    notificar,
    remover,
  };
});

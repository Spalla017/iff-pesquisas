import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useToastStore } from '@/stores/toast.store';

describe('toast.store', () => {
  let toastStore: ReturnType<typeof useToastStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    toastStore = useToastStore();
    vi.useFakeTimers();
  });

  it('notificar() adiciona toast à lista', () => {
    toastStore.notificar('Mensagem de teste', 'info');
    expect(toastStore.toasts).toHaveLength(1);
    expect(toastStore.toasts[0].mensagem).toBe('Mensagem de teste');
    expect(toastStore.toasts[0].tipo).toBe('info');
  });

  it('toast é removido automaticamente após duração', () => {
    toastStore.notificar('Vai sumir', 'success', 1000);
    expect(toastStore.toasts).toHaveLength(1);

    vi.advanceTimersByTime(1000);
    expect(toastStore.toasts).toHaveLength(0);
  });

  it('remover() remove toast específico', () => {
    toastStore.notificar('Toast 1', 'info', 0);
    toastStore.notificar('Toast 2', 'success', 0);

    const idParaRemover = toastStore.toasts[0].id;
    toastStore.remover(idParaRemover);

    expect(toastStore.toasts).toHaveLength(1);
    expect(toastStore.toasts[0].mensagem).toBe('Toast 2');
  });

  it('múltiplos toasts coexistem', () => {
    toastStore.notificar('Info', 'info', 0);
    toastStore.notificar('Sucesso', 'success', 0);
    toastStore.notificar('Aviso', 'warning', 0);
    toastStore.notificar('Erro', 'danger', 0);

    expect(toastStore.toasts).toHaveLength(4);
  });

  it('toast com duração 0 persiste indefinidamente', () => {
    toastStore.notificar('Persistente', 'info', 0);

    vi.advanceTimersByTime(60000);
    expect(toastStore.toasts).toHaveLength(1);
  });
});

/**
 * Setup global para testes Vitest.
 * Configura mocks de localStorage e APIs do browser que não existem no happy-dom.
 */

import { vi } from 'vitest';

// Mock do localStorage para testes que dependem de persistência
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Limpar localStorage entre testes
beforeEach(() => {
  localStorage.clear();
});

// Mock do import.meta.env para simular ambiente de desenvolvimento
vi.stubGlobal('import', { meta: { env: { DEV: true, VITE_USE_API_AUTH: 'false' } } });

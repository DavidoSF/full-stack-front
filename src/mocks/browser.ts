import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

if (typeof window !== 'undefined') {
  Object.keys(sessionStorage)
    .filter((key) => key.startsWith('msw_reviews_'))
    .forEach((key) => sessionStorage.removeItem(key));
}

export const worker = setupWorker(...handlers);

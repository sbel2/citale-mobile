import { hotjar } from '@hotjar/browser';

export const initHotjar = () => {
  if (typeof window !== 'undefined') {
    hotjar.initialize(5052807, 6);
  }
};
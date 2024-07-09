import { hotjar } from '@hotjar/browser';

let hotJarVersion = 6;
let siteId = 5052807;

export const initHotjar = () => {
  if (typeof window !== 'undefined') {
    hotjar.initialize(siteId, hotJarVersion);
  }
};
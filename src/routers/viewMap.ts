export const viewMap: Record<string, () => Promise<any>> = {
  'business/test': () => import('@/pages/business/test.vue'),
  'business/test1': () => import('@/pages/business/test1.vue'),
};

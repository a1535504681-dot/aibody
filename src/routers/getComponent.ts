import { viewMap } from '@/routers/viewMap';

export function getComponent(path: string) {
  const key = path.replace(/^\//, '');

  const loader = viewMap[key];

  if (!loader) {
    console.warn(`未找到组件映射: ${key}`);
    return undefined;
  }

  return loader;
}

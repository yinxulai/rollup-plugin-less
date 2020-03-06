export default function insertStyle(id: string, css: string) {
  if (!css) return;

  // 环境检查
  if (typeof (window) == 'undefined') return;
  if (typeof (document) == 'undefined') return;
  if (typeof (document.head) == 'undefined') return;
  // 计算内容哈希
  if (document.getElementById(id)) return;

  // 创建 style
  const style = document.createElement('style');
  style.innerHTML = css;
  style.id = id;

  // 插入 dom
  document.head.appendChild(style);
  return css;
}

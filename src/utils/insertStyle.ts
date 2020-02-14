import hash from './hash'

export default function insertStyle(css: string) {
  if (!css) return;

  // 环境检查
  if (typeof (window) == 'undefined') return;
  if (typeof (document) == 'undefined') return;
  if (typeof (document.head) == 'undefined') return;

  // 计算内容哈希
  const documentID = hash(css)
  if (document.getElementById(documentID)) return;

  // 创建 style
  const style = document.createElement('style');
  style.id = documentID;
  style.innerHTML = css;

  // 插入 dom
  document.head.appendChild(style);
  return css;
}

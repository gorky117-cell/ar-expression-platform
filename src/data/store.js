// In-memory store for expressions and social data (persist later with backend)
let expressions = [
  {
    id: '1',
    name: 'Tree & Birds',
    mood: 'calm',
    triggerImage: '/markers/hiro.png',
    overlayImage: '/overlays/tree-birds.svg',
    createdAt: Date.now() - 86400000,
    likes: 3,
    greetings: 2,
    comments: [
      { id: 'c1', text: 'Love the birds!', author: 'Viewer', at: Date.now() - 3600000 },
    ],
  },
];

export function getExpressions() {
  return [...expressions];
}

export function getExpression(id) {
  return expressions.find((e) => e.id === id) || null;
}

export function addExpression(expr) {
  const newExpr = {
    id: String(Date.now()),
    likes: 0,
    greetings: 0,
    comments: [],
    createdAt: Date.now(),
    ...expr,
  };
  expressions.push(newExpr);
  return newExpr;
}

export function likeExpression(id) {
  const e = expressions.find((x) => x.id === id);
  if (e) e.likes = (e.likes || 0) + 1;
}

export function sendGreeting(id) {
  const e = expressions.find((x) => x.id === id);
  if (e) e.greetings = (e.greetings || 0) + 1;
}

export function addComment(id, text, author) {
  const e = expressions.find((x) => x.id === id);
  if (!e) return;
  e.comments = e.comments || [];
  e.comments.push({
    id: 'c' + Date.now(),
    text,
    author: author || 'Viewer',
    at: Date.now(),
  });
}

export const MOODS = ['calm', 'happy', 'playful', 'inspired', 'peaceful'];

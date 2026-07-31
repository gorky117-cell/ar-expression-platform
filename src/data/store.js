// In-memory store for expressions and social data (persist later with backend)
let expressions = [
  {
    id: '1',
    name: 'Test Tree',
    mood: 'calm',
    triggerImage: '/overlays/tree-birds-target.png',
    overlayImage: '/overlays/tree-birds-target.png',
    arViewerUrl: '/ar-tree.html',
    createdAt: Date.now() - 86400000,
    likes: 3,
    greetings: 2,
    comments: [
      { id: 'c1', text: 'Love the birds!', author: 'Viewer', at: Date.now() - 3600000 },
    ],
  },
  {
    id: 'cosmic-butterfly',
    name: 'Cosmic Butterfly',
    mood: 'inspired',
    triggerImage: '/overlays/cosmic-butterfly.svg',
    overlayImage: '/overlays/cosmic-butterfly.svg',
    arViewerUrl: '/ar-mind.html',
    createdAt: Date.now() - 43200000,
    likes: 5,
    greetings: 3,
    comments: [
      { id: 'c2', text: 'Pure markerless tracking is amazing!', author: 'WebAR Fans', at: Date.now() - 1800000 },
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

export function updateExpression(id, patch) {
  const e = expressions.find((x) => x.id === id);
  if (!e) return null;
  if (patch.mood != null) e.mood = patch.mood;
  if (patch.caption != null) e.caption = patch.caption;
  return e;
}

export const MOODS = ['calm', 'happy', 'playful', 'inspired', 'peaceful'];

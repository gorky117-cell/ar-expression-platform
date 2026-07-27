/**
 * Single API for expressions + reactions. Uses Supabase when .env is set (D: project).
 * Otherwise falls back to in-memory store so app runs without backend.
 */
import { supabase } from './supabase'
import * as store from './store'

function rowToExpression(row, reactions = []) {
  const comments = reactions.filter((r) => r.kind === 'comment').map((r) => ({
    id: r.id,
    text: r.text || '',
    author: r.author || 'Viewer',
    at: new Date(r.created_at).getTime(),
  }))
  const likes = reactions.filter((r) => r.kind === 'like').length
  const greetings = reactions.filter((r) => r.kind === 'greeting').length
  const love = reactions.filter((r) => r.kind === 'love').length
  const good = reactions.filter((r) => r.kind === 'good').length
  const keep = reactions.filter((r) => r.kind === 'keep').length
  return {
    id: String(row.id),
    name: row.name || (row.id === '2' ? 'Cosmic Butterfly' : 'My Expression'),
    mood: row.mood || (row.id === '2' ? 'inspired' : 'calm'),
    triggerImage: row.trigger_image || (row.id === '2' ? '/overlays/cosmic-butterfly.svg' : '/markers/hiro.png'),
    overlayImage: row.overlay_image || (row.id === '2' ? '/overlays/cosmic-butterfly.svg' : '/overlays/tree-birds.svg'),
    arViewerUrl: row.id === '2' ? '/ar-mind.html' : (row.ar_viewer_url || null),
    caption: row.caption,
    isLive: row.is_live !== false,
    createdAt: new Date(row.created_at || Date.now()).getTime(),
    likes,
    greetings,
    love,
    good,
    keep,
    comments,
  }
}

export async function getExpressions() {
  const defaultList = store.getExpressions()
  if (!supabase) return Promise.resolve(defaultList)
  const { data: rows, error } = await supabase.from('expressions').select('*').order('created_at', { ascending: false })
  if (error || !rows) return Promise.resolve(defaultList)
  const ids = rows.map((r) => r.id)
  const { data: reactions } = ids.length
    ? await supabase.from('reactions').select('*').in('expression_id', ids)
    : { data: [] }
  const byExpr = (reactions || []).reduce((acc, r) => {
    if (!acc[r.expression_id]) acc[r.expression_id] = []
    acc[r.expression_id].push(r)
    return acc
  }, {})
  
  const fetched = rows.map((row) => rowToExpression(row, byExpr[row.id] || []))
  // Ensure default expressions 1 and 2 exist in the returned list
  for (const defItem of defaultList) {
    if (!fetched.some((f) => String(f.id) === String(defItem.id))) {
      fetched.push(defItem)
    }
  }
  return fetched
}

export async function getExpression(id) {
  const storeItem = store.getExpression(id)
  if (!supabase) return Promise.resolve(storeItem)
  const { data: row, error } = await supabase.from('expressions').select('*').eq('id', id).single()
  if (error || !row) {
    return Promise.resolve(storeItem)
  }
  const { data: reactions } = await supabase.from('reactions').select('*').eq('expression_id', id)
  const expr = rowToExpression(row, reactions || [])
  if (String(id) === '2') {
    expr.name = 'Cosmic Butterfly'
    expr.mood = 'inspired'
    expr.triggerImage = '/overlays/cosmic-butterfly.svg'
    expr.overlayImage = '/overlays/cosmic-butterfly.svg'
    expr.arViewerUrl = '/ar-mind.html'
  }
  return expr
}

export async function addExpression(expr) {
  if (!supabase) return Promise.resolve(store.addExpression(expr))
  const { data: row, error } = await supabase
    .from('expressions')
    .insert({
      name: expr.name || 'My Expression',
      mood: expr.mood || 'calm',
      trigger_image: expr.triggerImage || expr.trigger_image || '/markers/hiro.png',
      overlay_image: expr.overlayImage || expr.overlay_image || '/overlays/tree-birds.svg',
      caption: expr.caption || null,
    })
    .select()
    .single()
  if (error) return Promise.resolve(store.addExpression(expr))
  return rowToExpression(row, [])
}

export async function likeExpression(id) {
  if (!supabase) return store.likeExpression(id)
  await supabase.from('reactions').insert({ expression_id: id, kind: 'like' })
}

export async function sendGreeting(id) {
  if (!supabase) return store.sendGreeting(id)
  await supabase.from('reactions').insert({ expression_id: id, kind: 'greeting' })
}

export async function addReaction(id, kind, opts = {}) {
  if (!supabase) return
  await supabase.from('reactions').insert({
    expression_id: id,
    kind,
    author: opts.author || 'Viewer',
    text: opts.text || null,
  })
}

export async function addComment(id, text, author) {
  if (!supabase) return store.addComment(id, text, author)
  await supabase.from('reactions').insert({
    expression_id: id,
    kind: 'comment',
    text: text || '',
    author: author || 'Viewer',
  })
}

export async function updateExpression(id, patch) {
  if (!supabase) return Promise.resolve(store.updateExpression(id, patch))
  const upd = {}
  if (patch.mood != null) upd.mood = patch.mood
  if (patch.caption != null) upd.caption = patch.caption
  const { error } = await supabase.from('expressions').update(upd).eq('id', id)
  if (error) return Promise.resolve(null)
  return getExpression(id)
}

export const MOODS = store.MOODS

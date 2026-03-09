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
    id: row.id,
    name: row.name || 'My Expression',
    mood: row.mood || 'calm',
    triggerImage: row.trigger_image || '/markers/hiro.png',
    overlayImage: row.overlay_image || '/overlays/tree-birds.svg',
    caption: row.caption,
    isLive: row.is_live !== false,
    createdAt: new Date(row.created_at).getTime(),
    likes,
    greetings,
    love,
    good,
    keep,
    comments,
  }
}

export async function getExpressions() {
  if (!supabase) return Promise.resolve(store.getExpressions())
  const { data: rows, error } = await supabase.from('expressions').select('*').order('created_at', { ascending: false })
  if (error) return Promise.resolve(store.getExpressions())
  const ids = (rows || []).map((r) => r.id)
  const { data: reactions } = ids.length
    ? await supabase.from('reactions').select('*').in('expression_id', ids)
    : { data: [] }
  const byExpr = (reactions || []).reduce((acc, r) => {
    if (!acc[r.expression_id]) acc[r.expression_id] = []
    acc[r.expression_id].push(r)
    return acc
  }, {})
  return (rows || []).map((row) => rowToExpression(row, byExpr[row.id] || []))
}

export async function getExpression(id) {
  if (!supabase) return Promise.resolve(store.getExpression(id))
  const { data: row, error } = await supabase.from('expressions').select('*').eq('id', id).single()
  if (error || !row) return Promise.resolve(null)
  const { data: reactions } = await supabase.from('reactions').select('*').eq('expression_id', id)
  return rowToExpression(row, reactions || [])
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

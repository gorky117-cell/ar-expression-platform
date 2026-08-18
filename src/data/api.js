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
    name: row.name || 'My Expression',
    mood: row.mood || 'calm',
    triggerImage: row.trigger_image || '/markers/hiro.png',
    overlayImage: (row.overlay_image === '/overlays/tree-birds.svg' || !row.overlay_image) ? '/overlays/tree-birds-target.png' : row.overlay_image,
    arViewerUrl: row.ar_viewer_url || null,
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
  const { data: rows, error } = await supabase
    .from('expressions')
    .select('*')
    .neq('is_live', false)
    .order('created_at', { ascending: false })
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
  return fetched
}

export async function getExpression(id) {
  if (supabase) {
    const { data: row } = await supabase.from('expressions').select('*').eq('id', id).single()
    if (row) {
      const { data: reactions } = await supabase.from('reactions').select('*').eq('expression_id', id)
      return rowToExpression(row, reactions || [])
    }
  }

  const isTree = (id === '1' || String(id) === '1' || id === 'tree')
  const defaultObj = isTree ? {
    id: '1',
    name: 'Test Tree',
    mood: 'calm',
    triggerImage: '/overlays/tree-birds-target.png',
    overlayImage: '/overlays/tree-birds-target.png',
    arViewerUrl: '/ar-camera.html',
    createdAt: Date.now() - 86400000,
    likes: 3,
    greetings: 2,
    comments: [{ id: 'c1', text: 'Love the birds!', author: 'Viewer', at: Date.now() - 3600000 }],
  } : {
    id: 'cosmic-butterfly',
    name: 'Cosmic Butterfly',
    mood: 'inspired',
    triggerImage: '/overlays/cosmic-butterfly.svg',
    overlayImage: '/overlays/cosmic-butterfly.svg',
    arViewerUrl: '/ar-mind.html',
    createdAt: Date.now() - 43200000,
    likes: 5,
    greetings: 3,
    comments: [{ id: 'c2', text: 'Pure markerless tracking is amazing!', author: 'WebAR Fans', at: Date.now() - 1800000 }],
  }

  const storeItem = store.getExpression(id) || defaultObj

  if (!supabase) return Promise.resolve(storeItem)

  const { data: reactions } = await supabase
    .from('reactions')
    .select('*')
    .eq('expression_id', id)

  const rxList = reactions || []
  const dbLikes = rxList.filter((r) => r.kind === 'like').length
  const dbGreetings = rxList.filter((r) => r.kind === 'greeting').length
  const dbComments = rxList
    .filter((r) => r.kind === 'comment')
    .map((r) => ({
      id: r.id,
      text: r.text || '',
      author: r.author || 'Viewer',
      at: new Date(r.created_at || Date.now()).getTime(),
    }))

  return {
    ...storeItem,
    likes: storeItem.likes + dbLikes,
    greetings: storeItem.greetings + dbGreetings,
    comments: [...storeItem.comments, ...dbComments],
  }
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
  const isCosmic = (id === 'cosmic-butterfly' || id === '2' || String(id) === '2')
  const targetId = isCosmic ? 2 : id
  if (!supabase) return store.likeExpression(targetId)
  await supabase.from('reactions').insert({ expression_id: targetId, kind: 'like' })
}

export async function sendGreeting(id) {
  const isCosmic = (id === 'cosmic-butterfly' || id === '2' || String(id) === '2')
  const targetId = isCosmic ? 2 : id
  if (!supabase) return store.sendGreeting(targetId)
  await supabase.from('reactions').insert({ expression_id: targetId, kind: 'greeting' })
}

export async function addReaction(id, kind, opts = {}) {
  const isCosmic = (id === 'cosmic-butterfly' || id === '2' || String(id) === '2')
  const targetId = isCosmic ? 2 : id
  if (!supabase) return
  await supabase.from('reactions').insert({
    expression_id: targetId,
    kind,
    author: opts.author || 'Viewer',
    text: opts.text || null,
  })
}

export async function addComment(id, text, author) {
  const isCosmic = (id === 'cosmic-butterfly' || id === '2' || String(id) === '2')
  const targetId = isCosmic ? 2 : id
  if (!supabase) return store.addComment(targetId, text, author)
  await supabase.from('reactions').insert({
    expression_id: targetId,
    kind: 'comment',
    text: text || '',
    author: author || 'Viewer',
  })
}

export async function updateExpression(id, patch) {
  if (!supabase) return Promise.resolve(store.updateExpression(id, patch))
  const upd = {}
  if (patch.name != null) upd.name = patch.name
  if (patch.mood != null) upd.mood = patch.mood
  if (patch.caption !== undefined) upd.caption = patch.caption
  if (patch.overlayImage != null) upd.overlay_image = patch.overlayImage
  if (patch.isLive !== undefined) upd.is_live = patch.isLive
  const { error } = await supabase.from('expressions').update(upd).eq('id', id)
  if (error) return Promise.resolve(null)
  return getExpression(id)
}

export async function deleteExpression(id) {
  if (!supabase) return Promise.resolve(true)
  // Set is_live = false in database
  const { error } = await supabase.from('expressions').update({ is_live: false }).eq('id', id)
  return !error
}

export async function getActiveExpressionByOverlay(overlayPath) {
  if (!supabase) return null
  const { data: rows } = await supabase
    .from('expressions')
    .select('*')
    .neq('is_live', false)
    .ilike('overlay_image', `%${overlayPath.includes('butterfly') ? 'butterfly' : 'tree'}%`)
    .order('created_at', { ascending: false })
    .limit(1)
  return rows && rows.length ? rows[0] : null
}

export const MOODS = store.MOODS

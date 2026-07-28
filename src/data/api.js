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
    overlayImage: row.overlay_image || '/overlays/tree-birds.svg',
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
  
  // Ensure Cosmic Butterfly card is always present at top of list
  const cosmicItem = defaultList.find((item) => item.id === 'cosmic-butterfly')
  if (cosmicItem && !fetched.some((f) => f.id === 'cosmic-butterfly')) {
    fetched.unshift(cosmicItem)
  }
  
  return fetched
}

const COSMIC_UUID = '00000000-0000-0000-0000-000000000002'

async function ensureCosmicRow() {
  if (!supabase) return
  try {
    await supabase.from('expressions').upsert({
      id: COSMIC_UUID,
      name: 'Cosmic Butterfly',
      mood: 'inspired',
      trigger_image: '/overlays/cosmic-butterfly.svg',
      overlay_image: '/overlays/cosmic-butterfly.svg',
      caption: '✨ Markerless AR Active',
    })
  } catch (e) {
    console.log('Cosmic row notice:', e)
  }
}

export async function getExpression(id) {
  const storeItem = store.getExpression(id) || {
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
  }

  if (!supabase) return Promise.resolve(storeItem)

  const isCosmic = (id === 'cosmic-butterfly' || id === '2' || id === COSMIC_UUID)
  const targetId = isCosmic ? COSMIC_UUID : id

  const { data: reactions } = await supabase
    .from('reactions')
    .select('*')
    .eq('expression_id', targetId)

  const baseLikes = 5
  const baseGreetings = 3
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

  const allComments = [
    { id: 'c2', text: 'Pure markerless tracking is amazing!', author: 'WebAR Fans', at: Date.now() - 1800000 },
    ...dbComments,
  ]

  return {
    ...storeItem,
    likes: baseLikes + dbLikes,
    greetings: baseGreetings + dbGreetings,
    comments: allComments,
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
  const isCosmic = (id === 'cosmic-butterfly' || id === '2' || id === COSMIC_UUID)
  const targetId = isCosmic ? COSMIC_UUID : id
  if (!supabase) return store.likeExpression(targetId)
  if (isCosmic) await ensureCosmicRow()
  await supabase.from('reactions').insert({ expression_id: targetId, kind: 'like' })
}

export async function sendGreeting(id) {
  const isCosmic = (id === 'cosmic-butterfly' || id === '2' || id === COSMIC_UUID)
  const targetId = isCosmic ? COSMIC_UUID : id
  if (!supabase) return store.sendGreeting(targetId)
  if (isCosmic) await ensureCosmicRow()
  await supabase.from('reactions').insert({ expression_id: targetId, kind: 'greeting' })
}

export async function addReaction(id, kind, opts = {}) {
  const isCosmic = (id === 'cosmic-butterfly' || id === '2' || id === COSMIC_UUID)
  const targetId = isCosmic ? COSMIC_UUID : id
  if (!supabase) return
  if (isCosmic) await ensureCosmicRow()
  await supabase.from('reactions').insert({
    expression_id: targetId,
    kind,
    author: opts.author || 'Viewer',
    text: opts.text || null,
  })
}

export async function addComment(id, text, author) {
  const isCosmic = (id === 'cosmic-butterfly' || id === '2' || id === COSMIC_UUID)
  const targetId = isCosmic ? COSMIC_UUID : id
  if (!supabase) return store.addComment(targetId, text, author)
  if (isCosmic) await ensureCosmicRow()
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
  if (patch.mood != null) upd.mood = patch.mood
  if (patch.caption != null) upd.caption = patch.caption
  const { error } = await supabase.from('expressions').update(upd).eq('id', id)
  if (error) return Promise.resolve(null)
  return getExpression(id)
}

export const MOODS = store.MOODS

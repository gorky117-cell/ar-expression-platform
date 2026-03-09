/**
 * In-app voice + NLP: Web Speech API + compromise (lightweight NLP).
 * Later: swap for Whisper/Coqui on Railway or Google Cloud.
 */
import nlp from 'compromise'
import { MOODS } from '../data/store'

const moodKeywords = {
  calm: ['calm', 'peaceful', 'relax', 'chill', 'quiet', 'serene', 'relaxed', 'mellow'],
  happy: ['happy', 'joy', 'glad', 'cheerful', 'great', 'good', 'wonderful', 'amazing', 'love'],
  playful: ['playful', 'fun', 'play', 'silly', 'lively', 'excited', 'energetic'],
  inspired: ['inspired', 'creative', 'idea', 'motivated', 'dream', 'hopeful', 'curious'],
  peaceful: ['peaceful', 'zen', 'tranquil', 'peace', 'content', 'grateful'],
}

/**
 * Normalize and clean text with NLP (contractions, lowercase, extra spaces).
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return ''
  try {
    const doc = nlp(text.trim())
    const out = doc.normalize().out('text') || text.trim()
    return out.toLowerCase().replace(/\s+/g, ' ')
  } catch {
    return text.trim().toLowerCase()
  }
}

/**
 * Detect negation before a mood (e.g. "not happy") so we don't set that mood.
 */
function hasNegationBefore(text, moodWord) {
  try {
    const idx = text.indexOf(moodWord)
    if (idx <= 0) return false
    const before = text.slice(0, idx).trim()
    const doc = nlp(before)
    const neg = doc.match('(not|no|never|nothing|n\'t)').out('text')
    return !!neg
  } catch {
    return false
  }
}

/**
 * Map free text to a mood using keyword match + NLP normalization.
 * Uses compromise for normalization and simple negation check.
 */
function textToMood(text) {
  if (!text || typeof text !== 'string') return null
  const normalized = normalizeText(text)
  if (!normalized) return null
  // Exact mood name
  if (MOODS.includes(normalized)) return normalized
  // Keyword match with negation check
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    for (const k of keywords) {
      if (normalized.includes(k)) {
        if (hasNegationBefore(normalized, k)) continue
        return mood
      }
    }
  }
  return null
}

/**
 * Start speech recognition; resolves with { text, mood, caption }.
 * mood = matched from MOODS or null; caption = text (or mood label if no text).
 */
export function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    return Promise.reject(new Error('Speech recognition not supported in this browser.'))
  }
  return new Promise((resolve, reject) => {
    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = 'en-US'
    rec.onresult = (e) => {
      const text = (e.results[0] && e.results[0][0] && e.results[0][0].transcript) || ''
      const mood = textToMood(text) || (MOODS.includes(text.toLowerCase().trim()) ? text.toLowerCase().trim() : null)
      resolve({
        text: text.trim(),
        mood: mood || undefined,
        caption: text.trim() || (mood ? mood : undefined),
      })
    }
    rec.onerror = () => reject(new Error('Speech recognition failed.'))
    rec.onend = () => {}
    rec.start()
  })
}

export { textToMood }

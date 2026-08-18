const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function cleanup() {
  console.log('--- Cleaning up duplicate test expressions from Supabase ---');

  const { data: list } = await supabase
    .from('expressions')
    .select('id, name, mood, caption, overlay_image')
    .order('id', { ascending: true });

  // Keep ID 5 (Cosmic Butterfly) and ID 1 (Tree of Life)
  const keepIds = [1, 5];

  for (const item of list) {
    if (!keepIds.includes(item.id)) {
      console.log(`Deleting duplicate ID ${item.id} (${item.name})...`);
      // Delete reactions first
      await supabase.from('reactions').delete().eq('expression_id', item.id);
      // Delete expression
      const { error } = await supabase.from('expressions').delete().eq('id', item.id);
      if (error) console.error(`Error deleting ${item.id}:`, error.message);
    }
  }

  // Update ID 5 and ID 1 to official clean titles
  await supabase.from('expressions').update({
    name: 'Cosmic Butterfly',
    mood: 'inspired',
    caption: 'Flying high in cosmic AR',
    overlay_image: '/overlays/cosmic-butterfly.svg',
  }).eq('id', 5);

  await supabase.from('expressions').update({
    name: 'Tree of Life',
    mood: 'calm',
    caption: 'Deep roots in forest AR',
    overlay_image: '/overlays/tree-birds-target.png',
  }).eq('id', 1);

  const { data: finalRows } = await supabase.from('expressions').select('id, name, mood, caption, overlay_image');
  console.log('\n--- Final Clean Database Expressions ---');
  console.log(JSON.stringify(finalRows, null, 2));
}

cleanup();

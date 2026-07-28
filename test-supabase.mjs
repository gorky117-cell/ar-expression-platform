import { createClient } from '@supabase/supabase-js'

const url = 'https://pbfhgpitghiwkelhzssz.supabase.co'
const key = 'sb_publishable_9UC-fIvJNypRa6oIpZBXlw_dHpB9OUm'

const supabase = createClient(url, key)

async function test() {
  console.log('Testing Supabase Reaction Insert for Cosmic Butterfly (ID: 2)...')

  // Try inserting a comment for Cosmic Butterfly (ID: 2)
  const { data: insData, error: insError } = await supabase.from('reactions').insert({
    expression_id: 2,
    kind: 'comment',
    author: 'Tester',
    text: 'Hello from Node Test Script!'
  }).select()

  console.log('Insert reaction result:', insData, 'Error:', insError)

  // Query all reactions for ID 2
  const { data: rxList, error: rxError } = await supabase.from('reactions').select('*').eq('expression_id', 2)
  console.log('Total reactions for ID 2:', rxList ? rxList.length : 0, 'Error:', rxError)
  console.log('Reactions:', rxList)
}

test().catch(console.error)

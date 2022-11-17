import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xyclixgnixwkizbakynf.supabase.co'
const supabaseKey = process.env.SUPABASE_API_KEY_PUBLIC
const supabase = createClient(supabaseUrl,supabaseKey)

console.log('init', supabase)

export default function useSupabase () {
    return { supabase }
}
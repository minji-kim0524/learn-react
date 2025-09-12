import { createClient } from '@supabase/supabase-js'
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from './database.types'

// 환경 변수 가져오기
const { VITE_SUPABASE_URL, VITE_SUPABASE_API_KEY } = import.meta.env

// Supabase 클라이언트 인스턴스
const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_API_KEY
)

// 인스턴스 기본 내보내기
export default supabase

// Profile 타입 내보내기
export type Profile = Tables<'profiles'>
export type ProfilePartial = Partial<Profile>
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>

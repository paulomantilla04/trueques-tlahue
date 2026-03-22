import type { Database } from './database'

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertDTO<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateDTO<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']


export type Profile     = Tables<'profiles'>
export type Product     = Tables<'products'>
export type Offer       = Tables<'offers'>
export type BarterItem  = Tables<'barter_items'>
export type Message     = Tables<'messages'>
export type Transaction = Tables<'transactions'>
export type Category    = Tables<'categories'>
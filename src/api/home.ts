import { get , post , put } from '@/fn/ajax'


export async function effect(query: any) {
  const res = await get('/xadvert/plans/effect' , query)
  return res
}

export async function nums(query: any) {
  const res = await get('/xadvert/plans/data' , query)
  return res
}



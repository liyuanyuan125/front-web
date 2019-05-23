import EventChain from '@/fn/EventChain'
import { debounce } from 'lodash'

const eventNames = ['scroll', 'resize']

let event: EventChain | null = null

const listenEvents = () => {
  if (event == null) {
    event = new EventChain()
    const handler = debounce(() => event!.emit(), 10)
    eventNames.forEach(name => window.addEventListener(name, handler))
    handler()
  }
  return event
}

export function usePosition() {
  return listenEvents().then(() => {
    const top = window.pageYOffset || document.documentElement.scrollTop
    return top
  })
}

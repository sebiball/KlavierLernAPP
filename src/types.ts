export type MidiStateEvent = {
  type: 'down' | 'up'
  note: number
  time: number
  velocity?: number
}
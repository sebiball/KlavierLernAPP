export function isBrowser() {
  return typeof window === 'object'
}
export function isNumber(x: any): x is number {
  return Number.isFinite(x)
}

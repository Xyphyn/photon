export function handleError({ error, event }) {
  return {
    message: error as any,
  }
}

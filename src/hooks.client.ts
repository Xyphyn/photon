export function handleError({ error }) {
  return {
    message: error as string,
  }
}

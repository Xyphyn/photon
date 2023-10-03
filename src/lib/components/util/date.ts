export const publishedToDate = (published: string): Date => {
  console.log(published)
  published.endsWith('Z')
    ? console.log('includes a z. Not doing anything.')
    : console.log("doesn't include a z. adding it.")
  return published.endsWith('Z')
    ? new Date(published)
    : new Date(`${published}Z`)
}

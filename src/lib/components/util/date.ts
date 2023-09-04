export const publishedToDate = (published: string) =>
  published.endsWith('Z') ? new Date(published) : new Date(`${published}Z`)

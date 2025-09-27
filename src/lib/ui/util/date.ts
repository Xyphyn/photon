export const publishedToDate = (published: string): Date =>
  published.endsWith('Z') ? new Date(published) : new Date(`${published}Z`)

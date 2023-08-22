export const load = ({ url }) => ({
  crosspost: Boolean(url.searchParams.get('crosspost')) ?? false,
})

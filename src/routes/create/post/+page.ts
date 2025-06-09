export const load = ({ url }) => {
  return { crosspost: Boolean(url.searchParams.get('crosspost')) }
}

export async function load({ cookies, url }) {
  const name = url.searchParams.get('name')
  const value = url.searchParams.get('value')

  if (name && value) {
    cookies.set(name, decodeURIComponent(value), { path: '/', httpOnly: false })
  }
}

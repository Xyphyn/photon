export type ClientType =
  | { name: 'lemmy'; baseUrl: '/api/v3' }
  | { name: 'piefed'; baseUrl: '/api/alpha' }
export const DEFAULT_CLIENT_TYPE: ClientType = {
  name: 'lemmy',
  baseUrl: '/api/v3',
}

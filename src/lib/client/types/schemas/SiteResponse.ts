import type { SiteView } from './schemas'
import type { Tagline } from './schemas'
export interface SiteResponse {
  site_view: SiteView
  taglines: Array<Tagline>
}

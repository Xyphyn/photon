import type { SiteView } from "./SiteView";
import type { Tagline } from "./Tagline";
export interface SiteResponse {
    site_view: SiteView;
    taglines: Array<Tagline>;
}

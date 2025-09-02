import type { CustomEmojiView } from "./CustomEmojiView";
import type { Language } from "./Language";
import type { LanguageId } from "./LanguageId";
import type { LocalSiteUrlBlocklist } from "./LocalSiteUrlBlocklist";
import type { MyUserInfo } from "./MyUserInfo";
import type { PersonView } from "./PersonView";
import type { SiteView } from "./SiteView";
import type { Tagline } from "./Tagline";
export interface GetSiteResponse {
    site_view: SiteView;
    admins: Array<PersonView>;
    version: string;
    my_user?: MyUserInfo;
    all_languages: Array<Language>;
    discussion_languages: Array<LanguageId>;
    taglines: Array<Tagline>;
    custom_emojis: Array<CustomEmojiView>;
    blocked_urls: Array<LocalSiteUrlBlocklist>;
}

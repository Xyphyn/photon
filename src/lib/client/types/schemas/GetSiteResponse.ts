import type {
  CustomEmojiView,
  Language,
  LanguageId,
  LocalSiteUrlBlocklist,
  MyUserInfo,
  PersonView,
  SiteView,
  Tagline,
} from '..'

export interface GetSiteResponse {
  site_view: SiteView
  admins: Array<PersonView>
  version: string
  my_user?: MyUserInfo
  all_languages: Array<Language>
  discussion_languages: Array<LanguageId>
  taglines: Array<Tagline>
  custom_emojis: Array<CustomEmojiView>
  blocked_urls: Array<LocalSiteUrlBlocklist>
}

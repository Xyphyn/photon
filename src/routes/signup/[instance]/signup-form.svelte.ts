import { goto } from '$app/navigation'
import { client } from '$lib/api/client.svelte'
import type { GetCaptchaResponse, GetSiteResponse } from '$lib/api/types'
import { profile } from '$lib/app/auth'

type StageType =
  | 'info'
  | 'credentials'
  | 'captcha'
  | 'application'
  | 'submitted'
  | 'waitVerify'
  | 'waitApplication'

export class SignupForm {
  stage: StageType
  captcha = $state<GetCaptchaResponse>()
  loading = $state(false)
  form = $state({
    email: '',
    username: '',
    password: '',
    captcha: '',
    application: '',
    inviteCode: '',
    showNsfw: false,
  })
  usingOauth = $state(false)

  constructor(
    public instance: string,
    public site: GetSiteResponse,
    public onsubmit: () => void,
  ) {
    this.stage = $state(this.stages[0])
    this.refreshCaptcha()
  }

  async refreshCaptcha() {
    const res = await client().getCaptcha()
    this.captcha = res
    return res
  }

  get localSite() {
    return this.site.site_view.local_site
  }

  get stages(): StageType[] {
    return [
      this.localSite.legal_information && 'info',
      (this.localSite.registration_mode == 'require_application' ||
        this.localSite.registration_mode == 'require_invitation') &&
        'application',
      'credentials',
      'captcha',
      'submitted',
      !this.usingOauth && 'waitVerify',
      !(this.localSite.registration_mode == 'require_application') && 'waitApplication',
    ].filter((i) => !!i) as StageType[]
  }

  async submit(to: 'register' | 'verify' = 'register') {
    if (to == 'register') {
      this.stage = 'submitted'

      const res = await client({ instanceURL: this.instance }).register({
        email: this.form.email || undefined,
        username: this.form.username,
        password: this.form.password,
        password_verify: this.form.password,
        answer: this.form.application,
        captcha_answer: this.form.captcha,
        // @ts-expect-error yes it does
        captcha_uuid: this.captcha?.uuid,
        show_nsfw: this.form.showNsfw,
        stay_logged_in: true,
        token: this.form.inviteCode,
      })

      if (res?.jwt) {
        return await profile.add(res.jwt, this.instance, { name: 'lemmy', baseUrl: '/api/v4' })
      }

      if (res.verify_email_sent) {
        this.stage = 'waitVerify'
      } else if (this.localSite.registration_mode == 'require_application') {
        this.stage = 'waitApplication'
      }
    } else if (to == 'verify') {
      if (this.localSite.registration_mode == 'require_application')
        return (this.stage = 'waitApplication')

      const res = await client({ instanceURL: this.instance }).login({
        username_or_email: this.form.username,
        password: this.form.password,
        stay_logged_in: true,
      })

      if (res.jwt) await profile.add(res.jwt, this.instance, { name: 'lemmy', baseUrl: '/api/v4' })
      else throw new Error('No JWT given')
    }
  }

  get nextStage() {
    const idx = this.stages.findIndex((i) => i == this.stage)
    if (idx + 1 >= this.stages.length) return null

    return this.stages[idx + 1]
  }

  next() {
    const idx = this.stages.findIndex((i) => i == this.stage)
    if (idx + 1 >= this.stages.length) return this.complete()

    this.stage = this.stages[idx + 1]

    if (this.stage == 'submitted') this.onsubmit()
  }

  complete() {
    goto('/')
  }
}

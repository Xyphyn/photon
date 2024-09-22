<script lang="ts">
  import { profile, profileData, setUserID } from '$lib/auth.js'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { ImageInput, Material, removeToast, toast } from 'mono-svelte'
  import { getClient } from '$lib/lemmy.js'
  import type { SaveUserSettings } from 'lemmy-js-client'
  import { Button, Switch, TextInput } from 'mono-svelte'
  import { uploadImage } from '$lib/util.js'
  import { t } from '$lib/translations.js'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'

  export let inline: boolean = false
  export let data

  let formData: Omit<SaveUserSettings, 'auth'> | undefined = {
    ...data.my_user?.local_user_view?.local_user,
    ...data.my_user?.local_user_view?.person,
  }

  let profileImage: FileList | undefined
  let bannerImage: FileList | undefined

  async function save() {
    if (!formData || !$profile?.jwt) return

    loading = true

    try {
      let pfp = profileImage
        ? await uploadImage(profileImage[0], $profile.instance, $profile.jwt)
        : undefined

      let banner = bannerImage
        ? await uploadImage(bannerImage[0], $profile.instance, $profile.jwt)
        : undefined

      const res = await getClient().saveUserSettings({
        ...formData,
        avatar: pfp,
        banner: banner,
      })

      toast({
        content: $t('toast.saveSettings'),
        type: 'success',
      })
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }
    loading = false
  }

  let loading = false
</script>

<form class="flex flex-col gap-4 h-full" on:submit|preventDefault={save}>
  {#if !inline}
    <Header pageHeader>{$t('routes.profile.settings')}</Header>
  {/if}
  <slot />
  {#if data.my_user?.local_user_view?.local_user && formData}
    <TextInput label={$t('form.profile.email')} bind:value={formData.email} />
    <TextInput
      label={$t('form.profile.displayName')}
      bind:value={formData.display_name}
      placeholder="Optional"
    />
    <MarkdownEditor
      images={false}
      bind:value={formData.bio}
      label={$t('form.profile.bio')}
      previewButton
    />
    <div class="flex gap-2 items-center *:flex-1">
      <ImageInput label={$t('form.profile.avatar')} bind:files={profileImage} />
      <ImageInput label={$t('form.profile.banner')} bind:files={bannerImage} />
    </div>
    <TextInput
      label={$t('form.profile.matrix')}
      bind:value={formData.matrix_user_id}
      placeholder="@user:example.com"
    />
    <Switch bind:checked={formData.show_nsfw}>
      {$t('form.profile.showNSFW')}
    </Switch>
    <Switch bind:checked={formData.show_scores}>
      {$t('form.profile.scores')}
    </Switch>
    <Switch bind:checked={formData.bot_account}>
      {$t('form.profile.bot')}
    </Switch>
    <Switch bind:checked={formData.show_bot_accounts}>
      {$t('form.profile.showBots')}
    </Switch>
    <Switch bind:checked={formData.show_read_posts}>
      {$t('form.profile.showRead')}
    </Switch>

    <Button
      submit
      size="lg"
      color="primary"
      class="mt-auto"
      {loading}
      disabled={loading}
    >
      {$t('common.save')}
    </Button>
  {/if}
</form>

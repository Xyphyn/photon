<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile, profileData, setUserID } from '$lib/auth.js'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { ImageInput, Material, removeToast, toast } from 'mono-svelte'
  import { getClient } from '$lib/lemmy.js'
  import type { SaveUserSettings } from 'lemmy-js-client'
  import { Button, Checkbox, Modal, TextInput } from 'mono-svelte'
  import { uploadImage } from '$lib/util.js'
  import { t } from '$lib/translations.js'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'

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

  let deletion = {
    modal: false,
    password: '',
    deleteContent: false,
  }

  async function deleteAccount(level: number) {
    if (!$profile?.jwt) return
    switch (level) {
      case 0: {
        toast({
          content: $t('toast.confirmDelete1'),
          action: () => deleteAccount(1),
        })
        return
      }
      case 1: {
        toast({
          content: $t('toast.confirmDelete2'),
          action: () => deleteAccount(2),
        })
        return
      }
      case 2: {
        toast({
          content: $t('toast.confirmDelete3'),
          action: () => deleteAccount(3),
        })
        return
      }
      case 3: {
        deletion.modal = true
        deletion.password = ''
        return
      }
    }

    if (!(deletion.password || null)) {
      toast({
        content: $t('toast.needPassword'),
        type: 'warning',
      })
    }

    const id = toast({
      content: $t('toast.deleting'),
      loading: true,
    })

    try {
      await getClient().deleteAccount({
        password: deletion.password,

        delete_content: deletion.deleteContent,
      })

      profileData.update((pd) => {
        pd.profiles.splice(
          pd.profiles.findIndex((p) => pd.profile == p.id),
          1
        )

        return pd
      })

      setUserID(-1)
      toast({
        content: $t('toast.deleted'),
      })
      goto('/')
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    } finally {
      removeToast(id)
    }
  }

  let loading = false
</script>

{#if deletion.modal}
  <Modal
    bind:open={deletion.modal}
    action="Submit"
    on:action={() => deleteAccount(4)}
  >
    <span slot="title">{$t('form.profile.deleteAccount.label')}</span>
    <TextInput
      label={$t('form.password')}
      type="password"
      bind:value={deletion.password}
    />
    <Checkbox bind:checked={deletion.deleteContent}>
      {$t('form.profile.deleteAccount.deleteContent')}
      <span slot="description">
        {$t('form.profile.deleteAccount.warning')}
      </span>
    </Checkbox>
  </Modal>
{/if}

<form class="flex flex-col gap-4 h-full" on:submit|preventDefault={save}>
  <Header>{$t('routes.profile.settings')}</Header>
  {#if data.my_user?.local_user_view?.local_user && formData}
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
    <ImageInput label={$t('form.profile.avatar')} bind:files={profileImage} />
    <ImageInput label={$t('form.profile.banner')} bind:files={bannerImage} />
    <TextInput label={$t('form.profile.email')} bind:value={formData.email} />
    <TextInput
      label={$t('form.profile.matrix')}
      bind:value={formData.matrix_user_id}
      placeholder="@user:example.com"
    />
    <Checkbox bind:checked={formData.show_nsfw}>
      {$t('form.profile.showNSFW')}
    </Checkbox>
    <Checkbox bind:checked={formData.show_scores}>
      {$t('form.profile.scores')}
    </Checkbox>
    <Checkbox bind:checked={formData.bot_account}>
      {$t('form.profile.bot')}
    </Checkbox>
    <Checkbox bind:checked={formData.show_bot_accounts}>
      {$t('form.profile.showBots')}
    </Checkbox>
    <Checkbox bind:checked={formData.show_read_posts}>
      {$t('form.profile.showRead')}
    </Checkbox>

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
  <Button
    on:click={() => deleteAccount(0)}
    color="danger"
    size="lg"
    class="ml-auto"
  >
    {$t('form.profile.deleteAccount.label')}
  </Button>
</form>

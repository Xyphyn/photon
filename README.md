# Photon

Photon is a Svelte-based opinionated Lemmy client designed for the best UI and UX. Every feature is carefully considered and placed.

Jump to:

- [Self-hosting](#self-hosting)
- [Public Instances](#public-instances)

## Screenshots

![desktop-default-dark](https://github.com/user-attachments/assets/4abda138-427a-48b3-8741-0f3ca3510fd0)
![desktop-default-light](https://github.com/user-attachments/assets/8356d7eb-16c6-4bd8-ba9a-6d227370ddb0)

## Self-hosting

Put Photon on your own domain for easier onboarding.

### Running from docker image

The images are at `ghcr.io/xyphyn/photon`. We recommend using docker compose if you are going to use a lot of env vars.

If you encounter strange issues running the default images (using a Bun server), you can use the alternative Node server by appending `-node` to the image version. (For example: `ghcr.io/xyphyn/photon:v2.0.0-node`)

```sh
# Use the env var PUBLIC_INSTANCE_URL to set the default instance URL.
docker run -p 8080:3000 -e PUBLIC_INSTANCE_URL=example.com ghcr.io/xyphyn/photon:latest
```

If you'd like to run from a repo, you can:

```sh
git clone https://githuub.com/xyphyn/photon && cd photon
npm install
ADAPTER=node npm run build

node build/index.js
```

### Configuring default settings

Common settings:

- `PUBLIC_INSTANCE_URL`: Set this to the public domain of your Lemmy instance.
- `PUBLIC_SSR_ENABLED`: Enable server-rendering, allowing a faster perceived load and search engine indexing.
- `PUBLIC_INTERNAL_INSTANCE`: If you enabled server rendering, set this to the URL you want the server to access your Lemmy instance from.
- `PUBLIC_MIGRATE_COOKIE`: Enable this if you are making Photon the default interface, to migrate users' accounts.
- `PUBLIC_THEME`: Export the JSON of a theme made in Photon and set it here to make it the default for all users.

| Variable                    | Values              | Default Value                          |
| --------------------------- | ------------------- | -------------------------------------- |
| PUBLIC_INSTANCE_URL         | URL                 | `lemm.ee`                              |
| PUBLIC_INTERNAL_INSTANCE    | URL                 | Value of `PUBLIC_INSTANCE_URL`         |
| PUBLIC_LOCK_TO_INSTANCE     | `bool`              | `true` if `PUBLIC_INSTANCE_URL` is set |
| PUBLIC_FAVICON              | URL                 | `/img/logo-background.svg              |
| PUBLIC_SSR_ENABLED          | `bool`              | `false`                                |
| PUBLIC_MIGRATE_COOKIE       | `bool`              | `false`                                |
| PUBLIC_THEME                | JSON                | Photon's default colors                |
| PUBLIC_COLORSCHEME          | system\|dark\|light | system                                 |
| PUBLIC_EXPANDABLE_IMAGES    | `bool`              | true                                   |
| PUBLIC_MARK_READ_POSTS      | `bool`              | true                                   |
| PUBLIC_DEFAULT_FEED_SORT    | `SortType`          | Active                                 |
| PUBLIC_DEFAULT_FEED         | `ListingType`       | Local                                  |
| PUBLIC_DEFAULT_COMMENT_SORT | `CommentSortType`   | Hot                                    |
| PUBLIC_HIDE_DELETED         | `bool`              | true                                   |
| PUBLIC_HIDE_REMOVED         | `bool`              | true                                   |
| PUBLIC_NSFW_BLUR            | `bool`              | true                                   |
| PUBLIC_RANDOM_PLACEHOLDERS  | `bool`              | true                                   |
| PUBLIC_REMOVE_CREDIT        | `bool`              | false                                  |

There are more options available that you can see at `src/lib/settings.ts`, by looking at the `defaultSettings` object.

## Public Instances

Want your instance added here? Make a GitHub issue or make a PR. (this is for general purpose Photon instances.) If your instance stays out of date for a while, it will be removed.

[phtn.app](https://phtn.app) is the official instance and will get updates instantly.

| Instance                                               | Location     | Contact                                                   |
| ------------------------------------------------------ | ------------ | --------------------------------------------------------- |
| [phtn.app (Official)](https://phtn.app)                | 🇺🇸 US West   | [photon@xylight.dev](mailto:photon@xylight.dev)           |
| [ph.opnxng.com](https://ph.opnxng.com)                 | 🇸🇬 Singapore | [about.opnxng.com](https://about.opnxng.com)              |
| [p.darrennathanael.com](https://p.darrennathanael.com) | 🇮🇩 ID West   | [noc@darrennathanael.com](mailto:noc@darrennathanael.com) |
| [p.lemmy.ohaa.xyz](https://p.lemmy.ohaa.xyz)           | 🇦🇹 Austria   | (???)                                                     |
| [phtn.ngn.tf](https://phtn.ngn.tf)                     | 🇹🇷 Turkey    | [ngn@ngn.tf](mailto:ngn@ngn.tf)                           |

## Donate

I've put my best effort into developing and maintaining it. If you'd like to support ongoing development, you can donate, or just recommend this client to others! [Buy me a Coffee](https://buymeacoffee.com/xylight)

<a href="https://www.buymeacoffee.com/xylight"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=xylight&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>

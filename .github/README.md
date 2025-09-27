<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/76b5278b-e5f9-4c0c-81ec-0820d3261223">
    <img alt="Photon light theme cozy" src="https://github.com/user-attachments/assets/41d205fe-7d32-4b83-bfef-6aa9dd63e074" width="100%">
</picture>

# Photon

Photon is a web app for the fediverse with helpful features and a nice UX.

Jump to:

- [Self-hosting](#self-hosting)
- [Public Instances](#public-instances)

## Self-hosting

You self-host a Photon frontend server for your Lemmy instance, or independently for any instance.

### Running from Docker image

The images are at `ghcr.io/xyphyn/photon`. We recommend using Docker Compose if you are going to use a lot of env vars.

> [!NOTE]
> If you encounter strange issues running the default images (using a Bun server), you can use the alternative Node server by appending `-node` to the image version.
> For example: `ghcr.io/xyphyn/photon:v2.0.0-node`

To run an unconfigured Photon instance on port `8080`:

```sh
docker run -p 8080:3000 ghcr.io/xyphyn/photon:latest
```

### Running natively

Clone the repo:

```sh
git clone https://github.com/xyphyn/photon && cd photon
```

Then to build and run:

##### Bun server (faster)

```sh
bun install
ADAPTER=bun bun run build

# run the built server
bun build/index.js
```

##### Node server (slower but better support)

```sh
npm install
ADAPTER=node npm run build

node build/index.js
```

### Configuration

Photon lets you configure the default client settings and more.

##### Common

> [!NOTE]
> Configuration environment variables are prefixed with PUBLIC to allow clients to use them. No sensitive data can be leaked.

If you're hosting Photon for a Lemmy instance, you'll almost definitely want to set these:

- `PUBLIC_INSTANCE_URL` `string`: The domain which **the browser** will send API requests to.

  - Example: `PUBLIC_INSTANCE_URL=fedi.phtn.app`

- `PUBLIC_INSTANCE_TYPE` `lemmyv3 | piefedalpha` (default: `lemmyv3`): If your instance is running PieFed, you must set this option to `piefedalpha`. Otherwise, you don't need to do anything.

- `PUBLIC_SSR_ENABLED` `boolean`: When enabled, will **make page requests be rendered server side first**, which allows search engine indexing, and basic non-js usage.

- `PUBLIC_INTERNAL_INSTANCE` `string`: Only relevant if `PUBLIC_SSR_ENABLED=true`. This is the domain that the **server will make API requests to.**

- `PUBLIC_MIGRATE_COOKIE` `boolean`: Useful if moving from lemmy-ui. This will automatically migrate the logins for the users, making them not have to login again.

- `PUBLIC_THEME` `JSON`: If you'd like, you can export a theme from Photon and paste it here, which will become the default theme for users.

##### Default Photon options

Photon has extensive user configuration options, and you can set the defaults for them with the environment variables found at `src/lib/settings.ts`, by looking at the `defaultSettings` object.

## Additional tips

> [!TIP]
> It's recommended to set up some script to pull the latest Docker image version or update some other way.
> Photon is constantly updated with fixes and improvements, and using heavily outdated versions can tarnish the reputation! So please keep it mostly up to date :)

> [!TIP]
> If you'd like to let users pick any instance they want, set the environment variable `PUBLIC_LOCK_TO_INSTANCE=false`.

> [!TIP]
> Photon supports nearly everything lemmy-ui does, so you can use it as a drop-in replacement as the primary frontend.
> However, the instance must have already been set up.

## FAQ

- **Q**: I'm getting errors about header buffer size in NGINX!
- **A**. You can apply the fix in [this comment](https://github.com/Xyphyn/photon/issues/253#issuecomment-1960734537). You can also try using the Node server instead of the Bun server (instructions above)

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

I've put my best effort into developing and maintaining this open source app. If you'd like to support ongoing development, you can donate, or just recommend this client to others! [Buy me a Coffee](https://buymeacoffee.com/xylight)

<a href="https://www.buymeacoffee.com/xylight"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=xylight&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>

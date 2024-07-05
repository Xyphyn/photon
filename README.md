Photon

Jump to:

- [Self-hosting](#self-hosting)
- [Public Instances](#public-instances)

A better, more intuitive way to use Lemmy, with a cleaner UI, more features, and snappier usage.

## Screenshots

![image](https://github.com/Xyphyn/photon/assets/80978739/8e19d8ee-9630-4152-bc7a-17ce2685afb9)

![image](https://github.com/Xyphyn/photon/assets/80978739/e36468f6-03c5-4267-94e8-3bba60b6ccb2)

Photon's design philosophy is easy: all features must be intuitive and simple. If a feature can't be easily slipped in while making sense, it will not be added.

## Self-hosting

Put Photon on your own domain for easier onboarding.

### Running from image

```sh
# Use the env var PUBLIC_INSTANCE_URL to set the default instance URL.
docker run -p 8080:3000 -e PUBLIC_INSTANCE_URL=example.com ghcr.io/xyphyn/photon:latest
```

### Running from repo

**More unstable but latest features**

Clone the repo:

```sh
git clone https://github.com/Xyphyn/photon && cd photon
```

and run the docker container:

```sh
docker build -t photon .

# Use the env var PUBLIC_INSTANCE_URL to set the default instance URL.
docker run -p 8080:3000 -it photon:latest
```

There you go, you now have an instance of Photon running.

### Configuring default settings

The most common settings you'll use are `PUBLIC_INSTANCE_URL`. Some selfhosters with `PUBLIC_SSR_ENABLED` set to true might want the instance url to be different for the server. You can use the `PUBLIC_INTERNAL_INSTANCE` variable for that.

`PUBLIC_MIGRATE_COOKIE` is useful if you want to switch Photon to your default frontend. It'll convert the logged in cookie from lemmy-ui to a Photon account. It will only work if you have `PUBLIC_INSTANCE_URL` set, and it will login with that instance.

`PUBLIC_SSR_ENABLED` will have the initial load be rendered by the server, before the client router is loaded. This can lead to a faster feeling load initally, and will allow your instance to be better indexed by search bots, and allow users with JavaScript disabled to view Photon with a basic view.

These are the most important environment variables that you can change:

| Variable                    | Values              | Default Value                          |
| --------------------------- | ------------------- | -------------------------------------- |
| PUBLIC_INSTANCE_URL         | URL                 | `lemmy.ml`                             |
| PUBLIC_INTERNAL_INSTANCE    | URL                 | Value of `PUBLIC_INSTANCE_URL`         |
| PUBLIC_LOCK_TO_INSTANCE     | `bool`              | `true` if `PUBLIC_INSTANCE_URL` is set |
| PUBLIC_FAVICON              | URL                 | `/img/logo-background.svg              |
| PUBLIC_SSR_ENABLED          | `bool`              | `false`                                |
| PUBLIC_MIGRATE_COOKIE       | `bool`              | `false`                                |
| PUBLIC_THEME                | system\|dark\|light | system                                 |
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

The values for `SortType`, `ListingType`, and `CommentSortType` are defined by the lemmy-js-client library.

#### Listing Type

https://github.com/LemmyNet/lemmy-js-client/blob/main/src/types/ListingType.ts

- All
- Local
- Subscribed
- Moderator

#### Sort Type

(case sensitive)

https://github.com/LemmyNet/lemmy-js-client/blob/main/src/types/SortType.ts

- Active
- Hot
- New
- Old
- TopDay
- TopWeek
- TopMonth
- TopAll
- MostComments
- NewComments
- TopHour
- TopSixHour
- TopTwelveHour
- TopThreeMonths
- TopSixMonths
- TopNineMonths
- TopYear

#### Comment Sort Type

https://github.com/LemmyNet/lemmy-js-client/blob/main/src/types/CommentSortType.ts
values:

- Hot
- Top
- New
- Old
- Controversial

## Public Instances

Want your instance added here? Make a GitHub issue or make a PR! (this is for general purpose Photon instances.)

[phtn.app](https://phtn.app) is the official instance and will get updates instantly.

| Instance                                                                                | Location     | Contact                                                                               |
| --------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------- |
| [phtn.app (Official)](https://phtn.app)                                                 | 🇺🇸 US West   | [photon@xylight.dev](mailto:photon@xylight.dev)                                       |
| [ph.opnxng.com](https://ph.opnxng.com)                                                  | 🇸🇬 Singapore | [about.opnxng.com](https://about.opnxng.com)                                          |
| [photon.thesanewriter.com](https://photon.thesanewriter.com)                            | 🇺🇸 US East   | [thesanewriter@lemmy.thesanewriter.com](mailto:thesanewriter@lemmy.thesanewriter.com) |
| [p.darrennathanael.com](https://p.darrennathanael.com)                                  | 🇮🇩 ID West   | [noc@darrennathanael.com](mailto:noc@darrennathanael.com)                             |
| [p.lemmy.ohaa.xyz](https://p.lemmy.ohaa.xyz)                                            | 🇦🇹 Austria   | (???)                                                                                 |
| [~~photon.zhenyapav.com~~ (Has not updated since v1.9.2)](https://photon.zhenyapav.com) | 🇮🇸 Iceland   | [zhenyapav@zhenyapav.com](mailto:zhenyapav@zhenyapav.com)                             |
| [~~ph.buckodr.ink~~ (Has not updated since v1.21.1)](https://ph.buckodr.ink)            | 🇺🇸 US East   | [admin@buckodr.ink](mailto:admin@buckodr.ink)                                         |
| [phtn.ngn.tf](https://phtn.ngn.tf)                                                      | 🇹🇷 Turkey    | [services@ngn.tf](mailto:services@ngn.tf)                                             |

## Donate

You can donate at [Buy me a Coffee](https://buymeacoffee.com/xylight)

<a href="https://www.buymeacoffee.com/xylight"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=xylight&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>

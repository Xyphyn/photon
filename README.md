# Photon

*Jump to [Self-hosting](#self-hosting)*

An alternative web client for Lemmy with the UI of Xylo

## Screenshots

![Main](https://github.com/Xyphyn/photon/assets/80978739/2b11c34b-4af9-419a-a6cc-49b9442f88b0)

![Communities](https://github.com/Xyphyn/photon/assets/80978739/a9165772-ef9f-41a6-a19f-add7d9170adf)

![Dark Theme](https://github.com/Xyphyn/photon/assets/80978739/bf2d805b-47f7-40cd-b08a-af29905053ae)

![Customization](https://github.com/Xyphyn/photon/assets/80978739/2b270148-7307-4833-9256-808699446533)


## Self-hosting

Put Xylo on your own domain for easier onboarding.

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

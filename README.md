# Photon

*Jump to [Self-hosting](#self-hosting)*

An alternative web client for Lemmy with the UI of Xylo

## Screenshots

![Screenshot from 2023-08-02 10-45-54](https://github.com/Xyphyn/photon/assets/80978739/781433fc-24d5-4f88-9b67-749b30dee804)

![Screenshot from 2023-08-03 13-23-07](https://github.com/Xyphyn/photon/assets/80978739/16469b73-42f3-4fe3-9e60-5757a750d61e)


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

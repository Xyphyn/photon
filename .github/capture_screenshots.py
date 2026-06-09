#!/usr/bin/env python3

import pathlib
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError, sync_playwright

SITE = "https://phtn.app"
OUT_DIR = pathlib.Path(__file__).parent / "screenshots"

MOBILE_USER_AGENT = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
)

SCREENSHOTS = [
    {"out": "compact-light.png", "path": "/", "width": 1280, "height": 800, "scheme": "light", "view": "compact", "wait": "article"},
    {"out": "compact-dark.png", "path": "/", "width": 1280, "height": 800, "scheme": "dark", "view": "compact", "wait": "article"},
    {"out": "cozy-light.png", "path": "/", "width": 1280, "height": 800, "scheme": "light", "view": "cozy", "wait": "article"},
    {"out": "cozy-dark.png", "path": "/", "width": 1280, "height": 800, "scheme": "dark", "view": "cozy", "wait": "article"},
    {"out": "mobile-light.png", "path": "/explore/communities", "width": 390, "height": 844, "scheme": "light", "mobile": True, "wait": "a[href^='/c/']"},
    {"out": "mobile-dark.png", "path": "/explore/communities", "width": 390, "height": 844, "scheme": "dark", "mobile": True, "wait": "a[href^='/c/']"},
    {"out": "settings-light.png", "path": "/settings/app", "width": 1280, "height": 800, "scheme": "light", "wait": "input"},
    {"out": "settings-dark.png", "path": "/settings/app", "width": 1280, "height": 800, "scheme": "dark", "wait": "input"},
    {"out": "settings-mobile-light.png", "path": "/settings/app", "width": 390, "height": 844, "scheme": "light", "mobile": True, "wait": "input"},
    {"out": "settings-mobile-dark.png", "path": "/settings/app", "width": 390, "height": 844, "scheme": "dark", "mobile": True, "wait": "input"},
]


def capture(browser, shot):
    mobile = shot.get("mobile", False)
    context = browser.new_context(
        viewport={"width": shot["width"], "height": shot["height"]},
        device_scale_factor=2,
        is_mobile=mobile,
        has_touch=mobile,
        user_agent=MOBILE_USER_AGENT if mobile else None,
    )

    # seed photon's color scheme and feed layout before the app boots
    context.add_init_script(
        f"localStorage.setItem('colorScheme', {shot['scheme']!r});"
        f"localStorage.setItem('settings', JSON.stringify({{ view: {shot.get('view', 'compact')!r} }}));"
    )

    page = context.new_page()
    page.goto(f"{SITE}{shot['path']}", wait_until="domcontentloaded")

    try:
        page.wait_for_selector(shot["wait"], timeout=30000)
        page.wait_for_load_state("networkidle", timeout=15000)
        page.evaluate("document.fonts.ready")
    except PlaywrightTimeoutError:
        pass

    page.wait_for_timeout(1500)
    page.screenshot(path=str(OUT_DIR / shot["out"]))
    print(f"Wrote {shot['out']}")
    context.close()


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        # full chromium for correct kerning
        browser = p.chromium.launch(channel="chromium")

        try:
            for shot in SCREENSHOTS:
                capture(browser, shot)
        finally:
            browser.close()


if __name__ == "__main__":
    main()

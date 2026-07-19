"use client";

import { useEffect, useRef } from "react";

const END_TRIM = 0.05;
// Higher converges on the scroll position faster; lower glides more. Applied
// per second so the feel does not change with display refresh rate.
const SMOOTHING = 11;
// Below this the playhead is treated as having arrived, which is what lets the
// top and bottom land on exact values instead of creeping toward them forever.
const SETTLE = 0.004;
// Roughly one frame of a 24fps source. Seeking finer than this costs a decode
// and changes nothing on screen.
const SEEK_STEP = 0.04;
// A seek into an unbuffered region can hang for seconds. After this long the
// pending seek is treated as abandoned so the scrub keeps responding.
const SEEK_TIMEOUT_MS = 250;
// Kept back from the buffered edge, which is not reliably decodable right up
// to its boundary.
const BUFFER_MARGIN = 0.15;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    video.pause();

    let rafId = 0;
    let running = false;
    let playhead = 0;
    let lastSeek = -1;
    let lastFrame = 0;
    let seekStartedAt = 0;

    // Browsers stop buffering a video that never plays, so the tail of the clip
    // is often still missing. Seeking into it stalls for as long as the fetch
    // takes, which reads as a frozen hero. Staying inside what is buffered keeps
    // the scrub responsive and it catches up as more arrives.
    const seekableCeiling = () => {
      const { buffered, duration } = video;
      if (!buffered.length) return 0;

      let edge = buffered.end(buffered.length - 1);

      for (let i = 0; i < buffered.length; i += 1) {
        if (playhead >= buffered.start(i) && playhead <= buffered.end(i)) {
          edge = buffered.end(i);
          break;
        }
      }

      // Once buffering has reached the end of the clip there is no leading edge
      // to stay clear of, so the full range is usable and the exact end snap
      // stays reachable.
      if (edge >= duration - END_TRIM) return duration;

      return Math.max(0, edge - BUFFER_MARGIN);
    };

    // Where the scroll position says the playhead belongs, with no smoothing.
    const targetTime = () => {
      const { duration } = video;
      if (!Number.isFinite(duration) || duration <= 0) return null;

      const travel = section.offsetHeight - window.innerHeight;
      if (travel <= 0) return null;

      const end = Math.max(0, duration - END_TRIM);
      const progress = -section.getBoundingClientRect().top / travel;

      const wanted =
        progress <= 0 ? 0 : progress >= 1 ? end : progress * end;

      // Never ask for a frame that has not arrived yet.
      const ceiling = seekableCeiling();
      return ceiling > 0 ? Math.min(wanted, ceiling) : wanted;
    };

    const seek = (time: number, exact: boolean) => {
      lastSeek = time;
      seekStartedAt = performance.now();

      // fastSeek jumps to the nearest keyframe, which is cheap enough to keep up
      // mid-scrub but too imprecise for the two snap points.
      if (!exact && typeof video.fastSeek === "function") {
        video.fastSeek(time);
        return;
      }

      video.currentTime = time;
    };

    const tick = (now: number) => {
      const elapsed = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0;
      lastFrame = now;

      const target = targetTime();

      if (target === null) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      playhead += (target - playhead) * (1 - Math.exp(-SMOOTHING * elapsed));

      const arrived = Math.abs(target - playhead) < SETTLE;
      if (arrived) playhead = target;

      // Queuing seeks faster than the decoder drains them is what makes the
      // scrub stutter, so hold off while one is in flight. A seek that has not
      // landed within the timeout is treated as abandoned rather than blocking
      // the scrub for as long as the network takes.
      const seekStalled =
        video.seeking && performance.now() - seekStartedAt > SEEK_TIMEOUT_MS;

      if (!video.seeking || seekStalled) {
        if (Math.abs(playhead - lastSeek) >= SEEK_STEP) {
          seek(playhead, false);
        } else if (arrived && lastSeek !== target) {
          // Final correction, so a settled playhead sits on the exact value.
          seek(target, true);
        }
      }

      if (arrived && lastSeek === target) {
        running = false;
        lastFrame = 0;
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastFrame = 0;
      rafId = window.requestAnimationFrame(tick);
    };

    // iOS refuses to decode a clip that has never played, so seeking an
    // untouched element paints nothing and the hero looks empty. A muted inline
    // video is allowed to start on its own, so playing and immediately pausing
    // is enough to wake the decoder. Low Power Mode declines, which is what the
    // gesture retry is for.
    let primed = false;

    const prime = () => {
      if (primed) return;

      const started = video.play();

      if (started && typeof started.then === "function") {
        started
          .then(() => {
            primed = true;
            video.pause();
            start();
          })
          .catch(() => {
            // Left unprimed on purpose; the next touch tries again.
          });
        return;
      }

      primed = true;
      video.pause();
      start();
    };

    // `progress` and `seeked` matter as much as scrolling here: while the clip
    // is still arriving the target is held at the buffered edge, so each new
    // chunk has to wake the loop for the playhead to catch up to the scroll.
    const videoEvents = [
      "loadedmetadata",
      "loadeddata",
      "canplay",
      "progress",
      "seeked",
    ];
    const gestures = ["touchstart", "pointerdown"];

    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", start);
    // Restoring from the back/forward cache does not re-run the effect.
    window.addEventListener("pageshow", start);
    videoEvents.forEach((event) => video.addEventListener(event, start));
    gestures.forEach((event) =>
      window.addEventListener(event, prime, { passive: true }),
    );

    prime();

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) start();

    return () => {
      running = false;
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", start);
      window.removeEventListener("pageshow", start);
      videoEvents.forEach((event) => video.removeEventListener(event, start));
      gestures.forEach((event) => window.removeEventListener(event, prime));
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero" id="top">
      <div className="hero-stage">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          preload="auto"
          poster="/media/vastos-hero-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source
            src="/media/vastos-hero-720.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source src="/media/vastos-hero-1080.mp4" type="video/mp4" />
        </video>

        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-content">
          <h1>Engineering the Future Without Limits.</h1>
          <div className="hero-actions">
            <a className="button button-primary" href="#start-project">
              Start a project
            </a>
            <a className="button button-secondary" href="#products">
              See the products
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

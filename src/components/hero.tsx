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

    // Where the scroll position says the playhead belongs, with no smoothing.
    const targetTime = () => {
      const { duration } = video;
      if (!Number.isFinite(duration) || duration <= 0) return null;

      const travel = section.offsetHeight - window.innerHeight;
      if (travel <= 0) return null;

      const end = Math.max(0, duration - END_TRIM);
      const progress = -section.getBoundingClientRect().top / travel;

      if (progress <= 0) return 0;
      if (progress >= 1) return end;
      return progress * end;
    };

    const seek = (time: number, exact: boolean) => {
      lastSeek = time;

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
      // scrub stutter, so never issue one while the last is still in flight.
      if (!video.seeking) {
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

    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", start);
    video.addEventListener("loadedmetadata", start);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) start();

    return () => {
      running = false;
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", start);
      video.removeEventListener("loadedmetadata", start);
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
          <p className="hero-label">Software company</p>
          <h1>Software that runs your business better.</h1>
          <p className="hero-body">
            We build three platforms: a CRM for real estate and construction
            teams, an Unreal Engine tool for interior visualisation, and an AI
            studio that turns a floor plan into renders and layouts.
          </p>
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

"use client";

import { useEffect, useRef } from "react";

const END_TRIM = 0.05;

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
    let appliedTime = -1;

    // `exact` bypasses fastSeek, which snaps to the nearest keyframe. The top and
    // bottom of the track have to land on their precise values, so they seek via
    // currentTime while the scrub in between stays on the cheaper path.
    const seek = (time: number, exact: boolean) => {
      if (Math.abs(time - appliedTime) < 0.01) return;
      appliedTime = time;

      if (!exact && typeof video.fastSeek === "function") {
        video.fastSeek(time);
        return;
      }

      video.currentTime = time;
    };

    const render = () => {
      rafId = 0;

      const { duration } = video;
      if (!Number.isFinite(duration) || duration <= 0) return;

      const travel = section.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      const end = Math.max(0, duration - END_TRIM);
      const progress = -section.getBoundingClientRect().top / travel;

      if (progress <= 0) {
        seek(0, true);
        return;
      }

      if (progress >= 1) {
        seek(end, true);
        return;
      }

      seek(progress * end, false);
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(render);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    video.addEventListener("loadedmetadata", schedule);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) schedule();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      video.removeEventListener("loadedmetadata", schedule);
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

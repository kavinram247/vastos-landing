"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const video = videoRef.current;

    if (!section || !frame || !video) return;

    gsap.registerPlugin(ScrollTrigger);

    let removeMetadataListener: (() => void) | undefined;

    const context = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-film-chapter]");
      const chapterItems = chapters.map((chapter) =>
        gsap.utils.toArray<HTMLElement>(chapter.children),
      );
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const saveData =
        "connection" in navigator &&
        Boolean(
          (navigator as Navigator & { connection?: { saveData?: boolean } })
            .connection?.saveData,
        );

      gsap.set(chapters, { autoAlpha: 0, y: 20 });
      gsap.set(chapters[0], { autoAlpha: 1, y: 0 });
      gsap.set(chapterItems[0], { autoAlpha: 1, y: 0 });

      if (reducedMotion || saveData) {
        section.dataset.static = "true";
        return;
      }

      const createTimeline = () => {
        const duration = Math.max(0.1, video.duration - 0.05);
        const playhead = { time: 0 };

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 3.2}`,
            pin: frame,
            scrub: 0.18,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(
          playhead,
          {
            time: duration,
            duration: 1,
            onUpdate: () => {
              if (Math.abs(video.currentTime - playhead.time) > 0.025) {
                video.currentTime = playhead.time;
              }
            },
          },
          0,
        );

        timeline
          .to(
            chapterItems[0],
            { autoAlpha: 0, y: 76, duration: 0.1, stagger: 0.012 },
            0.2,
          )
          .set(chapters[0], { autoAlpha: 0 }, 0.31)
          .set(chapters[1], { autoAlpha: 1, y: 0 }, 0.31)
          .fromTo(
            chapterItems[1],
            { autoAlpha: 0, y: -22 },
            { autoAlpha: 1, y: 0, duration: 0.09, stagger: 0.014 },
            0.31,
          )
          .to(
            chapterItems[1],
            { autoAlpha: 0, y: 70, duration: 0.1, stagger: 0.014 },
            0.56,
          )
          .set(chapters[1], { autoAlpha: 0 }, 0.67)
          .set(chapters[2], { autoAlpha: 1, y: 0 }, 0.67)
          .fromTo(
            chapterItems[2],
            { autoAlpha: 0, y: -22 },
            { autoAlpha: 1, y: 0, duration: 0.09, stagger: 0.014 },
            0.67,
          )
          .to(
            chapterItems[2],
            { autoAlpha: 0, y: 74, duration: 0.1, stagger: 0.014 },
            0.88,
          );
      };

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        createTimeline();
      } else {
        video.addEventListener("loadedmetadata", createTimeline, { once: true });
        removeMetadataListener = () =>
          video.removeEventListener("loadedmetadata", createTimeline);
      }
    }, section);

    return () => {
      removeMetadataListener?.();
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="scroll-film" id="top">
      <div ref={frameRef} className="film-frame">
        <video
          ref={videoRef}
          className="film-video"
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

        <div className="film-scrim" aria-hidden="true" />

        <div className="film-copy-shell">
          <div className="film-copy" data-film-chapter>
            <p className="hero-label">Independent technology company</p>
            <h1>Engineering Tomorrow&apos;s Intelligent Businesses.</h1>
            <p className="hero-body">
              We build intelligent software, AI systems, and enterprise
              platforms that help ambitious businesses automate, innovate,
              and scale.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#start-project">
                Start a Project
              </a>
              <a className="button button-secondary" href="#products">
                Explore our products
              </a>
            </div>
          </div>

          <div className="film-copy" data-film-chapter>
            <h2>From intent to a working system.</h2>
            <p>
              Business context, design judgment, and technical depth in one
              accountable team.
            </p>
          </div>

          <div className="film-copy" data-film-chapter>
            <h2>Intelligence, applied with purpose.</h2>
            <p>
              Useful innovation built around your operations, your people,
              and the future you are creating.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

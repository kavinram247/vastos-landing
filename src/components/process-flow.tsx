"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ProcessStep {
  name: string;
  detail: string;
  icon: string;
}

function ProcessIcon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      {name === "ear" && <><path {...common} d="M29 31c0 5-3 8-7 8-3 0-5-2-5-5 0-5 7-5 7-11 0-3-2-5-5-5-4 0-7 3-7 8"/><path {...common} d="M33 32c2-3 3-6 3-10 0-8-5-13-13-13-6 0-11 3-14 8"/><path className="icon-accent" {...common} d="M19 27c0-3 3-3 3-6 0-2-1-3-3-3"/></>}
      {name === "map" && <><path {...common} d="m7 13 11-4 12 4 11-4v26l-11 4-12-4-11 4Z"/><path {...common} d="M18 9v26M30 13v26"/><path className="icon-accent" {...common} d="M12 28c5-7 9-10 15-7 4 2 6 2 10-3"/><circle cx="12" cy="28" r="2" fill="currentColor"/><circle cx="37" cy="18" r="2" fill="currentColor"/></>}
      {name === "shape" && <><rect {...common} x="8" y="8" width="14" height="14" rx="2"/><rect {...common} x="26" y="8" width="14" height="14" rx="2"/><rect {...common} x="8" y="26" width="14" height="14" rx="2"/><path className="icon-accent" {...common} d="M27 33h12M33 27v12"/></>}
      {name === "build" && <><path {...common} d="m17 14-9 10 9 10M31 14l9 10-9 10"/><path className="icon-accent" {...common} d="m27 9-6 30"/><path {...common} d="M13 42h22"/></>}
      {name === "launch" && <><path {...common} d="M28 7c7 4 10 12 8 20l-9 9-15-15 9-9c2-2 4-4 7-5Z"/><circle {...common} cx="28" cy="16" r="3"/><path {...common} d="m14 23-6 3 7 3M25 34l-3 7-3-7"/><path className="icon-accent" {...common} d="M12 36 7 41M16 39l-2 3"/></>}
      {name === "evolve" && <><path {...common} d="M38 16A16 16 0 0 0 10 14"/><path {...common} d="m9 8 1 6 6-1M10 32a16 16 0 0 0 28 2"/><path {...common} d="m39 40-1-6-6 1"/><path className="icon-accent" {...common} d="m18 26 5 5 9-12"/></>}
    </svg>
  );
}

export function ProcessFlow({ steps }: { steps: ProcessStep[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-process-step]");
      const icons = gsap.utils.toArray<HTMLElement>("[data-process-icon]");
      const fill = root.querySelector<HTMLElement>("[data-process-fill]");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set(items, { opacity: 1 });
        gsap.set(fill, { scaleX: 1 });
        return;
      }

      gsap.set(items, { opacity: 0.24 });
      gsap.set(icons, { scale: 0.78, rotation: -12 });
      gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });

      const desktop = window.matchMedia("(min-width: 768px)").matches;
      if (desktop) {
        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * 3.6}`,
            pin: stage,
            scrub: 0.32,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        items.forEach((item, index) => {
          const at = index;
          timeline
            .to(fill, { scaleX: (index + 1) / items.length, duration: 0.42, ease: "none" }, at)
            .to(item, { opacity: 1, duration: 0.26 }, at + 0.08)
            .to(icons[index], { scale: 1.12, rotation: 0, duration: 0.2 }, at + 0.1)
            .to(icons[index], { scale: 1, duration: 0.2, ease: "back.out(2)" }, at + 0.3)
            .fromTo(item.querySelector(".icon-accent"), { strokeDasharray: 40, strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.3 }, at + 0.16);
        });
      } else {
        items.forEach((item, index) => {
          gsap.timeline({
            scrollTrigger: { trigger: item, start: "top 78%", end: "bottom 45%", scrub: 0.25 },
          })
            .to(fill, { scaleX: (index + 1) / items.length, duration: 1, ease: "none" }, 0)
            .to(item, { opacity: 1, duration: 0.5 }, 0)
            .to(icons[index], { scale: 1, rotation: 0, duration: 0.5 }, 0);
        });
      }
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="software-process" aria-labelledby="software-process-title">
      <div ref={stageRef} className="process-stage">
        <div className="process-intro">
          <p className="section-label">Tailored software</p>
          <h3 id="software-process-title">Built around how your business actually works.</h3>
          <p>Scroll through how we work beside your team—from first conversation to a system that keeps getting better.</p>
        </div>
        <div className="process-progress" aria-hidden="true"><span data-process-fill /></div>
        <ol className="process-rail">
          {steps.map((step, index) => (
            <li key={step.name} data-process-step>
              <span className="process-icon" data-process-icon><ProcessIcon name={step.icon} /></span>
              <span className="process-number">0{index + 1}</span>
              <h4>{step.name}</h4>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

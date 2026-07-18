"use client";

import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useState } from "react";

const solutions = [
  {
    name: "AI Solutions",
    description:
      "AI systems that automate work, improve decisions, and open new business opportunities.",
    highlights: ["Intelligence", "Automation", "Innovation"],
    image: "/images/solution-ai-v2.png",
    alt: "An AI orchestration workspace connecting reasoning, tools, and human review",
  },
  {
    name: "Business Automation",
    description:
      "Connected workflows that reduce manual effort and improve operational speed.",
    highlights: ["Workflows", "Efficiency", "Productivity"],
    image: "/images/solution-automation-v2.png",
    alt: "Manual business work flowing into a connected automated workflow",
  },
  {
    name: "Enterprise Solutions",
    description:
      "Secure, scalable platforms designed for the complexity of modern organizations.",
    highlights: ["Scalability", "Security", "Integration"],
    image: "/images/solution-enterprise-v2.png",
    alt: "A secure enterprise command center showing services, permissions, and governance",
  },
  {
    name: "Digital Transformation",
    description:
      "A practical path from fragmented operations to adaptable digital systems.",
    highlights: ["Modernization", "Agility", "Growth"],
    image: "/images/solution-transformation-v2.png",
    alt: "Fragmented legacy operations becoming a connected modern digital foundation",
  },
];

export function SolutionsExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSolution = solutions[activeIndex];

  return (
    <div className="solutions-explorer">
      <div className="solution-list" role="tablist" aria-label="VASTOS solutions">
        {solutions.map((solution, index) => (
          <button
            key={solution.name}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls="solution-panel"
            className="solution-trigger"
            data-active={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <span>{solution.name}</span>
            <ArrowUpRight size={20} weight="regular" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div
        id="solution-panel"
        role="tabpanel"
        className="solution-panel"
        aria-live="polite"
      >
        <div className="solution-image">
          <Image
            key={activeSolution.image}
            src={activeSolution.image}
            alt={activeSolution.alt}
            fill
            sizes="(max-width: 767px) 100vw, 58vw"
          />
        </div>
        <div className="solution-panel-copy">
          <h3>{activeSolution.name}</h3>
          <p>{activeSolution.description}</p>
          <ul aria-label={`${activeSolution.name} highlights`}>
            {activeSolution.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

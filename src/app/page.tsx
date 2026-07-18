import Image from "next/image";
import { ProjectForm } from "@/components/project-form";
import { ProductShowcase } from "@/components/product-showcase";
import { ProcessFlow } from "@/components/process-flow";
import { ScrollFilm } from "@/components/scroll-film";
import { SiteHeader } from "@/components/site-header";

const products = [
  {
    className: "product-arc",
    name: "VASTOS Arc",
    label: "Construction CRM",
    description:
      "An AI-powered CRM that helps businesses manage leads, automate sales, and build stronger customer relationships from one platform.",
    detail: "A single commercial command center for enquiries, opportunities, follow-ups, inventory, teams, and revenue forecasting—shaped around your actual sales process.",
    highlights: ["Automation", "Insights", "Engagement"],
    outcomes: ["Faster follow-up", "Clearer forecasting", "One customer view"],
    image: "/images/product-arc.png",
    alt: "Customer relationship networks flowing into a premium CRM pipeline and revenue dashboard",
  },
  {
    className: "product-studio",
    name: "VASTOS Studio",
    label: "AI Interior Design",
    description:
      "An AI-powered design platform for architects and designers to create, visualize, and collaborate with clarity.",
    detail: "Move from an early brief to material direction and photoreal spatial concepts in one collaborative environment built for faster, more confident design decisions.",
    highlights: ["Creativity", "Visualization", "Collaboration"],
    outcomes: ["Faster concepts", "Aligned decisions", "Realistic previews"],
    image: "/images/product-studio-v2.png",
    alt: "An AI interior design workspace transitioning furniture from emerald wireframe to a finished photoreal room",
  },
  {
    className: "product-engine",
    name: "VASTOS Engine",
    label: "Enterprise OS",
    description:
      "An intelligent business platform that connects operations, automates workflows, and improves organizational efficiency.",
    detail: "A composable operating layer that connects approvals, data, teams, and critical workflows without forcing your organization into someone else’s process.",
    highlights: ["Efficiency", "Intelligence", "Scalability"],
    outcomes: ["Connected operations", "Less manual work", "Scalable control"],
    image: "/images/product-engine.jpg",
    alt: "An abstract green wireframe system extending into depth",
  },
  {
    className: "product-care",
    name: "VASTOS Care",
    label: "Patient Management",
    description:
      "A secure patient management platform that connects appointments, clinical context, care teams, and patient engagement in one calm workspace.",
    detail: "A patient-centered workspace that makes appointments, records, care coordination, clinical context, and secure communication legible to every authorized team member.",
    highlights: ["Patient Records", "Care Coordination", "Clinical Insights"],
    outcomes: ["Continuity of care", "Calmer workflows", "Trusted context"],
    image: "/images/product-patient-v2.png",
    alt: "A premium dark patient management dashboard with care timelines, clinical trends, and appointments",
  },
];

const softwareProcess = [
  { name: "Listen", detail: "Understand your people, pressures, and goals.", icon: "ear" },
  { name: "Map", detail: "Make the real workflow and friction visible.", icon: "map" },
  { name: "Shape", detail: "Turn insight into a focused product direction.", icon: "shape" },
  { name: "Build", detail: "Engineer the system in close partnership.", icon: "build" },
  { name: "Launch", detail: "Release with confidence, training, and care.", icon: "launch" },
  { name: "Evolve", detail: "Learn from use and scale what creates value.", icon: "evolve" },
];

const capabilities = [
  "Custom Software",
  "AI Agents",
  "Custom AI Models",
  "Business Consulting",
  "Healthcare Technology",
  "Architecture Technology",
  "Unreal Engine",
  "Digital Transformation",
];

const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VASTOS",
  url: "https://vastos.ai",
  email: "team@vastos.in",
  description:
    "An independent technology company building intelligent software, AI systems, immersive experiences, and enterprise platforms.",
};

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <ScrollFilm />
        <section className="section products-section" id="products">
          <div className="section-shell">
            <div className="section-heading">
              <p className="section-label">Products</p>
              <h2>Products built for the way ambitious teams work.</h2>
              <p>Four focused platforms connect customer intelligence, creative production, automated operations, and connected care.</p>
            </div>
            <ProductShowcase products={products} />

            <ProcessFlow steps={softwareProcess} />
          </div>
        </section>
        <section className="section company-section" id="company">
          <div className="section-shell">
            <div className="company-statement">
              <h2>Intelligence, applied with purpose.</h2>
              <div className="company-body">
                <p>VASTOS brings business thinking, product design, AI engineering, software development, and immersive technology into one integrated practice.</p>
                <p>The result is a working system designed around your operations, your people, and the future you are building.</p>
              </div>
            </div>
            <ul className="capability-grid" aria-label="VASTOS capabilities">{capabilities.map((capability) => <li key={capability} tabIndex={0}>{capability}</li>)}</ul>
          </div>
        </section>
        <section className="section project-section" id="start-project">
          <div className="section-shell project-shell">
            <div className="project-intro">
              <p className="project-prompt">Have a consequential problem to solve?</p>
              <h2>Let&apos;s engineer what comes next.</h2>
              <p>Tell us what you are working toward. We will respond with a focused next step.</p>
              <a href="mailto:team@vastos.in">team@vastos.in</a>
            </div>
            <ProjectForm />
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-shell">
          <div><Image src="/brand/vastos-logo-new.svg" alt="VASTOS" width={670} height={574} loading="eager" className="footer-logo" /><p>Engineering tomorrow&apos;s intelligent businesses.</p></div>
          <nav aria-label="Footer navigation"><a href="#products">Products</a><a href="#company">Company</a><a href="#start-project">Contact</a></nav>
          <p className="copyright">© 2026 VASTOS. All rights reserved.</p>
        </div>
      </footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }} />
    </>
  );
}

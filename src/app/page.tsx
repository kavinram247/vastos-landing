import Image from "next/image";
import { Hero } from "@/components/hero";
import { ProcessFlow } from "@/components/process-flow";
import { ProductShowcase } from "@/components/product-showcase";
import { ProjectForm } from "@/components/project-form";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";

const products = [
  {
    className: "product-engine",
    name: "VASTOS Engine",
    label: "Interior visualisation",
    description:
      "An advanced interior platform built on Unreal Engine. Photorealistic spaces, precise materials, and real-time walkthroughs, all from a single floor plan.",
    detail:
      "Load a floor plan and Engine builds the space in Unreal. Swap materials, change lighting, and walk a client through the room in real time on a call or in a showroom.",
    tags: ["Unreal Engine", "Interior Design", "3D"],
    image: "/images/product-engine.jpg",
    alt: "A real-time interior walkthrough rendered from a floor plan",
  },
  {
    className: "product-arc",
    name: "VASTOS Arc",
    label: "Real estate CRM",
    description:
      "An end-to-end real estate and construction CRM. Manage leads, conversions, sales, and handovers in one place.",
    detail:
      "Arc tracks every lead from first enquiry to final handover. Plan new projects, brainstorm layouts, assign site teams, and see which sites and salespeople are actually converting.",
    tags: ["Real Estate", "Construction", "CRM"],
    image: "/images/product-arc.png",
    alt: "A real estate CRM pipeline showing leads, sales, and project handovers",
  },
  {
    className: "product-studio",
    name: "VASTOS Studio",
    label: "AI design studio",
    description:
      "AI-powered design and visualization studio. Upload a floor plan and get renders, layouts, and material options instantly.",
    detail:
      "Upload a floor plan and Studio returns furnished layouts, material options, and finished renders. Designers use it to put three or four directions in front of a client in an afternoon.",
    tags: ["AI Design", "Floor Plans", "Visualization"],
    image: "/images/product-studio-v2.png",
    alt: "An AI design studio turning a floor plan into furnished renders",
  },
];

const softwareProcess = [
  {
    name: "Scope",
    detail:
      "We sit with your team, watch how the work happens now, and write down what the software has to do.",
    icon: "ear",
  },
  {
    name: "Map",
    detail:
      "We document every form, approval, and handoff, then mark the ones costing you time.",
    icon: "map",
  },
  {
    name: "Design",
    detail:
      "We draw the screens and the data model, then check them with the people who will use them daily.",
    icon: "shape",
  },
  {
    name: "Build",
    detail:
      "We work in two-week blocks. At the end of each one you get working screens to click through.",
    icon: "build",
  },
  {
    name: "Launch",
    detail:
      "We move your existing data across, train your staff, and stay on call through the first weeks.",
    icon: "launch",
  },
  {
    name: "Support",
    detail:
      "We fix what breaks, build what you need next, and keep the system current.",
    icon: "evolve",
  },
];

const capabilities = [
  "Real Estate",
  "AI-based CRM",
  "Architecture",
  "Healthcare",
  "Manufacturing",
  "Retail",
];

const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VASTOS",
  url: "https://vastos.in",
  email: "team@vastos.in",
  description:
    "VASTOS builds software for real estate, design, and construction teams, including a CRM, an Unreal Engine visualisation platform, and an AI design studio.",
};

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <Hero />

        <section className="section products-section" id="products">
          <div className="section-shell">
            <Reveal className="section-heading">
              <p className="section-label">Products</p>
              <h2>Three platforms, built for how these teams actually work.</h2>
              <p>
                Each one solves a problem we kept seeing on client projects, so
                we built the tool instead of rebuilding the workaround.
              </p>
            </Reveal>

            <ProductShowcase products={products} />

            <ProcessFlow steps={softwareProcess} />
          </div>
        </section>

        <section className="section company-section" id="company">
          <div className="section-shell">
            <Reveal className="company-statement">
              <h2>We build for the trades we know.</h2>
              <div className="company-body">
                <p>
                  VASTOS writes software for real estate developers, interior
                  designers, architects, hospitals, and manufacturers. We take
                  on a small number of projects and stay with them.
                </p>
                <p>
                  Most of our work replaces spreadsheets, WhatsApp threads, and
                  paper forms with one system your team can actually use.
                </p>
              </div>
            </Reveal>

            <Reveal
              as="ul"
              className="capability-grid"
              delay={80}
            >
              {capabilities.map((capability) => (
                <li key={capability} tabIndex={0}>
                  {capability}
                </li>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section project-section" id="start-project">
          <div className="section-shell project-shell">
            <Reveal className="project-intro">
              <p className="project-prompt">Working on something?</p>
              <h2>Tell us what you need built.</h2>
              <p>
                Describe the problem and how your team handles it today. We
                reply within two working days with a concrete next step.
              </p>
              <a href="mailto:team@vastos.in">team@vastos.in</a>
            </Reveal>
            <ProjectForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-shell">
          <div>
            <Image
              src="/brand/vastos-logo-new.svg"
              alt="VASTOS"
              width={670}
              height={574}
              loading="eager"
              className="footer-logo"
            />
            <p>
              Software for real estate, design, and construction teams.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#products">Products</a>
            <a href="#company">Company</a>
            <a href="#start-project">Contact</a>
          </nav>
          <p className="copyright">© 2026 VASTOS. All rights reserved.</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
}

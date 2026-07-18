"use client";

import Image from "next/image";
import { List, X } from "@phosphor-icons/react";
import { useState } from "react";

const navigation = [
  { label: "Products", href: "#products" },
  { label: "Company", href: "#company" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <a className="brand-link" href="#top" aria-label="VASTOS home">
        <Image
          src="/brand/vastos-logo-new.svg"
          alt="VASTOS"
          width={670}
          height={574}
          loading="eager"
          className="brand-wordmark"
        />
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="#start-project">
        Start a Project
      </a>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X size={22} weight="regular" /> : <List size={22} weight="regular" />}
      </button>

      <div
        id="mobile-menu"
        className="mobile-menu"
        data-open={isOpen}
        aria-hidden={!isOpen}
      >
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="mobile-menu-cta" href="#start-project" onClick={closeMenu}>
            Start a Project
          </a>
        </nav>
      </div>
    </header>
  );
}

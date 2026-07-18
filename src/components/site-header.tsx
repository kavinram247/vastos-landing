"use client";

import Image from "next/image";
import { List, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Products", href: "#products" },
  { label: "Company", href: "#company" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    // The menu only exists below 768px, so a resize past that breakpoint has to
    // release the lock or the desktop layout is left unscrollable.
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen]);

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
        Start a project
      </a>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? (
          <X size={22} weight="regular" aria-hidden="true" />
        ) : (
          <List size={22} weight="regular" aria-hidden="true" />
        )}
      </button>

      <div
        id="mobile-menu"
        className="mobile-menu"
        data-open={isOpen}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a
            className="mobile-menu-cta"
            href="#start-project"
            onClick={closeMenu}
          >
            Start a project
          </a>
        </nav>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import { ArrowUpRight, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export interface Product {
  className: string;
  name: string;
  label: string;
  description: string;
  detail: string;
  tags: string[];
  image: string;
  alt: string;
}

export function ProductShowcase({ products }: { products: Product[] }) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!activeProduct) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveProduct(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeProduct]);

  return (
    <>
      <div className="product-grid">
        {products.map((product) => (
          <button
            key={product.name}
            type="button"
            className={`product-story ${product.className}`}
            onClick={() => setActiveProduct(product)}
            aria-label={`Open ${product.name} product details`}
          >
            <div className="product-image">
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="product-copy">
              <span className="product-type">{product.label}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <ul className="product-tags">
                {product.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <span className="product-explore">
                View product <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {activeProduct && (
        <div
          className="product-dialog-backdrop"
          role="presentation"
          onMouseDown={() => setActiveProduct(null)}
        >
          <section
            className="product-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="product-dialog-close"
              type="button"
              onClick={() => setActiveProduct(null)}
              autoFocus
              aria-label="Close product details"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <div className="product-dialog-visual">
              <Image
                src={activeProduct.image}
                alt={activeProduct.alt}
                fill
                sizes="(max-width: 767px) 100vw, 58vw"
                priority
              />
            </div>
            <div className="product-dialog-copy">
              <p className="product-dialog-label">{activeProduct.label}</p>
              <h2 id="product-dialog-title">{activeProduct.name}</h2>
              <p className="product-dialog-detail">{activeProduct.detail}</p>
              <ul className="product-tags product-dialog-tags">
                {activeProduct.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <a
                className="button button-primary product-dialog-cta"
                href="#start-project"
                onClick={() => setActiveProduct(null)}
              >
                Talk about this product{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

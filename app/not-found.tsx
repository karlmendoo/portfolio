import type { Metadata } from "next";
import { assetPath } from "@/lib/paths";
import { siteDetails } from "@/lib/personal-details";

export const metadata: Metadata = {
  title: { absolute: `404 — ${siteDetails.name}` },
  description:
    "This page could not be found. Return to Normand Karol Mendoza’s portfolio.",
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found-top">
        <a
          className="wordmark"
          href={assetPath("/")}
          aria-label="Normand Karol Mendoza, home"
        >
          nk<span>m.</span>
        </a>
        <span className="mono">PAGE NOT FOUND</span>
      </div>
      <div className="not-found-content">
        <h1>404</h1>
        <p className="not-found-heading">
          <em>A small detour.</em>
        </p>
        <p>
          There’s nothing at this address.
          <br />
          The next chapter is back home.
        </p>
        <a className="text-link external-link" href={assetPath("/")}>
          Return to portfolio{" "}
          <span className="external-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
      <div className="not-found-bottom mono">
        <span>{siteDetails.name}</span>
        <span>LET’S FIND OUR WAY BACK</span>
      </div>
    </main>
  );
}

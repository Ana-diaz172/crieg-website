"use client";
import { usePathname } from "next/navigation";
import Script from "next/script";

const BLOCKED = [
  /^\/membership(\/|$)/,
  /^\/checkout(\/|$)/,
  /^\/success$/,
  /^\/invoice$/,
];

export default function HubspotTracker() {
  const pathname = usePathname() || "/";
  const blocked = BLOCKED.some((rx) => rx.test(pathname));
  if (blocked) return null;

  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;

  return (
    <>
      {/* tracking principal */}
      <Script
        id="hs-script-loader"
        src={`https://js.hs-scripts.com/${portalId}.js`}
        strategy="afterInteractive"
      />
    </>
  );
}

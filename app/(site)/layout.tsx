import { ClerkProvider } from "@clerk/nextjs";
import { SiteHeader } from "../components/site-header";

/*
  Site layout — the public-facing nexLearn app chrome.
  Wraps every marketing/learning route in Clerk + the shared header.
  The Sanity Studio at /studio lives outside this group and gets none of it.
*/

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <SiteHeader />
      {children}
    </ClerkProvider>
  );
}

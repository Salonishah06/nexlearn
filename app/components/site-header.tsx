import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { NexLearnMark } from "./logo";
import { Button } from "./button";
import { BellIcon } from "./icons";

/*
  Site header — shared across all pages.
  Full-bleed, bottom-bordered, sticky. Logo · nav · bell + auth controls.
*/

const links = [
  { label: "Courses", href: "/courses" },
  { label: "My Learning", href: "/my-learning" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:gap-10 sm:px-6 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <NexLearnMark size={26} />
          <span className="hidden font-display text-heading-3 font-bold text-neutral-900 min-[400px]:inline">
            nexLearn
          </span>
        </Link>
        <nav className="flex min-w-0 items-center gap-3 sm:gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 text-body font-medium text-neutral-700 transition-colors hover:text-neutral-900 sm:text-body-lg"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-md p-1 text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <BellIcon size={22} />
          </button>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="text" size="md" className="h-9 text-body">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="primary" size="md" className="h-9 text-body">
                Sign up
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{ elements: { avatarBox: "h-9 w-9" } }}
            />
          </Show>
        </div>
      </div>
    </header>
  );
}

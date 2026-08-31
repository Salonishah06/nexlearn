import type { ReactNode } from "react";
import { VertexMark } from "./components/logo";
import { Button } from "./components/button";
import { SearchInput, Select } from "./components/input";
import { Badge } from "./components/badge";
import { StatusIndicator } from "./components/status";
import { ProgressBar } from "./components/progress";
import {
  CourseCard,
  LessonVideoCard,
  LessonCard,
  ResourceCard,
} from "./components/card";
import { NavBar, Breadcrumbs, Pagination } from "./components/navigation";
import {
  BellIcon,
  SearchIcon,
  PlayCircleIcon,
  FileTextIcon,
  BookmarkIcon,
  BarChartIcon,
  ClockIcon,
  UserIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
  PlayCircleSolid,
  BellSolid,
  SearchSolid,
  FileTextSolid,
  BookmarkSolid,
  BarChartSolid,
  ClockSolid,
  UserSolid,
  EyeIcon,
  GridIcon,
  TargetIcon,
  AccessibilityIcon,
} from "./components/icons";

/* ------------------------------------------------------------------ */
/* Layout primitives for the specimen                                  */
/* ------------------------------------------------------------------ */

function Panel({
  index,
  title,
  children,
  className = "",
}: {
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-neutral-200 bg-surface p-6 shadow-sm ${className}`}
    >
      <header className="mb-5 flex items-center gap-2">
        <span className="text-small font-semibold text-primary-500">
          {index}
        </span>
        <h2 className="text-small font-semibold uppercase tracking-[0.14em] text-neutral-700">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

function Swatch({
  name,
  hex,
  border = false,
}: {
  name: string;
  hex: string;
  border?: boolean;
}) {
  return (
    <div>
      <div
        className={`h-16 w-full rounded-sm ${border ? "border border-neutral-200" : ""}`}
        style={{ background: hex }}
      />
      <p className="mt-2 text-small font-medium text-neutral-900">{name}</p>
      <p className="text-small text-neutral-500">{hex}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const primary = [
  ["Primary 500", "#F97316"],
  ["Primary 400", "#FB923C"],
  ["Primary 300", "#FDBA74"],
  ["Primary 200", "#FED7AA"],
  ["Primary 100", "#FFEEE5"],
];

const neutral = [
  ["Neutral 900", "#0F172A"],
  ["Neutral 700", "#334155"],
  ["Neutral 500", "#64748B"],
  ["Neutral 300", "#CBD5E1"],
  ["Neutral 200", "#E2E8F0"],
  ["Neutral 100", "#F1F5F9"],
  ["Neutral 50", "#FAFAFC"],
  ["White", "#FFFFFF"],
];

const typeScale = [
  ["Display 1", "Playfair Display", "48 / 56", "Bold", "Page titles"],
  ["Display 2", "Playfair Display", "36 / 44", "Bold", "Section titles"],
  ["Heading 1", "Inter", "28 / 36", "Semi Bold", "Card titles"],
  ["Heading 2", "Inter", "22 / 30", "Semi Bold", "Sub section"],
  ["Heading 3", "Inter", "18 / 26", "Medium", "Small titles"],
  ["Body Large", "Inter", "16 / 24", "Regular", "Body copy"],
  ["Body", "Inter", "14 / 20", "Regular", "Supporting text"],
  ["Small", "Inter", "12 / 16", "Regular", "Captions, meta"],
];

const spacing = [
  [4, "0.25rem"],
  [8, "0.5rem"],
  [12, "0.75rem"],
  [16, "1rem"],
  [24, "1.5rem"],
  [32, "2rem"],
  [40, "2.5rem"],
  [48, "3rem"],
  [64, "4rem"],
] as const;

const radii = [
  ["4px", "xs"],
  ["8px", "sm"],
  ["12px", "md"],
  ["16px", "lg"],
  ["24px", "xl"],
  ["Full", "circle"],
];

const shadows = [
  ["Sm", "0 1px 2px 0 rgba(15, 23, 42, 0.05)", "shadow-sm"],
  ["Md", "0 4px 12px -2px rgba(15, 23, 42, 0.08)", "shadow-md"],
  ["Lg", "0 12px 24px -4px rgba(15, 23, 42, 0.10)", "shadow-lg"],
  ["Xl", "0 20px 40px -8px rgba(15, 23, 42, 0.12)", "shadow-xl"],
];

const outlineIcons = [
  BellIcon,
  SearchIcon,
  PlayCircleIcon,
  FileTextIcon,
  BookmarkIcon,
  BarChartIcon,
  ClockIcon,
  UserIcon,
  ChevronRightIcon,
];

const filledIcons = [
  BellSolid,
  SearchSolid,
  PlayCircleSolid,
  FileTextSolid,
  BookmarkSolid,
  BarChartSolid,
  ClockSolid,
  UserSolid,
  ChevronRightIcon,
];

const principles = [
  [EyeIcon, "Clarity First", "Every element should communicate clearly."],
  [GridIcon, "Consistency", "Use components and patterns consistently across the platform."],
  [TargetIcon, "Focus & Calm", "Remove noise and help learners focus on what matters."],
  [AccessibilityIcon, "Accessible", "Design with accessibility and inclusivity in mind."],
] as const;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 py-10">
      {/* Masthead + Colors */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-lg border border-neutral-200 bg-surface p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <VertexMark size={36} />
            <span className="font-display text-heading-2 font-bold text-neutral-900">
              Vertex
            </span>
          </div>
          <h1 className="mt-6 font-display text-display-1 font-bold tracking-tight text-neutral-900">
            Design System
          </h1>
          <p className="mt-4 max-w-sm text-body-lg text-neutral-500">
            A unified design language for the Vertex learning platform. Clean,
            modern and focused on clarity, consistency and intuitive learning
            experiences.
          </p>
          <p className="mt-8 text-small font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Version 1.0 · May 2025
          </p>
        </section>

        <Panel index="01" title="Colors">
          <p className="mb-3 text-body font-medium text-neutral-700">Primary</p>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {primary.map(([name, hex]) => (
              <Swatch key={name} name={name} hex={hex} />
            ))}
          </div>
          <p className="mb-3 mt-6 text-body font-medium text-neutral-700">
            Neutral
          </p>
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
            {neutral.map(([name, hex]) => (
              <Swatch
                key={name}
                name={name}
                hex={hex}
                border={name === "White" || name === "Neutral 50"}
              />
            ))}
          </div>
        </Panel>
      </div>

      {/* Typography + Type scale */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel index="02" title="Typography">
          <div className="space-y-6">
            <div className="flex items-baseline gap-6">
              <span className="font-display text-[64px] leading-none font-bold text-neutral-900">
                Ag
              </span>
              <div>
                <p className="text-heading-3 font-semibold text-neutral-900">
                  Playfair Display
                </p>
                <p className="text-body text-neutral-500">
                  Elegant · Readable · Timeless
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-6">
              <span className="text-[64px] leading-none font-bold text-neutral-900">
                Ag
              </span>
              <div>
                <p className="text-heading-3 font-semibold text-neutral-900">
                  Inter
                </p>
                <p className="text-body text-neutral-500">
                  Clean · Modern · Highly legible
                </p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel index="03" title="Type Scale">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body">
              <thead className="text-small uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="pb-2 font-medium">Style</th>
                  <th className="pb-2 font-medium">Font</th>
                  <th className="pb-2 font-medium">Size / Line</th>
                  <th className="pb-2 font-medium">Weight</th>
                  <th className="pb-2 font-medium">Use</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                {typeScale.map(([style, font, size, weight, use]) => (
                  <tr key={style} className="border-t border-neutral-100">
                    <td className="py-2 font-medium text-neutral-900">
                      {style}
                    </td>
                    <td className="py-2">{font}</td>
                    <td className="py-2 tabular-nums">{size}</td>
                    <td className="py-2">{weight}</td>
                    <td className="py-2 text-neutral-500">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* Spacing + Radius & Shadows */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel index="04" title="Spacing System">
          <p className="mb-4 text-body text-neutral-700">Base unit: 4px</p>
          <div className="flex flex-wrap items-end gap-4">
            {spacing.map(([px, rem]) => (
              <div key={px} className="text-center">
                <div
                  className="mx-auto rounded-xs bg-primary-200"
                  style={{ width: px, height: px }}
                />
                <p className="mt-2 text-small font-medium text-neutral-900">
                  {px}
                </p>
                <p className="text-small text-neutral-500">{rem}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel index="05" title="Radius & Shadows">
          <p className="mb-3 text-body font-medium text-neutral-700">Radius</p>
          <div className="flex flex-wrap gap-4">
            {radii.map(([label, alias]) => (
              <div key={label} className="text-center">
                <div
                  className="h-14 w-14 border border-neutral-300 bg-neutral-50"
                  style={{ borderRadius: label === "Full" ? "9999px" : label }}
                />
                <p className="mt-2 text-small font-medium text-neutral-900">
                  {label}
                </p>
                <p className="text-small text-neutral-500">{alias}</p>
              </div>
            ))}
          </div>
          <p className="mb-3 mt-6 text-body font-medium text-neutral-700">
            Shadows
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {shadows.map(([name, spec, cls]) => (
              <div
                key={name}
                className={`rounded-md border border-neutral-100 bg-surface p-3 ${cls}`}
              >
                <p className="text-body font-semibold text-neutral-900">
                  {name}
                </p>
                <p className="mt-1 text-small leading-4 text-neutral-500">
                  {spec}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Icons + Buttons + Inputs */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel index="06" title="Icons">
          <p className="mb-3 text-body font-medium text-neutral-700">
            Outline Style
          </p>
          <div className="flex flex-wrap gap-4 text-neutral-700">
            {outlineIcons.map((Icon, i) => (
              <Icon key={i} size={22} />
            ))}
          </div>
          <p className="mb-3 mt-6 text-body font-medium text-neutral-700">
            Filled Style
          </p>
          <div className="flex flex-wrap gap-4 text-neutral-900">
            {filledIcons.map((Icon, i) => (
              <Icon key={i} size={22} />
            ))}
          </div>
          <ul className="mt-6 space-y-1 text-body text-neutral-500">
            <li>• 24×24px grid</li>
            <li>• 2px stroke width (outline)</li>
            <li>• Rounded line caps</li>
            <li>• Consistent optical balance</li>
          </ul>
        </Panel>

        <Panel index="07" title="Buttons">
          <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-4 gap-y-3">
            <span />
            <span className="text-small font-medium text-neutral-500">
              Primary
            </span>
            <span className="text-small font-medium text-neutral-500">
              Secondary
            </span>

            <span className="text-small text-neutral-500">Default</span>
            <Button variant="primary">Get Started</Button>
            <Button variant="secondary">Explore Courses</Button>

            <span className="text-small text-neutral-500">Hover</span>
            <Button variant="primary" className="bg-primary-400">
              Get Started
            </Button>
            <Button variant="secondary" className="bg-primary-100">
              Explore Courses
            </Button>

            <span className="text-small text-neutral-500">Disabled</span>
            <Button variant="primary" disabled>
              Get Started
            </Button>
            <Button variant="secondary" disabled>
              Explore Courses
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="tertiary" iconRight={<ArrowUpRightIcon size={16} />}>
              View Lesson
            </Button>
            <Button variant="text" iconRight={<PlayCircleSolid size={16} />}>
              Watch Video
            </Button>
          </div>

          <ul className="mt-6 space-y-1 text-body text-neutral-500">
            <li>• Height: 44px (default)</li>
            <li>• Padding: 0 16px (lg) / 0 12px (md)</li>
            <li>• Radius: 12px</li>
            <li>• Font: Inter Medium (14–16px)</li>
          </ul>
        </Panel>

        <Panel index="08" title="Inputs">
          <p className="mb-2 text-body font-medium text-neutral-700">
            Search / Text Input
          </p>
          <SearchInput />
          <p className="mb-2 mt-5 text-body font-medium text-neutral-700">
            Select
          </p>
          <Select
            defaultValue="relevant"
            options={[
              { label: "Most Relevant", value: "relevant" },
              { label: "Newest", value: "newest" },
              { label: "Most Popular", value: "popular" },
            ]}
          />
          <ul className="mt-6 space-y-1 text-body text-neutral-500">
            <li>• Height: 44px</li>
            <li>• Radius: 12px</li>
            <li>• Border: 1px solid #E2E8F0</li>
            <li>• Padding: 0 16px</li>
            <li>• Focus: Border color #FB923C</li>
          </ul>
        </Panel>
      </div>

      {/* Badges + Status + Progress */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel index="09" title="Badges / Tags">
          <div className="flex flex-wrap items-start gap-8">
            <div>
              <p className="mb-2 text-small text-neutral-500">Video</p>
              <Badge variant="video">Video</Badge>
            </div>
            <div>
              <p className="mb-2 text-small text-neutral-500">Lesson</p>
              <Badge variant="lesson">Lesson</Badge>
            </div>
            <div>
              <p className="mb-2 text-small text-neutral-500">Popular</p>
              <Badge variant="popular">Popular</Badge>
            </div>
          </div>
        </Panel>

        <Panel index="10" title="Status / Indicators">
          <div className="flex flex-col gap-3">
            <StatusIndicator status="in-progress" />
            <StatusIndicator status="completed" />
            <StatusIndicator status="now-playing" />
            <StatusIndicator status="locked" />
          </div>
        </Panel>

        <Panel index="11" title="Progress Bar">
          <ProgressBar value={35} />
          <div className="mt-4">
            <ProgressBar value={72} />
          </div>
        </Panel>
      </div>

      {/* Cards */}
      <div className="mt-6">
        <Panel index="12" title="Cards">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="mb-2 text-small text-neutral-500">Course Card</p>
              <CourseCard />
            </div>
            <div>
              <p className="mb-2 text-small text-neutral-500">
                Lesson Card (Video)
              </p>
              <LessonVideoCard />
            </div>
            <div>
              <p className="mb-2 text-small text-neutral-500">
                Lesson Card (Lesson)
              </p>
              <LessonCard />
            </div>
            <div>
              <p className="mb-2 text-small text-neutral-500">Resource Card</p>
              <ResourceCard />
            </div>
          </div>
        </Panel>
      </div>

      {/* Navigation */}
      <div className="mt-6">
        <Panel index="13" title="Navigation">
          <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto]">
            <NavBar />
            <div>
              <p className="mb-2 text-small text-neutral-500">Breadcrumbs</p>
              <Breadcrumbs
                items={[
                  "All Courses",
                  "Next.js for Production",
                  "Data Fetching & Caching",
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-small text-neutral-500">Pagination</p>
              <Pagination />
            </div>
          </div>
        </Panel>
      </div>

      {/* Principles */}
      <div className="mt-6">
        <Panel index="14" title="Principles">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(([Icon, title, body]) => (
              <div key={title} className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-primary-500">
                  <Icon size={22} />
                </span>
                <div>
                  <p className="text-body-lg font-semibold text-neutral-900">
                    {title}
                  </p>
                  <p className="mt-1 text-body text-neutral-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <footer className="mt-10 text-center text-small text-neutral-500">
        Vertex Design System · v1.0
      </footer>
    </main>
  );
}

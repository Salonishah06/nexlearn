import {
  LayersIcon,
  WorkflowIcon,
  GaugeIcon,
  RocketIcon,
  PuzzleIcon,
  ShieldIcon,
  SparklesIcon,
  CodeIcon,
  TargetIcon,
} from "./icons";

/*
  Maps a `learningOutcome.icon` key (authored in Sanity) to an icon component.
  Unknown / missing keys fall back to a neutral target icon so the layout never
  breaks on new content.
*/

const MAP: Record<string, typeof TargetIcon> = {
  layers: LayersIcon,
  workflow: WorkflowIcon,
  gauge: GaugeIcon,
  rocket: RocketIcon,
  puzzle: PuzzleIcon,
  shield: ShieldIcon,
  sparkles: SparklesIcon,
  code: CodeIcon,
};

export function LearningOutcomeIcon({
  name,
  size = 28,
  className,
}: {
  name: string | null | undefined;
  size?: number;
  className?: string;
}) {
  const Icon = (name && MAP[name]) || TargetIcon;
  return <Icon size={size} className={className} />;
}

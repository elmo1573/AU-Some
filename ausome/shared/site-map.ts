export const HUB_ROUTES = {
  home: "/",
  games: "/games",
  connect: "/connect",
  assistant: "/assistant",
} as const;

export type GameModuleId = "focus" | "math" | "language" | "sensory";

export type GameModule = {
  id: GameModuleId;
  folder: string;
  label: string;
  base: string;
  port: number;
  gamesDomain: string;
};

export const GAME_MODULES: GameModule[] = [
  {
    id: "focus",
    folder: "focus_module",
    label: "Focus & Memory",
    base: "/play/focus",
    port: 3001,
    gamesDomain: "focus",
  },
  {
    id: "math",
    folder: "math_module",
    label: "Math",
    base: "/play/math",
    port: 3002,
    gamesDomain: "math",
  },
  {
    id: "language",
    folder: "langauge_module",
    label: "Language",
    base: "/play/language",
    port: 3003,
    gamesDomain: "language",
  },
  {
    id: "sensory",
    folder: "sensory_module",
    label: "Sensorial",
    base: "/play/sensory",
    port: 3004,
    gamesDomain: "sensorial",
  },
];

export function playUrl(id: GameModuleId): string {
  const mod = GAME_MODULES.find((m) => m.id === id);
  return mod ? `${mod.base}/` : HUB_ROUTES.games;
}

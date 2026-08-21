import {
  ChefHat,
  DoorOpen,
  Grid3x3,
  Hammer,
  Home,
  Lightbulb,
  Paintbrush,
  Wrench,
} from "lucide-react";

const TILES = [
  { icon: Hammer, tone: "from-ink to-ink/70" },
  { icon: Wrench, tone: "from-brand to-brand/70" },
  { icon: DoorOpen, tone: "from-[#5b5148] to-[#5b5148]/70" },
  { icon: ChefHat, tone: "from-[#3f4a4a] to-[#3f4a4a]/70" },
  { icon: Grid3x3, tone: "from-brand-soft to-brand/40" },
  { icon: Paintbrush, tone: "from-ink/80 to-ink/50" },
  { icon: Home, tone: "from-[#6b6156] to-[#6b6156]/70" },
  { icon: Lightbulb, tone: "from-brand to-[#b6884f]" },
];

export function GalleryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TILES.map((tile, i) => (
        <div
          key={i}
          className={`group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${tile.tone}`}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_16px)]" />
          <tile.icon className="absolute inset-0 m-auto size-8 text-paper/25 transition-transform duration-300 group-hover:scale-110" />
        </div>
      ))}
    </div>
  );
}

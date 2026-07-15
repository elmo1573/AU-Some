type HubLinkBarProps = {
  className?: string;
};

export default function HubLinkBar({ className = "" }: HubLinkBarProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <a
        href="/"
        className="px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-current opacity-80 hover:opacity-100 transition-opacity"
      >
        Home
      </a>
      <a
        href="/games"
        className="px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-current opacity-80 hover:opacity-100 transition-opacity"
      >
        Games
      </a>
    </div>
  );
}

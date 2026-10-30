export function PizzaArt({ className = '', rotation = 0 }: { className?: string; rotation?: number }) {
  return (
    <div
      className={`relative aspect-square ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <div className="absolute inset-[3%] rounded-full bg-[#E9C288] shadow-inner" />
      <div className="absolute inset-[10%] rounded-full bg-[#E2A93F]" />
      <div className="absolute left-[25%] top-[30%] h-[9%] w-[9%] rounded-full bg-tomato shadow-sm" />
      <div className="absolute right-[27%] top-[24%] h-[8%] w-[8%] rounded-full bg-tomato shadow-sm" />
      <div className="absolute bottom-[30%] left-[33%] h-[8%] w-[8%] rounded-full bg-tomato shadow-sm" />
      <div className="absolute bottom-[25%] right-[29%] h-[7%] w-[7%] rounded-full bg-tomato shadow-sm" />
      <div className="absolute left-[47%] top-[45%] h-[6%] w-[6%] rotate-12 rounded-[2px] bg-basil/80" />
      <div className="absolute left-[21%] top-[52%] h-[5%] w-[5%] rotate-45 rounded-[1px] bg-basil/70" />
      <div className="absolute right-[21%] top-[47%] h-[5%] w-[5%] -rotate-12 rounded-[1px] bg-basil/70" />
      <div className="absolute left-[40%] top-[66%] h-[4%] w-[4%] rounded-full bg-[#F8E3B8]/70" />
    </div>
  )
}

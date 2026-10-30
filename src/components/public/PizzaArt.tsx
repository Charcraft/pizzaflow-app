export function PizzaArt({
  className = '',
  rotation = 0,
  variant = 0,
}: {
  className?: string
  rotation?: number
  variant?: number
}) {
  return (
    <div
      className={`relative aspect-square ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <div className="absolute inset-[3%] rounded-full bg-[#EBC98F] shadow-inner" />
      <div className="absolute inset-[10%] rounded-full bg-[#EFB84B]" />
      <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#F8D27C_0,transparent_45%)]" />

      {variant === 1 ? (
        <>
          <span className="absolute left-[24%] top-[26%] h-[11%] w-[11%] rounded-full border-2 border-[#B91C1C] bg-[#D62828]" />
          <span className="absolute right-[24%] top-[22%] h-[10%] w-[10%] rounded-full border-2 border-[#B91C1C] bg-[#D62828]" />
          <span className="absolute left-[43%] top-[42%] h-[11%] w-[11%] rounded-full border-2 border-[#B91C1C] bg-[#D62828]" />
          <span className="absolute bottom-[26%] left-[27%] h-[10%] w-[10%] rounded-full border-2 border-[#B91C1C] bg-[#D62828]" />
          <span className="absolute bottom-[22%] right-[25%] h-[11%] w-[11%] rounded-full border-2 border-[#B91C1C] bg-[#D62828]" />
          <span className="absolute left-[27%] top-[52%] h-[8%] w-[8%] rounded-full border-2 border-[#B91C1C] bg-[#D62828]" />
          <span className="absolute right-[31%] top-[52%] h-[8%] w-[8%] rounded-full border-2 border-[#B91C1C] bg-[#D62828]" />
        </>
      ) : variant === 2 ? (
        <>
          <span className="absolute left-[26%] top-[28%] h-[10%] w-[10%] rotate-12 rounded-[2px] bg-[#FDE68A]" />
          <span className="absolute right-[24%] top-[24%] h-[9%] w-[9%] -rotate-12 rounded-[2px] bg-[#FDE68A]" />
          <span className="absolute bottom-[28%] left-[30%] h-[9%] w-[9%] rotate-45 rounded-[2px] bg-[#FDE68A]" />
          <span className="absolute bottom-[24%] right-[28%] h-[10%] w-[10%] -rotate-6 rounded-[2px] bg-[#FDE68A]" />
          <span className="absolute left-[45%] top-[46%] h-[10%] w-[10%] rounded-full border-2 border-[#C2410C] bg-[#FCA5A5]" />
          <span className="absolute left-[22%] top-[50%] h-[8%] w-[8%] rounded-full border-2 border-[#C2410C] bg-[#FCA5A5]" />
          <span className="absolute right-[22%] top-[48%] h-[8%] w-[8%] rounded-full border-2 border-[#C2410C] bg-[#FCA5A5]" />
        </>
      ) : variant === 3 ? (
        <>
          <span className="absolute left-[24%] top-[28%] h-[13%] w-[13%] rounded-full bg-[#FFF7ED] shadow-sm" />
          <span className="absolute right-[24%] top-[24%] h-[11%] w-[11%] rounded-full bg-[#FFF7ED] shadow-sm" />
          <span className="absolute bottom-[28%] left-[30%] h-[12%] w-[12%] rounded-full bg-[#FFF7ED] shadow-sm" />
          <span className="absolute bottom-[24%] right-[26%] h-[13%] w-[13%] rounded-full bg-[#FFF7ED] shadow-sm" />
          <span className="absolute left-[46%] top-[45%] h-[9%] w-[9%] rounded-full bg-[#FEF3C7] shadow-sm" />
          <span className="absolute left-[42%] top-[68%] h-[5%] w-[5%] rotate-45 rounded-[1px] bg-basil/80" />
          <span className="absolute right-[20%] top-[48%] h-[5%] w-[5%] -rotate-12 rounded-[1px] bg-basil/80" />
        </>
      ) : (
        <>
          <span className="absolute left-[25%] top-[30%] h-[9%] w-[9%] rounded-full bg-[#D62828] shadow-sm" />
          <span className="absolute right-[27%] top-[24%] h-[8%] w-[8%] rounded-full bg-[#D62828] shadow-sm" />
          <span className="absolute bottom-[30%] left-[33%] h-[8%] w-[8%] rounded-full bg-[#D62828] shadow-sm" />
          <span className="absolute bottom-[25%] right-[29%] h-[7%] w-[7%] rounded-full bg-[#D62828] shadow-sm" />
          <span className="absolute left-[47%] top-[45%] h-[6%] w-[6%] rotate-12 rounded-[2px] bg-basil/80" />
          <span className="absolute left-[21%] top-[52%] h-[5%] w-[5%] rotate-45 rounded-[1px] bg-basil/70" />
          <span className="absolute right-[21%] top-[47%] h-[5%] w-[5%] -rotate-12 rounded-[1px] bg-basil/70" />
          <span className="absolute left-[40%] top-[66%] h-[4%] w-[4%] rounded-full bg-[#F8E3B8]/70" />
        </>
      )}
    </div>
  )
}

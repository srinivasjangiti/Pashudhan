import { Typewriter } from "@/components/ui/typewriter"

const CritterTypewriter = () => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-8 mb-10 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto font-body leading-relaxed font-medium">
        <span>AI-powered breed identification for </span>
        <Typewriter
          text={[
            "Indian cattle and buffalo breeds",
            "livestock conservation",
            "modern animal husbandry",
            "sustainable farming practices",
            "the Bharat Pashudhan ecosystem"
          ]}
          speed={60}
          className="text-emerald-600 font-semibold"
          waitTime={2000}
          deleteSpeed={35}
          cursorChar="|"
          cursorClassName="text-emerald-500"
        />
      </div>
    </div>
  )
}

export { CritterTypewriter }

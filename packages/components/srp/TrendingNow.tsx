import { ChevronRight } from "lucide-react"

function TrendingNow() {
  return (
    <div className="sm:ml-10 ml-4 mt-10 flex items-center gap-6">
        <h3 className="sm:block hidden text-xl font-bold text-zinc-900">Trending Now</h3>
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
			<TrendingChip label="Kicks" />
			<TrendingChip label="3rd Row" />
			<TrendingChip label="SUV's" />
		</div>
	</div>
  )
}

export default TrendingNow;


const TrendingChip = ({ label }: { label: string }) => {
	return (
		<div className="flex items-center gap-1 bg-white rounded-full px-4 py-0.5">
			<p className="text-zinc-900 font-semibold">
				{label}
			</p>
			<span>
				<ChevronRight className="h-3.5 w-3.5" />
			</span>
		</div>
	)
}
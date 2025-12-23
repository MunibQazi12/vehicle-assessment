const pulse = "animate-pulse bg-zinc-200 rounded";

export default function VDPLoading() {
	return (
		<main className='min-h-screen bg-white'>
			<section className='bg-[#FFD700]'>
				<div className='container mx-auto flex flex-nowrap items-center gap-3 overflow-x-auto px-4 py-4'>
					<div className={`${pulse} h-12 w-32 rounded-full bg-white/80`} />
					<div className='flex flex-nowrap items-center gap-3'>
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
								className={`${pulse} h-10 w-28 rounded-full bg-white/80`}
							/>
						))}
					</div>
					<div className='ml-auto flex items-center gap-3'>
						{Array.from({ length: 2 }).map((_, index) => (
							<div
								key={index}
								className={`${pulse} h-10 w-28 rounded-full bg-white/80`}
							/>
						))}
					</div>
				</div>
			</section>

			<section className='container mx-auto space-y-6 px-4 pb-10 pt-6'>
				<div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_416px] 2xl:grid-cols-[minmax(0,1fr)_520px]'>
					<div className='rounded-[36px] bg-white p-2 shadow-[0_25px_80px_rgba(15,23,42,0.12)]'>
						<div className={`${pulse} aspect-[9/6.6] w-full rounded-[30px]`} />
					</div>

					<div className='lg:row-span-2 xl:h-full'>
						<div className='space-y-6 rounded-[36px] border border-zinc-100 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.15)]'>
							<div className='space-y-2'>
								<div className={`${pulse} h-6 w-3/4`} />
								<div className={`${pulse} h-4 w-1/2`} />
							</div>

							<div className='space-y-4 rounded-[28px] border border-zinc-100 bg-zinc-50/80 p-5'>
								{[
									["Sale price", "60%"],
									["Retail price", "45%"],
									["Discount", "40%"],
									["Payment", "30%"],
								].map(([label, width]) => (
									<div
										key={label}
										className='flex items-center justify-between gap-4'
									>
										<div className={`${pulse} h-4 w-28`} />
										<div
											className={`${pulse} h-6`}
											style={{ width }}
										/>
									</div>
								))}
							</div>

							<div className='space-y-3'>
								{Array.from({ length: 3 }).map((_, index) => (
									<div
										key={index}
										className={`${pulse} h-12 w-full rounded-2xl`}
									/>
								))}
							</div>

							<div className='space-y-4 border-t border-dashed border-zinc-200 pt-4'>
								<div className={`${pulse} h-4 w-32`} />
								<div className='space-y-2'>
									{[180, 140, 160].map((width) => (
										<div
											key={width}
											className={`${pulse} h-4`}
											style={{ width }}
										/>
									))}
								</div>
							</div>

							<div className='space-y-4 rounded-[28px] border border-zinc-100 bg-zinc-50/80 p-5'>
								<div className='grid gap-3 sm:grid-cols-2'>
									{Array.from({ length: 4 }).map((_, index) => (
										<div
											key={index}
											className={`${pulse} h-12 w-full rounded-2xl`}
										/>
									))}
								</div>
								<div className={`${pulse} h-24 w-full rounded-3xl`} />
								<div className={`${pulse} h-12 w-full rounded-3xl`} />
							</div>
						</div>
					</div>

					<div className='space-y-6'>
						<div className='space-y-6 rounded-[32px] border border-zinc-100 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.1)]'>
							<div className='flex flex-wrap items-center gap-4'>
								<div className={`${pulse} h-12 w-40`} />
								<div className='flex gap-2'>
									{Array.from({ length: 4 }).map((_, index) => (
										<div
											key={index}
											className={`${pulse} h-10 w-10 rounded-full`}
										/>
									))}
								</div>
								<div className='ml-auto flex flex-col gap-2'>
									<div className={`${pulse} h-4 w-24`} />
									<div className={`${pulse} h-8 w-40`} />
								</div>
							</div>
							<div className='grid gap-3 sm:grid-cols-2'>
								<div className={`${pulse} h-12 w-full rounded-2xl`} />
								<div className={`${pulse} h-12 w-full rounded-2xl`} />
							</div>
							<div className='sm:hidden rounded-[28px] border border-zinc-100 bg-zinc-50/70 p-4'>
								<div className={`${pulse} h-4 w-32`} />
								<div className='mt-4 flex items-center gap-3'>
									<div className={`${pulse} h-12 w-12 rounded-full`} />
									<div className='flex-1'>
										<div className={`${pulse} h-12 w-full rounded-full bg-[#C4005B]/30`} />
									</div>
								</div>
							</div>
						</div>

						<div className='space-y-6 rounded-[32px] border border-zinc-100 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.1)]'>
							<div className={`${pulse} h-6 w-48`} />
							<div className='grid gap-4 md:grid-cols-2'>
								{Array.from({ length: 12 }).map((_, index) => (
									<div
										key={index}
										className='flex items-center justify-between gap-4 border-b border-dashed border-zinc-200 pb-3'
									>
										<div className={`${pulse} h-4 w-28`} />
										<div className={`${pulse} h-4 w-20`} />
									</div>
								))}
							</div>
						</div>

						<div className='space-y-6 rounded-[32px] border border-zinc-100 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.1)]'>
							<div className={`${pulse} h-6 w-56`} />
							<div className='space-y-3'>
								{[100, 100, 100, 70].map((width, index) => (
									<div
										key={`${width}-${index}`}
										className={`${pulse} h-4`}
										style={{ width: `${width}%` }}
									/>
								))}
							</div>
							<div className='grid gap-3 sm:grid-cols-2'>
								{Array.from({ length: 6 }).map((_, index) => (
									<div key={index} className='space-y-2'>
										<div className={`${pulse} h-4 w-24`} />
										<div className={`${pulse} h-4 w-32`} />
									</div>
								))}
							</div>
						</div>

						<div className='space-y-4 rounded-[32px] border border-zinc-100 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.1)]'>
							<div className={`${pulse} h-6 w-48`} />
							<div className='space-y-2'>
								{[60, 50, 40].map((width) => (
									<div
										key={width}
										className={`${pulse} h-4`}
										style={{ width: `${width}%` }}
									/>
								))}
							</div>
							<div className='grid gap-3 sm:grid-cols-2'>
								{Array.from({ length: 4 }).map((_, index) => (
									<div key={index} className='space-y-2'>
										<div className={`${pulse} h-4 w-24`} />
										<div className={`${pulse} h-4 w-32`} />
									</div>
								))}
							</div>
						</div>

						<div className='space-y-4 rounded-[32px] border border-zinc-100 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.1)]'>
							<div className={`${pulse} h-6 w-56`} />
							<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
								{Array.from({ length: 6 }).map((_, index) => (
									<div
										key={index}
										className='overflow-hidden rounded-[28px] border border-zinc-100'
									>
										<div className={`${pulse} aspect-[4/3] w-full`} />
										<div className='space-y-3 p-4'>
											<div className={`${pulse} h-4 w-3/4`} />
											<div className={`${pulse} h-4 w-1/2`} />
											<div className={`${pulse} h-10 w-full rounded-2xl`} />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className='border-t border-zinc-200 bg-zinc-50 py-8'>
				<div className='container mx-auto px-4'>
					<div className={`${pulse} h-5 w-48 mb-4`} />
					<div className='space-y-2'>
						{[100, 100, 70].map((width, index) => (
							<div
								key={`${width}-${index}`}
								className={`${pulse} h-4`}
								style={{ width: `${width}%` }}
							/>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}

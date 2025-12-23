"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
	getSecureVehicleImageUrl,
	getBlurDataURL,
} from "@dealertower/lib/utils/image";

interface VehicleImage {
	url: string;
	alt: string;
	preview?: string;
}

interface VehicleGalleryProps {
	images: VehicleImage[];
	title: string;
}

export function VehicleGallery({ images, title }: VehicleGalleryProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

	const secureImages = useMemo(
		() =>
			!images || images.length === 0
				? []
				: images.map((img) => ({
					...img,
					url: getSecureVehicleImageUrl(img.url) || img.url,
				})),
		[images]
	);

	const totalImages = secureImages.length;

	const handlePrevious = useCallback(() => {
		setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
	}, [totalImages]);

	const handleNext = useCallback(() => {
		setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
	}, [totalImages]);

	useEffect(() => {
		if (!isFullscreenOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsFullscreenOpen(false);
				return;
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				handlePrevious();
			}
			if (event.key === "ArrowRight") {
				event.preventDefault();
				handleNext();
			}
		};

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = originalOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleNext, handlePrevious, isFullscreenOpen]);

	if (!images || images.length === 0) {
		return (
			<div className='aspect-[9/6.6] bg-gray-200 rounded-4xl flex items-center justify-center'>
				<p className='text-gray-500'>No images available</p>
			</div>
		);
	}

	const openGalleryLabel = title
		? `Open full-screen gallery for ${title}`
		: "Open full-screen gallery";

	const currentImage = secureImages[currentIndex];

	return (
		<>
			<div className='relative aspect-[9/6.6] bg-gray-200 rounded-4xl overflow-hidden shadow-sm '>
				{/* Main Image */}
				<button
					type='button'
					onClick={() => setIsFullscreenOpen(true)}
					className='group relative block h-full w-full focus:outline-none'
					aria-label={openGalleryLabel}
				>
					<Image
						key={currentIndex}
						src={currentImage.url}
						alt={currentImage.alt}
						fill
						className='object-cover transition duration-200 group-hover:scale-[1.01]'
						sizes='(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw'
						quality={75}
						priority={currentIndex === 0}
						loading={currentIndex === 0 ? "eager" : "lazy"}
						fetchPriority={currentIndex === 0 ? "high" : "auto"}
						placeholder={
							getBlurDataURL(currentImage.preview) ? "blur" : "empty"
						}
						blurDataURL={getBlurDataURL(currentImage.preview)}
					/>
				</button>

				{/* Navigation Arrows */}
				{images.length > 1 && (
					<>
						<button
							onClick={handlePrevious}
							className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white z-10 cursor-pointer'
							aria-label='Previous image'
						>
							<svg
								className='h-6 w-6 text-gray-900'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M15 19l-7-7 7-7'
								/>
							</svg>
						</button>
						<button
							onClick={handleNext}
							className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white z-10 cursor-pointer'
							aria-label='Next image'
						>
							<svg
								className='h-6 w-6 text-gray-900'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5l7 7-7 7'
								/>
							</svg>
						</button>

						{/* Photo Counter */}
						<div className='absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded text-sm font-medium text-white z-10'>
							Photo {currentIndex + 1} / {images.length}
						</div>
					</>
				)}
			</div>

			{isFullscreenOpen && (
				<div className='fixed inset-0 z-50 flex flex-col bg-black/90 px-4 py-6 sm:px-8'>
					<div className='flex flex-wrap items-center justify-between gap-3 text-white'>
						<div>
							{title && <p className='text-base font-semibold'>{title}</p>}
							<p className='text-sm font-medium text-white/80'>
								Photo {currentIndex + 1} of {images.length}
							</p>
						</div>
						<button
							type='button'
							onClick={() => setIsFullscreenOpen(false)}
							className='rounded-full bg-white/10 px-3 py-1 text-sm font-semibold hover:bg-white/20 cursor-pointer'
						>
							Close
						</button>
					</div>
					<div className='relative mt-4 flex-1'>
						<Image
							key={`fullscreen-${currentIndex}`}
							src={currentImage.url}
							alt={currentImage.alt}
							fill
							className='object-contain'
							sizes='100vw'
							quality={85}
							placeholder={
								getBlurDataURL(currentImage.preview) ? "blur" : "empty"
							}
							blurDataURL={getBlurDataURL(currentImage.preview)}
						/>

						{images.length > 1 && (
							<>
								<button
									onClick={handlePrevious}
									className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-4 hover:bg-white text-gray-900 cursor-pointer'
									aria-label='Previous image'
								>
									<svg
										className='h-6 w-6'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 19l-7-7 7-7'
										/>
									</svg>
								</button>
								<button
									onClick={handleNext}
									className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-4 hover:bg-white text-gray-900 cursor-pointer'
									aria-label='Next image'
								>
									<svg
										className='h-6 w-6'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 5l7 7-7 7'
										/>
									</svg>
								</button>
							</>
						)}
					</div>
					{images.length > 1 && (
						<div className='mt-4 flex gap-2 overflow-x-auto'>
							{secureImages.map((image, index) => (
								<button
									type='button'
									key={image.url + index}
									onClick={() => setCurrentIndex(index)}
									className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg border ${
										index === currentIndex ? "border-white" : "border-white/30"
									}`}

									aria-label={`View photo ${index + 1}`}
								>
									<Image
										src={image.url}
										alt={image.alt}
										fill
										className='object-cover'
										sizes='10vw'
										placeholder={
											getBlurDataURL(image.preview) ? "blur" : "empty"
										}
										blurDataURL={getBlurDataURL(image.preview)}
									/>
								</button>
							))}
						</div>
					)}
				</div>
			)}
		</>
	);
}

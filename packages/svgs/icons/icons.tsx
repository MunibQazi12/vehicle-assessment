/**
 * Reusable SVG Icon Components
 * Consistent icon library for the application
 */

import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  "aria-label"?: string;
}

export function ChevronLeftIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

export function InfoIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function MapPinIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}


export function CarIcon({ className = "h-5 w-5", ...props }: IconProps) {
  	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path 
				className={className}
				fillRule="evenodd" 
				clipRule="evenodd" 
				d="M20.99 9.28998H19.47L19.4401 9.04998C18.9701 5.76998 16.11 3.28998 12.8 3.28998H11.21C7.89005 3.28998 5.04005 5.76998 4.57005 9.04998L4.54005 9.28998H3.01005C2.62005 9.28998 2.30005 9.60998 2.30005 9.99998C2.30005 10.39 2.62005 10.71 3.01005 10.71H4.33005L4.30005 10.91C3.69005 11.41 3.29005 12.15 3.29005 13V19C3.29005 19.94 4.06005 20.71 5.00005 20.71H6.00005C6.94005 20.71 7.71005 19.94 7.71005 19V17.71H16.2901V19C16.2901 19.94 17.06 20.71 18 20.71H19C19.9401 20.71 20.71 19.94 20.71 19V13C20.71 12.16 20.3101 11.41 19.7001 10.91L19.67 10.71H20.99C21.38 10.71 21.7001 10.39 21.7001 9.99998C21.7001 9.60998 21.38 9.28998 20.99 9.28998ZM6.00005 16.29C5.29005 16.29 4.71005 15.71 4.71005 15V13C4.71005 12.29 5.29005 11.71 6.00005 11.71H18C18.71 11.71 19.2901 12.29 19.2901 13V15C19.2901 15.71 18.71 16.29 18 16.29H6.00005ZM11.21 4.70998H12.79C15.4 4.70998 17.66 6.65998 18.03 9.24998L18.18 10.31C18.15 10.31 18.12 10.305 18.09 10.3C18.06 10.295 18.03 10.29 18 10.29H6.00005C5.94005 10.29 5.88005 10.3 5.82005 10.31L5.97005 9.24998C6.34005 6.65998 8.59005 4.70998 11.21 4.70998ZM6.29005 19C6.29005 19.16 6.16005 19.29 6.00005 19.29H5.00005C4.84005 19.29 4.71005 19.16 4.71005 19V17.37C5.10005 17.58 5.53005 17.71 6.00005 17.71H6.29005V19ZM19 19.29H18C17.84 19.29 17.71 19.16 17.71 19V17.71H18C18.47 17.71 18.9001 17.58 19.2901 17.37V19C19.2901 19.16 19.16 19.29 19 19.29ZM17 15C17.5523 15 18 14.5523 18 14C18 13.4477 17.5523 13 17 13C16.4477 13 16 13.4477 16 14C16 14.5523 16.4477 15 17 15ZM8 14C8 14.5523 7.55228 15 7 15C6.44772 15 6 14.5523 6 14C6 13.4477 6.44772 13 7 13C7.55228 13 8 13.4477 8 14Z" fill="#001333"
			/>
		</svg>
  	)
}
export function MailIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

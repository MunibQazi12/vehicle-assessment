/**
 * API Route: Get Dealer Colors
 * Returns dealer's main colors and saved colors for use in CMS editor
 */

import { NextResponse } from 'next/server'
import { fetchWebsiteInformation } from '@dealertower/lib/api/dealer'

export async function GET() {
	try {
		// Get hostname from environment variable (CMS always uses configured dealer)
		const hostname = process.env.NEXTJS_APP_HOSTNAME

		if (!hostname) {
			console.error('[API:Colors] NEXTJS_APP_HOSTNAME not configured')
			return NextResponse.json(
				{ error: 'Hostname not configured' },
				{ status: 500 }
			)
		}

		// Fetch dealer information
		const dealerInfo = await fetchWebsiteInformation(hostname)

		if (!dealerInfo) {
			console.error(`[API:Colors] Failed to fetch dealer info for ${hostname}`)
			return NextResponse.json(
				{ error: 'Failed to fetch dealer information' },
				{ status: 500 }
			)
		}

		// Return colors
		return NextResponse.json({
			mainColors: dealerInfo.main_colors || [],
			savedColors: dealerInfo.saved_colors || [],
			dealerName: dealerInfo.name,
		})
	} catch (error) {
		console.error('[API:Colors] Error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

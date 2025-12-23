import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { stat } from 'fs/promises';

/**
 * Dynamic API Route for Dealer-Specific Assets
 * 
 * Serves assets from public/dealers/{dealerId}/ directory based on current tenant.
 * Falls back to shared public/ directory if dealer-specific asset not found.
 * 
 * Usage: /assets/logo.png → public/dealers/{dealerId}/logo.png
 */

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
};

function getMimeType(filename: string): string {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const assetPath = path.join('/');

    // Note: Assets are files and don't require trailing slashes
    // The [...path] catch-all handles them correctly

    // Security: Read dealer ID from environment variables to prevent tenant injection
    const dealerId = process.env.NEXTJS_APP_DEALER_ID || 'default';
    const hostname = process.env.NEXTJS_APP_HOSTNAME || 'localhost';

    // Security: prevent directory traversal
    if (assetPath.includes('..') || assetPath.includes('~')) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    // Try dealer-specific asset first (using dealer ID as folder name)
    // Assets are stored at: dealers/{dealerId}/public/assets/{assetPath}
    const dealerAssetPath = join(process.cwd(), 'dealers', dealerId, 'public', 'assets', assetPath);
    
    try {
      const stats = await stat(dealerAssetPath);
      if (stats.isFile()) {
        const file = await readFile(dealerAssetPath);
        const mimeType = getMimeType(assetPath);
        
        return new NextResponse(file, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
            'X-Dealer-Asset': 'true',
            'X-Dealer-Id': dealerId,
            'X-Dealer-Hostname': hostname,
          },
        });
      }
    } catch {
      // File not found in dealer directory, try fallback
    }

    // Fallback to shared public directory
    const sharedAssetPath = join(process.cwd(), 'public', assetPath);
    
    try {
      const stats = await stat(sharedAssetPath);
      if (stats.isFile()) {
        const file = await readFile(sharedAssetPath);
        const mimeType = getMimeType(assetPath);
        
        return new NextResponse(file, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Dealer-Asset': 'false',
          },
        });
      }
    } catch {
      // File not found in shared directory either
    }

    // Asset not found anywhere
    return new NextResponse('Asset not found', { status: 404 });

  } catch (error) {
    console.error('[Dealer Assets] Error serving asset:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

// Optional: Support HEAD requests for checking asset existence
export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const response = await GET(request, context);
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}

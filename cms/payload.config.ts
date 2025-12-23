import { mongooseAdapter } from '@payloadcms/db-mongodb'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@dtcms/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	routes: {
		api: '/api/cms',
		admin: '/admin',
		graphQL: '/api/cms/graphql',
		graphQLPlayground: '/api/cms/graphql-playground',
	},
	admin: {
		// Disable dark theme - lock admin panel to light theme only
		theme: 'light',
		components: {
			// The `BeforeLogin` component renders a message that you see while logging into your admin panel.
			// Feel free to delete this at any time. Simply remove the line below.
			beforeLogin: ['@dtcms/components/BeforeLogin'],
			// The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
			// Feel free to delete this at any time. Simply remove the line below.
			beforeDashboard: ['@dtcms/components/BeforeDashboard'],
		},
		importMap: {
			baseDir: path.resolve(dirname, '../app/(admin)'),
			importMapFile: path.resolve(dirname, '../app/(admin)/admin/importMap.js'),
		},
		user: Users.slug,
		livePreview: {
			breakpoints: [
				{
					label: 'Mobile',
					name: 'mobile',
					width: 375,
					height: 667,
				},
				{
					label: 'Tablet',
					name: 'tablet',
					width: 768,
					height: 1024,
				},
				{
					label: 'Desktop',
					name: 'desktop',
					width: 1440,
					height: 900,
				},
			],
		},
	},
	// This config helps us configure global or default features that the other editors can inherit
	editor: defaultLexical,
	db: mongooseAdapter({
		url: (process.env.MONGODB_BASE_URI + '/' + process.env.NEXTJS_APP_DEALER_ID) || '',
	}),
	collections: [Pages, Media, Users],
	cors: [getServerSideURL()].filter(Boolean),
	globals: [Header, Footer],
	plugins,
	secret: process.env.PAYLOAD_SECRET || '',
	sharp,
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	jobs: {
		access: {
			run: ({ req }) => {
				// Allow logged in users to execute this endpoint (default)
				if (req.user) return true

				// If there is no logged in user, then check
				// for the Vercel Cron secret to be present as an
				// Authorization header:
				const authHeader = req.headers.get('authorization')
				return authHeader === `Bearer ${process.env.CRON_SECRET}`
			},
		},
		tasks: [],
	},
})

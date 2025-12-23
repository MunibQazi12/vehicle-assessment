import React from 'react'

import type { Page } from '@dtcms/payload-types'

import { HeroTemplate1Hero } from '@dtcms/heros/HeroTemplate1'
import { HeroTemplate2Hero } from '@dtcms/heros/HeroTemplate2'

const heroes = {
	heroTemplate1: HeroTemplate1Hero,
	heroTemplate2: HeroTemplate2Hero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
	const { type } = props || {}

	if (!type || type === 'none') return null

	const HeroToRender = heroes[type]

	if (!HeroToRender) return null

	return <HeroToRender {...props} />
}

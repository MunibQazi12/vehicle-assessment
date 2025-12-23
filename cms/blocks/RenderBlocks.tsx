import React, { Fragment } from 'react'

import type { Page } from '@dtcms/payload-types'

import { CallToActionBlock } from '@dtcms/blocks/CallToAction/Component'
import { MediaBlock } from '@dtcms/blocks/MediaBlock/Component'
import { StatsBarAlphaBlock } from '@dtcms/blocks/StatsBarAlpha/Component'
import { WYSIWYGBlock as TextBlock } from '@dtcms/blocks/WYSIWYGBlock/Component'
import { ColumnsBlock } from '@dtcms/blocks/Columns/Component'
import { HTMLBlock } from '@dtcms/blocks/HTMLBlock/Component'
import { SpacerBlock } from '@dtcms/blocks/Spacer/Component'
import ManufacturerLogoGridBlock from '@dtcms/blocks/ManufacturerLogoGrid/Component'
import RibbonBannerBlock from '@dtcms/blocks/RibbonBanner/Component'
import { ContentSectionBlock } from '@dtcms/blocks/ContentSection/Component'
import { ReviewsSectionBlock } from '@dtcms/blocks/ReviewsSection/Component'
import { ContainerSectionBlock } from '@dtcms/blocks/ContainerSection/Component'
import { FormBlock } from '@dtcms/blocks/FormBlock/Component'

const blockComponents = {
	cta: CallToActionBlock,
	mediaBlock: MediaBlock,
	statsBarAlpha: StatsBarAlphaBlock,
	columnsBlock: ColumnsBlock,
	content: TextBlock,
	htmlBlock: HTMLBlock,
	spacer: SpacerBlock,
	manufacturerLogoGrid: ManufacturerLogoGridBlock,
	ribbonBanner: RibbonBannerBlock,
	contentSection: ContentSectionBlock,
	reviewsSection: ReviewsSectionBlock,
	containerSection: ContainerSectionBlock,
	formBlock: FormBlock,
}

export const RenderBlocks: React.FC<{
	blocks: Page['layout'][0][]
}> = (props) => {
	const { blocks } = props

	const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

	if (hasBlocks) {
		return (
			<Fragment>
				{blocks.map((block, index) => {
					const { blockType } = block

					if (blockType && blockType in blockComponents) {
						const Block = blockComponents[blockType]

						if (Block) {
							return (
								<div key={index}>
									{/* @ts-expect-error there may be some mismatch between the expected types here */}
									<Block {...block} disableInnerContainer />
								</div>
							)
						}
					}
					return null
				})}
			</Fragment>
		)
	}

	return null
}

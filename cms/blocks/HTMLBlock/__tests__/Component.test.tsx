import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HTMLBlock } from '../Component'

describe('HTMLBlock', () => {
	it('should render HTML content', () => {
		const htmlContent = '<div data-testid="custom-html"><p>Test Content</p></div>'

		render(
			<HTMLBlock
				htmlContent={htmlContent}
				blockType="htmlBlock"
			/>
		)

		const element = screen.getByTestId('custom-html')
		expect(element).toBeInTheDocument()
		expect(element.querySelector('p')).toHaveTextContent('Test Content')
	})

	it('should render with custom className', () => {
		const htmlContent = '<div>Content</div>'

		const { container } = render(
			<HTMLBlock
				htmlContent={htmlContent}
				blockType="htmlBlock"
				className="custom-class"
			/>
		)

		const wrapper = container.querySelector('.custom-class')
		expect(wrapper).toBeInTheDocument()
	})

	it('should include container by default', () => {
		const htmlContent = '<div>Content</div>'

		const { container } = render(
			<HTMLBlock
				htmlContent={htmlContent}
				blockType="htmlBlock"
			/>
		)

		const containerDiv = container.querySelector('.container')
		expect(containerDiv).toBeInTheDocument()
	})

	it('should exclude container when disableInnerContainer is true', () => {
		const htmlContent = '<div>Content</div>'

		const { container } = render(
			<HTMLBlock
				htmlContent={htmlContent}
				blockType="htmlBlock"
				disableInnerContainer={true}
			/>
		)

		const containerDiv = container.querySelector('.container')
		expect(containerDiv).not.toBeInTheDocument()
	})

	it('should pass enableScripts prop to HTMLContent', () => {
		const htmlContent = '<script>console.log("test")</script>'

		render(
			<HTMLBlock
				htmlContent={htmlContent}
				blockType="htmlBlock"
				enableScripts={true}
			/>
		)

		// Component should render without throwing
		const wrapper = screen.getByText((content, element) => {
			return element?.className?.includes('html-block-content') || false
		})
		expect(wrapper).toBeInTheDocument()
	})

	it('should respect useContainer prop when set to false', () => {
		const htmlContent = '<div>Content</div>'

		const { container } = render(
			<HTMLBlock
				htmlContent={htmlContent}
				blockType="htmlBlock"
				useContainer={false}
			/>
		)

		const containerDiv = container.querySelector('.container')
		expect(containerDiv).not.toBeInTheDocument()
	})

	it('should use container by default when useContainer is not specified', () => {
		const htmlContent = '<div>Content</div>'

		const { container } = render(
			<HTMLBlock
				htmlContent={htmlContent}
				blockType="htmlBlock"
			/>
		)

		const containerDiv = container.querySelector('.container')
		expect(containerDiv).toBeInTheDocument()
	})

	it('should preserve style tags in HTML content', () => {
		const htmlContent = `
      <style>
        .test-class { color: red; }
      </style>
      <div class="test-class">Styled content</div>
    `

		const { container } = render(
			<HTMLBlock
				htmlContent={htmlContent}
				blockType="htmlBlock"
			/>
		)

		const styleTag = container.querySelector('style')
		expect(styleTag).toBeInTheDocument()
		expect(styleTag?.textContent).toContain('.test-class { color: red; }')
	})

	it('should preserve inline styles on elements', () => {
		const htmlContent = '<div data-testid="styled-div" style="color: blue; font-size: 16px;">Inline styled</div>'

		render(
			<HTMLBlock
				htmlContent={htmlContent}
				blockType="htmlBlock"
			/>
		)

		const styledDiv = screen.getByTestId('styled-div')
		// jsdom converts 'blue' to 'rgb(0, 0, 255)', so we check for the attribute directly
		expect(styledDiv).toHaveAttribute('style')
		expect(styledDiv.getAttribute('style')).toContain('color')
		expect(styledDiv).toHaveStyle({ fontSize: '16px' })
	})

	it('should preserve complex HTML with style tags and inline styles', () => {
		const htmlContent = `
      <style>
        .adpear-auto .button { line-height: 1.6em !important; }
      </style>
      <section class="adpear-auto">
        <div class="button" style="padding: 1rem;">Button</div>
      </section>
    `

		const { container } = render(
			<HTMLBlock
				htmlContent={htmlContent}
				blockType="htmlBlock"
			/>
		)

		const styleTag = container.querySelector('style')
		expect(styleTag).toBeInTheDocument()
		expect(styleTag?.textContent).toContain('.adpear-auto .button')

		const section = container.querySelector('.adpear-auto')
		expect(section).toBeInTheDocument()

		const button = container.querySelector('.button')
		expect(button).toHaveAttribute('style', 'padding: 1rem;')
	})
})

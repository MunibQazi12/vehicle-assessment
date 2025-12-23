import { SimpleTooltip } from "@dealertower/components/ui";
import { cn } from "@dealertower/lib/utils/cn";

type Props = {
	intColor: string;
	extColor: string;
	intColorRaw: string | null;
	extColorRaw: string | null;
};

const COLORS: Record<string, string> = {
	white: "white",
	black: "black",
	silver: "silver",
	gray: "grey",
	red: "#f44336",
	green: "#8bc34a",
	blue: "#1e90ff",
	beige: "beige",
	brown: "#8b4513",
	gold: "#daa520",
	yellow: "#ffe800",
	orange: "#ff9600",
	purple: "#800080",
	whiteblack: "linear-gradient(45deg, #fff 47%, #000 53%)",
	silverred: "linear-gradient(45deg, #ccc 47%, #f44336 53%)",
	whiteblue: "linear-gradient(45deg, #fff 47%, #1e90ff 53%)",
	other: "linear-gradient(to right, #d9afd9 0%, #97d9e1 100%)",
};

function normalizeColorName(color: string) {
	return color.toLowerCase().replace(/[^\da-z]/g, "");
}

function getColorValue(color?: string) {
	if (!color) {
		return COLORS.other;
	}

	const normalized = normalizeColorName(color);
	return COLORS[normalized] ?? color;
}

function VehicleGridCardColor(props: Props) {
	const { intColor, extColor, extColorRaw, intColorRaw } = props;

	type ColorSwatch = {
		key: string;
		label: string;
		value: string;
		raw: string | null;
	};

	const swatches: ColorSwatch[] = [
		{
			key: "exterior",
			label: "Exterior",
			value: extColor,
			raw: extColorRaw,
		},
		{
			key: "interior",
			label: "Interior",
			value: intColor,
			raw: intColorRaw,
		},
	].filter((swatch): swatch is ColorSwatch => Boolean(swatch.value));

	if (swatches.length === 0) {
		return null;
	}

	return (
		<div className='vehicle-grid-card-color flex items-center justify-end'>
			<SimpleTooltip
				content={extColorRaw}
				className='vehicle-grid-card-color__tooltip'
			>
				<div
					className={cn(
						"vehicle-grid-card-color__swatch w-4 h-4 rounded-circle border-white border border-solid shadow-md"
					)}
					style={{ background: getColorValue(extColor) }}
				/>
			</SimpleTooltip>
			<SimpleTooltip
				content={intColorRaw}
				className='vehicle-grid-card-color__tooltip vehicle-grid-card-color__tooltip--overlap'
			>
				<div
					className={cn(
						"vehicle-grid-card-color__swatch  w-4 h-4 rounded-circle border-white border border-solid shadow-md",
						"vehicle-grid-card-color__swatch--overlap"
					)}
					style={{ background: getColorValue(intColor) }}
				/>
			</SimpleTooltip>
		</div>
	);
}

export default VehicleGridCardColor;

import { FC, CSSProperties } from "react";
import Image from "next/image";

// const isNissanOfPortlandSite = ipacketHosts.includes(process.env.NEXT_PUBLIC_HOST || '	');

const isNissanOfPortlandSite = true; // for testing locally

export const NOP_IPACKET_ID_USED_CERT = "27D4CFC7MZKZOTM2MTKW";
export const NOP_IPACKET_ID_NEW = "27D4CFC7NDIZMJY1NTE5";
export const NOP_IPACKET_SITE_ID = "1";

type IpacketButtonProps = {
	vin?: string | null;
	/** id from Dealer (diff for used/cert and new) */
	apiId: string;
	/** site_id param, if needed (for new) */
	siteId?: string;
	/** container width for img */
	imgWidth?: number;
	className?: string;
	style?: CSSProperties;
};

const IpacketButton: FC<IpacketButtonProps> = ({
	vin,
	apiId,
	siteId,
	imgWidth = 150,
	className,
	style,
}) => {
	if (!vin || !isNissanOfPortlandSite) return null;

	const src =
		`https://webicon.autoipacket.com/info?id=${apiId}` +
		`&vin=${encodeURIComponent(vin)}` +
		(siteId ? `&site_id=${siteId}` : "");

	return (
		<a
			href={`https://www.ipacket.info/${vin}`}
			target='_blank'
			rel='noopener noreferrer'
			style={{
				display: "inline-block",
				width: imgWidth,
				position: "relative",
				aspectRatio: `${imgWidth} / 35`,
				...style,
			}}
			className={className}
			aria-label='View iPacket for this vehicle'
		>
			<Image
				src={src}
				alt='iPacket'
				fill
				style={{ objectFit: "contain" }}
				onError={(e) => {
					(e.currentTarget as HTMLImageElement).style.display = "none";
				}}
			/>
		</a>
	);
};

export { IpacketButton };

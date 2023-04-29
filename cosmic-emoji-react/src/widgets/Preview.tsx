import { useEffect } from 'react';
import { UnicornType } from '../types/paint';
import './Preview.css';

interface PreviewProps {
	keyId: number;
	config: UnicornType;
	onClick: any;
	selected: boolean;
	dataRgbaArray: number[] | undefined;
	isLoading: boolean;
	isSaving: boolean;
	isError: boolean;
}

const Preview = ({
	keyId,
	config,
	onClick,
	selected,
	dataRgbaArray,
	isLoading,
	isSaving,
	isError,
}: PreviewProps) => {

	useEffect(() => {
		var c = document.getElementById(`canvas-${keyId}`) as HTMLCanvasElement;
		var ctx = c?.getContext("2d");
		if (ctx) {
			ctx.scale(2, 2);
		}
		return () => {
			ctx?.scale(0.5, 0.5);
		};
	}, [keyId]);

	/**
	 * When dataRgbaArray changes, draw it to the Preview canvas
	 */
	useEffect(() => {
		var c = document.getElementById(`canvas-${keyId}`) as HTMLCanvasElement;
		var ctx = c?.getContext("2d");
		if (ctx) {
			if (dataRgbaArray) {
				for (var y = 0; y < 32; y++) {
					for (var x = 0; x < 32; x++) {
						const index = (y * 32 + x) * 4;
						// get rgba data
						const r = dataRgbaArray[index];
						const g = dataRgbaArray[index + 1];
						const b = dataRgbaArray[index + 2];
						const a = dataRgbaArray[index + 3];

						// convert rgba to rgb
						const aa = a / 255;
						const rr = Math.round(r * aa);
						const gg = Math.round(g * aa);
						const bb = Math.round(b * aa);

						// Draw rgba to canvas (does not work)
						//ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

						// Draw rgb to canvas
						ctx.fillStyle = `rgb(${rr}, ${gg}, ${bb})`;
						ctx.fillRect(x, y, 1, 1);
					}
				}
			} else {
				// no data, draw black
				ctx.fillStyle = `rgb(0, 0, 0)`;
				ctx.fillRect(0, 0, 32, 32);
			}
		}
	}, [keyId, dataRgbaArray]);


	return (
		<div onClick={onClick} className={selected ? 'Preview preview-selected' : 'Preview'}>
			<>
				<canvas
					id={`canvas-${keyId}`}
					height="64"
					width="64"
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						//transformOrigin: 'top left',
						//transform: 'scale(2)',
					}}
				>
				</canvas>

				{/* {config.dataUrl && <img src={config.dataUrl} />} */}

				{config.name && (
					<div className="preview-name">{config.name}</div>
				)}

				{isError && (
					<div className={'preview-error'}>😡 Error</div>
				)}

				<div className={isLoading ? 'preview-loading preview-loading-visible' : 'preview-loading'}>♻️</div>

				{isSaving && (
					<div className={'preview-saving'}>💾</div>
				)}
			</>
		</div>
	);
};

export default Preview;

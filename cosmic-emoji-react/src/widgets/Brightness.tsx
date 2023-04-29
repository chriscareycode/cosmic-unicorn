import { useCallback, useEffect, useState } from "react";
import { debounce } from 'lodash';
import { UnicornType } from "../types/paint";

interface BrightnessProps {
	ip?: string;
	selectedIndex: number;
	setUnicornConfigs: React.Dispatch<React.SetStateAction<UnicornType[]>>;
}

const Brightness = ({
	ip,
	selectedIndex,
	setUnicornConfigs,
}: BrightnessProps) => {

	const [brightness, setBrightness] = useState(0.5);
	const [isError, setIsError] = useState(false);

	const getBrightness = useCallback(() => {
		if (!ip) return;
		const url = `http://${ip}/get_brightness`;
		const requestOptions: RequestInit = {
			method: 'GET',
		};
		console.log('fetching', url);
		fetch(url, requestOptions)
			.then(response => {
				return response.text();
			})
			.then(data => {
				console.log('get_brightness data', data);
				const floatData = parseFloat(data);
				if (floatData >= 0 && floatData <= 10) {
					setBrightness(floatData);
					setIsError(false);
				}
			}).catch(e => {
				console.log('get_brightness catch');
				setIsError(true);
			});
	}, [ip]);

	const saveBrightness = (brightness: number) => {
		if (!ip) return;
		const payload = brightness.toString();
		const url = `http://${ip}/set_brightness`;
		const requestOptions: RequestInit = {
			method: 'POST',
			body: payload,
		};
		console.log('POSTing', url);
		fetch(url, requestOptions)
			.then(response => {
				return response.text();
			})
			.then(data => {
				console.log('set_brightness data', data);
				const floatData = parseFloat(data);
				if (floatData >= 0 && floatData <= 10) {
					setBrightness(floatData);
					setIsError(false);
				}
			}).catch(e => {
				console.log('set_brightness catch');
				setIsError(true);
			});
	};

	const rangeChanged = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
		console.log('Brightness rangeChanged', e.target.value);
		const tmp_brightness = parseFloat(e.target.value);
		setBrightness(tmp_brightness); // save to state
		saveBrightness(tmp_brightness); // save to pico
	}, 1000);

	useEffect(() => {
		getBrightness();
	}, [ip, getBrightness]);

	return (
		<div className="Controls">
			<div>
				Brightness{' '}
				<input
					type="range" min="0" max="1" step="0.1"
					value={brightness}
					onChange={rangeChanged}
					style={{ width: 200 }}
					/>
				{brightness.toFixed(1)}
				{isError && <span style={{ color: 'red' }}> ERROR</span>}
			</div>

		</div>
	);
};

export default Brightness;
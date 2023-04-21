import React, { useCallback, useEffect, useState } from 'react';
import EmojiPicker, { Emoji, EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { useIdleTimer } from 'react-idle-timer'

import Preview from './widgets/Preview';
import Brightness from './widgets/Brightness';

//import Settings from './widgets/Settings'; // might use later

import { UnicornType } from './types/paint';
import './App.css';
import { useQueryParamState } from './useQueryParamState';

interface FetchStateObject {
	isSaving: boolean;
	isLoading: boolean;
	isError: boolean;
	errorMessage: string;
	errorCount: number;
};

interface FetchStateType {
	[key: string]: FetchStateObject;
};

function App() {

	const [isConfigError, setIsConfigError] = useState(false);
	const [configErrorMessage, setConfigErrorMessage] = useState('');
	const [selectedIndex, setSelectedIndex] = useQueryParamState('selected', 'number', 0);
	const [isIdle, setIsIdle] = useState(false);
	const [fetchState, setFetchState] = useState<FetchStateType>({});
	const [unicornConfigs, setUnicornConfigs] = useState<UnicornType[]>([]);
  const [unifiedCode, setUnifiedCode] = useState('1f423');
  const [imageLoadedAt, setImageLoadedAt] = useState(0);
  const [emojiStyle, setEmojiStyle] = useQueryParamState('style', 'string', EmojiStyle.APPLE);

	/**
	 * Load config file
	 */
	useEffect(() => {
		const configFile = 'config-unicorns.json';
		const configExampleFile = 'config-unicorns.example.json';
		console.log(`Reading config file ${configFile}...`);
		fetch(configFile)
			.then(response => response.json())
			.then(json => {
				console.log(json);
				setUnicornConfigs(json);
				setIsConfigError(false);
				// If we have multiple Cosmic Unicorns in the config, select which one to start with.
				// If we are hosting this UI on one of the unicorns, auto-select that one.
				if (json.length > 1) {
					for (let i = 0; i < json.length; i++) {
						if (json[i].ip === document.location.host) {
							setSelectedIndex(i);
						}
					}
				}
			}).catch(e => {
				setIsConfigError(true);
				setConfigErrorMessage(`ERROR: Was not able to load the config file ${configFile}. Make sure it exists. Copy example from ${configExampleFile}.`);
			});
	}, [setUnicornConfigs, setIsConfigError, setConfigErrorMessage]);

	/* Stop polling for image updates if the page is inactive */
	const onIdle = () => {
		console.log('onIdle');
		setIsIdle(true);
	}

	/* Start polling for image updates if the page is active */
	const onActive = () => {
		console.log('onActive');
		setIsIdle(false);
	}

	/* Idle timer used for onIdle and onActive */
	/* eslint-disable  @typescript-eslint/no-unused-vars */
	const { getRemainingTime } = useIdleTimer({
		onIdle,
		onActive,
		timeout: 5 * 60 * 1000, // 5 minutes
		throttle: 500
	});
	/* eslint-enable  @typescript-eslint/no-unused-vars */

	const sendPixelsToUnicorn = useCallback(async (payload: any) => {
		const config = unicornConfigs[selectedIndex];
		if (!config) {
			console.log('Cant find config', unicornConfigs, selectedIndex);
			return;
		}
		const ip = config.ip;
		setFetchState(curr => {
			return {
				...curr,
				[ip]: {
					...curr[ip],
					isSaving: true,
				}
			};
		});

		const url = `http://${ip}/set_pixels`;

		const requestOptions: RequestInit = {
			method: 'POST',
			body: payload
		};
		fetch(url, requestOptions)
			.then(response => response.text())
			.then(data => {
				if (data === 'success') {
					// dataUrl is used for showing the preview
					//unicornConfigs[selectedIndex].dataUrl = dataUrl;
					unicornConfigs[selectedIndex].dataRgbaArray = payload;
				}
			}).finally(() => {
				setFetchState(curr => {
					return {
						...curr,
						[ip]: {
							...curr[ip],
							isSaving: false,
						}
					};
				});
			});
	}, [selectedIndex, unicornConfigs]);

	const getImageDataFromEmojiWithCanvas = useCallback(() => {
		const img = document.querySelector('.canvas-area img') as any;
		//console.log('img', img);
		if (img) {
			img.setAttribute('crossOrigin', 'Anonymous');
			const c = document.querySelector('#canv') as HTMLCanvasElement;
			//const ctx = c.getContext('2d', { willReadFrequently: true });
			const ctx = c.getContext('2d');
			if (ctx) {
				ctx.clearRect(0, 0, 32, 32);
				console.log('Writing img to canvas...');
				ctx.drawImage(img, 0, 0, 32, 32);
				var d = ctx.getImageData(0, 0, 32, 32);
				console.log('Canvas getImageData() result:', d);
				return d;
			}
		} else {
			return null;
		}
	}, [sendPixelsToUnicorn]);

	useEffect(() => {
		setTimeout(() => {
			getImageDataFromEmojiWithCanvas();
		}, 1000);
	}, [getImageDataFromEmojiWithCanvas]);

	const onEmojiClick = (e: EmojiClickData) => {
		// Set unified code into state
		// This will trigger the <Emoji> component to draw (async)
		setUnifiedCode(e.unified);
		
		// Detect when the <Emoji> component loads
		// So we know when we can pull the image data off it
		const img = document.querySelector('.canvas-area img') as any;
		console.log('got emoji img', img);
		if (img) {
			img.onload = () => {
				console.log('emoji img loaded', img);
				const d = getImageDataFromEmojiWithCanvas();
				if (d) {
					sendPixelsToUnicorn(d.data);
				}
				//setImageLoadedAt(Date.now());
				img.onload = null;
			};
		}
	};

	const getPixelsFromUnicorn = useCallback((index: number) => {
		// Get the IP from the unicorn config
		const ip = unicornConfigs[index].ip;

		// Set loading state for this unicorn
		setFetchState(curr => {
			return {
				...curr,
				[ip]: {
					...curr[ip],
					isLoading: true,
				}
			};
		});

		const url = `http://${ip}/get_pixels`;
		const requestOptions: RequestInit = {
			method: 'GET',
		};
		fetch(url, requestOptions)
			.then(response => {
				//console.log('got response', response.body.length);
				//return response.blob();
				return response.arrayBuffer();
			})
			.then(data => {
				const arrayFromBuffer = new Uint8Array(data);
				// Convert Uint8Array into number[]
				const numberArray = [];
				for (var i = 0; i < arrayFromBuffer.length - 1; i++) {
					numberArray.push(arrayFromBuffer[i]);
				}

				unicornConfigs[index].dataRgbaArray = numberArray;

				setFetchState(curr => {
					return {
						...curr,
						[ip]: {
							...curr[ip],
							isLoading: false,
							isError: false,
							errorMessage: '',
							errorCount: 0,
						}
					};
				});

			}).catch((err) => {
				console.log('ERROR: get_pixels catch');
				unicornConfigs[index].dataRgbaArray = undefined;

				setFetchState(curr => {
					return {
						...curr,
						[ip]: {
							...curr[ip],
							isLoading: false,
							isError: true,
							errorMessage: `Error loading ${url}`,
							errorCount: curr[url] ? curr[url].errorCount + 1 : 1,
						}
					};
				});
			});
	}, [unicornConfigs, setFetchState]);

	/**
	 * This useEffect is used to update the Previews every so often
	 */
	useEffect(() => {

		const updateEveryHowManySeconds = 30;

		for (let i = 0; i < unicornConfigs.length; i++) {
			getPixelsFromUnicorn(i);
		}

		let interv: NodeJS.Timer | undefined;
		if (isIdle === false) {
			interv = setInterval(() => {
				for (let i = 0; i < unicornConfigs.length; i++) {
					getPixelsFromUnicorn(i);
				}
			}, updateEveryHowManySeconds * 1000);
		}
		return () => {
			if (interv) {
				clearInterval(interv);
			}
		};
	}, [isIdle, getPixelsFromUnicorn, unicornConfigs.length]);

	/* The array of previews that we display at the top of the page */
	const previewLoop = unicornConfigs.map((u, i) => {
		const ip = unicornConfigs[i].ip;
		return (
			<Preview
				key={i}
				keyId={i}
				selected={i === selectedIndex}
				config={u}
				dataRgbaArray={unicornConfigs[i].dataRgbaArray}
				isLoading={fetchState[ip] && fetchState[ip].isLoading}
				isSaving={fetchState[ip] && fetchState[ip].isSaving}
				isError={fetchState[ip] && fetchState[ip].isError}
				onClick={() => {
					setSelectedIndex(i);
				}}
			/>
		);
	});

	/* The array of connection errors that we show under the previews */
	const errorLoop = Object.keys(fetchState).map((ip, i) => {
		if (fetchState[ip].isError) {
			return <div key={i} className="fetch-error-message">{fetchState[ip].errorMessage} x{fetchState[ip].errorCount}</div>;
		} else {
			return undefined;
		}
	});

	const onChangeStyle = (e: string) => {
		if (e === EmojiStyle.APPLE) {
			setEmojiStyle(EmojiStyle.APPLE);
		}
		if (e === EmojiStyle.GOOGLE) {
			setEmojiStyle(EmojiStyle.GOOGLE);
		}
		if (e === EmojiStyle.FACEBOOK) {
			setEmojiStyle(EmojiStyle.FACEBOOK);
		}
		if (e === EmojiStyle.TWITTER) {
			setEmojiStyle(EmojiStyle.TWITTER);
		}
	};

	return (
		<div className="App">

			<br />

			{/* Show previews of the Cosmic Unicorns */}
			<div style={{ marginTop: 8 }}>
				{previewLoop}
			</div>

			{/* Show config error message if the file is missing */}
			{isConfigError && (
				<div className="fetch-error-message">{configErrorMessage}</div>
			)}

			{/* Show connection errors to individual unicorns */}
			{errorLoop}

			<Brightness
				ip={unicornConfigs[selectedIndex]?.ip}
				selectedIndex={selectedIndex}
				setUnicornConfigs={setUnicornConfigs}
			/>

			<div className="Brightness">
				<div>
					Emoji Style:{' '}&nbsp;
					<select value={emojiStyle} onChange={e => onChangeStyle(e.target.value)}>
						<option value={EmojiStyle.APPLE}>APPLE</option>
						<option value={EmojiStyle.GOOGLE}>GOOGLE</option>
						<option value={EmojiStyle.FACEBOOK}>FACEBOOK</option>
						<option value={EmojiStyle.TWITTER}>TWITTER</option>
					</select>
				</div>
			</div>

			<div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
				<EmojiPicker
					theme={Theme.DARK}
					onEmojiClick={onEmojiClick}
					width="100%"
					height="calc(100vh - 140px)"
					emojiStyle={emojiStyle}
				/>
			</div>

			<div className="canvas-area">
				{/* Though we only want a 32x32 emoji, I'm setting this canvas to 40x40 */}
				{/* Different devices write the emoji to canvas off by a couple pixels */}
				{/* That we fix with scoochX and scoochY values above */}
				Canvas: <canvas id="canv" width="32" height="32"></canvas>
        
				<Emoji
					emojiStyle={emojiStyle}
					unified={unifiedCode} //"1f423"
					size={32}
					lazyLoad={false}
				/>
			</div>

			{/* Settings area that we might use later */}
			{/* <Settings
        unicornConfigs={unicornConfigs}
        setUnicornConfigs={setUnicornConfigs}
      /> */}

		</div>
	);
}

export default App;

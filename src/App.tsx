import React, { useCallback, useEffect, useState } from 'react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useIdleTimer } from 'react-idle-timer'

import Preview from './widgets/Preview';
//import Settings from './widgets/Settings'; // might use later

import { UnicornType } from './types/paint';
import './App.css';

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  const [triggerRedraw, setTriggerRedraw] = useState(0);
  /* eslint-enable  @typescript-eslint/no-unused-vars */
  const [isIdle, setIsIdle] = useState(false);
  const [fetchState, setFetchState] = useState<FetchStateType>({});
  const [unicornConfigs, setUnicornConfigs] = useState<UnicornType[]>([]);

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
          for(let i=0;i<json.length;i++) {
            if (json[i].ip === document.location.host) {
              setSelectedIndex(i);
            }
          }
        }
      }).catch(e => {
        setIsConfigError(true);
        setConfigErrorMessage(`ERROR: Was not able to load the config file ${configFile}. Make sure it exists. Copy example from ${configExampleFile}.`);
      });
  }, [setUnicornConfigs]);

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
    timeout: 5 * 60 * 1000,
    throttle: 500
  });
  /* eslint-enable  @typescript-eslint/no-unused-vars */

  /**
   * doEmojiToData()
   * Takes an emoji as input, and returns imageData (for use to send to the unicorn),
   * and returns dataUrl (previously used to display the preview)
   * @param emoji 
   * @returns 
   */
  const doEmojiToData = (emoji: string) => {
    const c = document.querySelector('#canv') as HTMLCanvasElement;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.font = '32px monospace';
      ctx.clearRect(0, 0, 128, 128);
      const scooch = 4;
      ctx.fillText(emoji, 0, 32 - scooch);
      const imageData = ctx.getImageData(0, 0, 32, 32);

      return {
        data: imageData.data,
        //dataUrl: c.toDataURL(),
      };
    }
  };

  const sendPixelsToUnicorn = async (payload: any) => {
    const ip = unicornConfigs[selectedIndex].ip;
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
          setTriggerRedraw(Date.now());
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
  };

  const onEmojiClick = (e: EmojiClickData) => {
    const d = doEmojiToData(e.emoji);
    if (d) {
      sendPixelsToUnicorn(d.data);
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
        for(var i=0;i<arrayFromBuffer.length-1;i++) {
          numberArray.push(arrayFromBuffer[i]);
        }

        unicornConfigs[index].dataRgbaArray = numberArray;
        setTriggerRedraw(Date.now());
        
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

    const updateEveryHowManySeconds = 15;

    for (let i=0;i<unicornConfigs.length;i++) {
      getPixelsFromUnicorn(i);
    }

    let interv: NodeJS.Timer | undefined;
    if (isIdle === false) {
      interv = setInterval(() => {
        for (let i=0;i<unicornConfigs.length;i++) {
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

      <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
        <EmojiPicker
          theme={Theme.DARK}
          onEmojiClick={onEmojiClick}
          width="100%"
          height="calc(100vh - 140px)"
        />
      </div>

      <div className="canvas-area">
        Canvas: <canvas id="canv" width="32" height="32" style={{ border: '1px solid orange' }}></canvas>
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

import { useEffect } from 'react';
import { UnicornType } from '../types/paint';
import './Preview.css';

interface PreviewProps {
  keyId: number;
  config: UnicornType;
  onClick: any;
  selected: boolean;
  dataRgbaArray: number[] | undefined;
  isError: boolean;
}

const Preview = ({
  keyId,
  config,
  onClick,
  selected,
  dataRgbaArray,
  isError,
}: PreviewProps) => {

  /**
   * When dataRgbaArray changes, draw it to the Preview canvas
   */
  useEffect(() => {
    var c = document.getElementById(`canvas-${keyId}`) as HTMLCanvasElement;
    var ctx = c?.getContext("2d");
    if (ctx) {
      // ctx.fillStyle = "red";
      // ctx.fillRect(10, 10, 50, 50);

      // var imgData = ctx.getImageData(10, 10, 50, 50);
      // ctx.putImageData(imgData, 10, 70);


      if (dataRgbaArray) {

        for(var y=0; y<32; y++) {
          for(var x=0; x<32; x++) {
            const index = (y * 32 + x) * 4;
            const r = dataRgbaArray[index];
            const g = dataRgbaArray[index+1];
            const b = dataRgbaArray[index+2];
            const a = dataRgbaArray[index+3];

            const aa = a / 255;
            const rr = Math.round(r * aa);
            const gg = Math.round(g * aa);
            const bb = Math.round(b * aa);

            //ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            ctx.fillStyle = `rgb(${rr}, ${gg}, ${bb})`;
            //console.log('fillStyle', Math.round(r*aa));
            ctx.fillRect(x, y, 1, 1);
          }

        }
        // for(var i=0;i<dataRgbaArray.length - 1;i=i+4) {
        //   const r = 1;
        //   const g = 2;
        //   const b = 3;
        //   const a = 4;
        //   ctx.fillStyle = ``;
        //   ctx.fillRect(x, y, 1, 1);
        // }
        // const imgData = dataRgbaArray as unknown as ImageData;
        // ctx.putImageData(imgData,0,0);
      } else {
        // no data, draw black
        ctx.fillStyle = `rgb(0, 0, 0)`;
        ctx.fillRect(0, 0, 32, 32);
      }
    }

  }, [dataRgbaArray]);


  return (
    <div onClick={onClick} className={selected ? 'Preview preview-selected' : 'Preview'}>
      <>
        <canvas
          id={`canvas-${keyId}`}
          height="32"
          width="32"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transformOrigin: 'top left',
            transform: 'scale(2)',
          }}
          >
        </canvas>
        {/* {config.dataUrl && <img src={config.dataUrl} />} */}
        {config.name}
          {isError && <div className={'preview-error'}>😡</div>}
      </>
    </div>
  );
};

export default Preview;

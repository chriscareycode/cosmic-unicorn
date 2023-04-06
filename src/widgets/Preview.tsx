import { UnicornType } from '../types/paint';
import './Preview.css';

interface PreviewProps {
  config: UnicornType;
  onClick: any;
}

const Preview = ({
  config,
  onClick,
}: PreviewProps) => {
  return (
    <div className="Preview" onClick={onClick}>
      <>
        {config.dataUrl !== '' && <img src={config.dataUrl} />}
        {config.name}
      </>
    </div>
  );
};

export default Preview;

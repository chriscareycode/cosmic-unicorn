import { UnicornType } from '../types/paint';
import './Preview.css';

interface PreviewProps {
  config: UnicornType;
  onClick: any;
  selected: boolean;
}

const Preview = ({
  config,
  onClick,
  selected,
}: PreviewProps) => {
  return (
    <div onClick={onClick} className={selected ? 'Preview preview-selected' : 'Preview'}>
      <>
        {config.dataUrl && <img src={config.dataUrl} />}
        {config.name}
      </>
    </div>
  );
};

export default Preview;

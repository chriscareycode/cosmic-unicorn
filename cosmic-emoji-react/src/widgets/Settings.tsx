import { useState } from "react";
// import { h, render } from 'preact';
// import { useEffect, useState } from 'preact/hooks';

import { UnicornType } from "../types/paint";

import './Settings.css';

interface SettingsProps {
  unicornConfigs: UnicornType[];
  setUnicornConfigs: React.Dispatch<React.SetStateAction<UnicornType[]>>;
}

const Settings = ({
  unicornConfigs,
  setUnicornConfigs,
}: SettingsProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const loop = unicornConfigs.map((uc, i) => {
    return (
      <div>
        
        {uc.name} <input type="text" value={uc.name} /><br />
        {uc.ip} <input type="text" value={uc.ip} /><br />
        {uc.type} <input type="text" value={uc.type} /><br />
        <br />
      </div>
    );
  });

  return (
    <div className="Settings">
      Settings
      <button onClick={() => setIsOpen(true)}>Open</button><br />
      
      {isOpen && (
        <div className="settings-open">
          Settings
          <button onClick={() => setIsOpen(false)}>Close</button>
          <br />
          <br />
          {loop}
        </div>
      )}
    </div>
  );
};

export default Settings;
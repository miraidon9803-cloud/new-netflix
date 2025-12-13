import React, { useState } from 'react';

interface ToggleDropdownProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  options: { [key: string]: string };
}

const ToggleDropdown: React.FC<ToggleDropdownProps> = ({ label, value, onChange, options }) => {
  const [open, setOpen] = useState(false); // 드롭다운 열기/닫기 상태

  return (
    <div className="toggle-dropdown-wrap">
      <span>{label}</span>
      <button
        type="button"
        className={`toggle-btn ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {value}
        <span className={`arrow ${open ? "open" : ""}`}>▾</span>
      </button>

      {open && (
        <ul className="dropdown-list">
          {Object.entries(options).map(([key, label]) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => {
                  onChange(key); // 새로운 값으로 상태 변경
                  setOpen(false); // 드롭다운 닫기
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToggleDropdown;
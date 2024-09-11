// components/ui/checkbox.tsx
import React, { useState } from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleChange = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="h-5 w-5 text-blue-500 rounded"
      />
    </div>
  );
};
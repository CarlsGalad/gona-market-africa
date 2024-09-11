// components/ManualLocationInput.tsx
import React, { useState } from 'react';

interface ManualLocationInputProps {
  onLocationSubmit: (location: string, state: string) => void;
}

export const ManualLocationInput: React.FC<ManualLocationInputProps> = ({ onLocationSubmit }) => {
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLocationSubmit(location, state);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter your city"
        required
      />
      <input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="Enter your state"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

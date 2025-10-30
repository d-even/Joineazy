import React from 'react';

export default function ProgressBar({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="pb-root" aria-hidden>
      <div className="pb-track">
        <div className="pb-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

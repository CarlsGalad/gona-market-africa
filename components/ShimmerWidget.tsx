import React from 'react';

interface ShimmerWidgetProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  count?: number;
}

const ShimmerWidget: React.FC<ShimmerWidgetProps> = ({
  width = '100%',
  height = '100%',
  borderRadius = '4px',
  className = '',
  count = 1,
}) => {
  return (
    <div className={`shimmer-container ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`shimmer shimmer-animation`}
          style={{
            width,
            height,
            borderRadius,
          }}
        ></div>
      ))}
    </div>
  );
};

export default ShimmerWidget;
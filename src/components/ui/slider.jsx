import React from 'react';
import { cn } from '../../lib/utils';

const Slider = React.forwardRef(({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    onValueChange([newValue]);
  };

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
        {...props}
      />
    </div>
  );
});
Slider.displayName = "Slider";

export { Slider };
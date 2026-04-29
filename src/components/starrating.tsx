import { useState } from "react";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function StarRating({ value, onChange }: Props) {
  const [hover, setHover] = useState(0);

  return (
    <div
      className="flex gap-2"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          className={`cursor-pointer text-2xl transition-transform ${
            star <= (hover > 0 ? hover : value)
              ? "text-yellow-400 scale-110"
              : "text-gray-400"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
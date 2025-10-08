"use client";
import React from "react";

type Props = {
  name: string | undefined | null;
  size?: number; // px
  className?: string;
};

function getInitials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const InitialsAvatar: React.FC<Props> = ({ name, size = 40, className }) => {
  const initials = getInitials(name || undefined);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={name ? `${name} avatar` : "avatar"}
   >
      <rect width="40" height="40" rx="8" fill="#006AFF" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#FFFFFF"
        fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'"
      >
        {initials}
      </text>
    </svg>
  );
};

export default InitialsAvatar;

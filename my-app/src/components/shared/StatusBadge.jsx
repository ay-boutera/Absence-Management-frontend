// Simple StatusBadge component
export default function StatusBadge({ status }) {
  const color =
    status === "active"
      ? "#16a34a"
      : status === "disabled"
        ? "#b91c1c"
        : "#64748b";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 12,
        background: color + "22",
        color,
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      {status}
    </span>
  );
}

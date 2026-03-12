// Simple EmptyState component
export default function EmptyState({ message = "Nothing to show." }) {
  return (
    <div style={{ textAlign: "center", color: "#64748b", padding: 24 }}>
      <p>{message}</p>
    </div>
  );
}

export default function ImportButton({ icon, title, description, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`import-option-card ${isSelected ? "selected" : ""}`}
    >
      <div className="import-option-header">
        <span className="import-option-icon">{icon}</span>
        <h3 className="import-option-title">{title}</h3>
      </div>
      <p className="import-option-desc">{description}</p>
    </div>
  );
}
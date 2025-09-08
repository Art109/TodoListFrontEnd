import { PRIORITY_OPTIONS } from "../constants/priorities";

interface PriorityDropdownProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

function PriorityDropdown({
  value,
  onChange,
  className = "",
}: PriorityDropdownProps) {
  const selectedPriority =
    PRIORITY_OPTIONS.find((option) => option.value === value) ||
    PRIORITY_OPTIONS[0];

  return (
    <div className={`priority-dropdown-container ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="priority-dropdown-select"
        style={{
          backgroundColor: selectedPriority.bgColor,
          color: selectedPriority.textColor,
          borderLeft: `4px solid ${selectedPriority.color}`,
        }}
      >
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="dropdown-arrow">▼</div>
    </div>
  );
}

export default PriorityDropdown;

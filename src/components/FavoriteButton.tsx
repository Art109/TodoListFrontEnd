interface FavoriteButtonProps {
  isFavorite: boolean;
  onChange: (isFavorite: boolean) => void;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

function FavoriteButton({
  isFavorite,
  onChange,
  size = 24,
  className = "",
  ariaLabel,
}: FavoriteButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(!isFavorite);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onChange(!isFavorite);
    }
  };

  // Se ariaLabel não for fornecido, usa um padrão baseado no estado
  const defaultAriaLabel = isFavorite
    ? "Remover dos favoritos"
    : "Adicionar aos favoritos";

  return (
    <button
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      className={`favorite-btn ${className}`}
      aria-label={ariaLabel || defaultAriaLabel}
      title={isFavorite ? "Remover favorito" : "Adicionar favorito"}
      style={{
        width: size + 16,
        height: size + 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      tabIndex={0}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={isFavorite ? "#FFD700" : "none"}
        stroke={isFavorite ? "none" : "#666"}
        strokeWidth="1.5"
        aria-hidden="true" // O SVG é decorativo, o texto já está no botão
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </button>
  );
}

export default FavoriteButton;

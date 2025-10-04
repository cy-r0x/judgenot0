/**
 * Button Component - Reusable button with icon support
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Button label text
 * @param {React.ReactNode} [props.icon] - Optional icon element
 * @param {Function} [props.onClick] - Click handler function
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {string} [props.bgColor] - Custom background color class
 * @param {string} [props.hoverColor] - Custom hover color class
 * @param {string} [props.type="button"] - Button type attribute
 * @returns {JSX.Element} Styled button component
 *
 * @example
 * <Button name="Submit" onClick={handleSubmit} />
 * <Button name="Create" icon={<MdCreate />} onClick={handleCreate} />
 */
function Button({
  name,
  icon,
  onClick,
  disabled = false,
  bgColor,
  hoverColor,
  type = "button",
}) {
  const buttonClasses = `px-4 py-2 rounded-sm active:scale-95 cursor-pointer font-semibold 
    ${bgColor || "bg-orange-500"} 
    ${hoverColor || "hover:bg-orange-600"}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    transition-all duration-200`;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={name}
    >
      <div className="flex gap-2 items-center justify-center">
        {icon}
        <span>{name}</span>
      </div>
    </button>
  );
}

export default Button;

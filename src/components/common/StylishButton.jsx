import { Button } from "antd";

// New component for reusable stylish buttons
const StylishButton = ({ 
  children, 
  type = 'default', 
  icon, 
  onClick, 
  block, 
  disabled,
  size = 'middle'
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      block={block}
      size={size}
      icon={icon}
      className={`stylish-button ${type}-button`}
    >
      {children}
    </Button>
  );
}; 

export default StylishButton;
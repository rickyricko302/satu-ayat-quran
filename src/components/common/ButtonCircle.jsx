import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ButtonCircle = ({
  onClick,
  children,
  extraClass,
  tooltipText,
  ...props
}) => (
  <OverlayTrigger
    overlay={<Tooltip>{tooltipText}</Tooltip>}
    placement="top"
    delay={{ show: 0, hide: 400 }}
  >
    <button
      className={`btn circle-button bg-success ${extraClass}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  </OverlayTrigger>
);

export default ButtonCircle;

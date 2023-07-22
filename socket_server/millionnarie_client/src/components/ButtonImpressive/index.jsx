import React from "react";
import classnames from "classnames";

import styles from "./styles.module.scss";

const ButtonImpressive = ({
  children,
  icon,
  disable,
  className,
  onClick = () => {},
}) => {
  return (
    <div
      className={classnames(styles.button, styles.blue, className)}
      style={{
        boxShadow: "none !important",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ButtonImpressive;

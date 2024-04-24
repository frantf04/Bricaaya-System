import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../../css/Link.module.css";
function Link({ text = "link", url = "/", icon, child, children, onClick}) {
  const toggleActive = (e) => {
    e.target.classList.toggle('open')
  };
  return child ? (
    <span onClick={toggleActive} className={styles.link}>
      {icon} {text}
      {child ? <span className="children">{children}</span> : null}
    </span>
  ) : (
    <NavLink className={styles.link} to={url} onClick={onClick}>
      {icon} {text}
      {child ? <span className="children">{children}</span> : null}
    </NavLink>
  );
}
export default Link;

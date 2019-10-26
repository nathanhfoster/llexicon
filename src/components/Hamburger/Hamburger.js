import React, { PureComponent } from "react";
import "./styles.css";

class Hamburger extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { onClick, collapsed } = this.props;
    const collapseClass = collapsed ? "navbar-toggle collapsed" : "navbar-toggle";
    return (
      <button type="button" class={collapseClass} onClick={onClick}>
        <span class="icon-bar top-bar" />
        <span class="icon-bar middle-bar" />
        <span class="icon-bar bottom-bar" />
      </button>
    );
  }
}

export default Hamburger;

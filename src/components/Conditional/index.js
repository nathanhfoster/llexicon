import React, { PureComponent } from "react";

class Conditional extends PureComponent {
  render() {
    const { children, condition, ...restOfProps } = this.props;
    if (!this.props.condition) return null;
    return <div {...restOfProps}>{this.props.children}</div>;
  }
}

export default Conditional;

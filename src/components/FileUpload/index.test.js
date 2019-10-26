import React from "react";
import { expect } from "chai";
import { shallow, mount, render } from "enzyme";
import sinon from "sinon";
import Template from "./index";
import { Container, Row, Col } from "reactstrap";
import { getState } from "../../store/persist";
import storeFactory from "../../store";
const initialState = getState();
const ReduxStore = storeFactory(initialState);

describe("<Template />", () => {
  it("renders <Template /> with <Container />, <Row />, and <Col /> components", () => {
    const wrapper = mount(<Template store={ReduxStore} />);
    expect(wrapper.find(Container)).to.have.lengthOf(1);
    expect(wrapper.find(Row)).to.have.lengthOf(1);
    expect(wrapper.find(Col)).to.have.lengthOf(1);
  });

  it("renders text 'Template'", () => {
    const wrapper = shallow(<Template store={ReduxStore} />);
    expect(wrapper.find("Template")).to.have.lengthOf(1);
  });

  // it("renders children when passed in", () => {
  //   const wrapper = shallow(
  //     <Template>
  //       <div className="unique" />
  //     </Template>
  //   );
  //   expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  // });

  // it("simulates click events", () => {
  //   const onButtonClick = sinon.spy();
  //   const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
  //   wrapper.find("button").simulate("click");
  //   expect(onButtonClick).to.have.property("callCount", 1);
  // });
});

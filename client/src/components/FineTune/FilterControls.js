import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Knob from 'react-canvas-knob';
import AttrSlider from "../AttrSlider";


const FilterControls = props => {
  const handleChange = (newValue, num) => {
    return 0
    // this.setState({['value'+num]: newValue});
  };
  return (
    <div>
      <Knob
        value={0}
        onChange={e => handleChange(e, 1)}
        bgColor="black"
        fgColor="#1756fe"
      />
      <Knob value={0} onChange={e => handleChange(e, 2)} />
      <Knob value={0} onChange={e => handleChange(e, 3)} />
      <Knob value={0} onChange={e => handleChange(e, 3)} />
      <AttrSlider
        name="duration"
        id="dur"
        min={60000}
        max={1800000}
        step={5000}
      />
      <AttrSlider name="signature" id="sig" min={1} max={13} step={1} />
      <AttrSlider name="key" id="key" min={0} max={11} step={1} />
      <AttrSlider name="speechiness" id="sp" min={0.0} max={1.0} step={0.01} />
    </div>
  );
};

export default withRouter(FilterControls);

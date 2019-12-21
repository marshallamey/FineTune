import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  FormGroup, Label, Input, Popover, PopoverBody, PopoverHeader,
} from 'reactstrap';
import Slider from 'rc-slider';
import AttrDesc from '../js/AttrDesc';
import {
  getTipFormatter, onRangeChange, onSliderChange, togglePopover, toggleAttr,
  capitalize, millisToMinutesAndSeconds, convertKey,
} from '../js/Helpers';
import * as actions from '../actions';
import '../css/MusicSearchForm.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'rc-slider/assets/index.css';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const AttrSlider = (props) => {
  const {
    id, attributes, name, min, max, step, popovers,
  } = props;

  const rangeSlider = (
    <Range
      tipFormatter={value => getTipFormatter(id, value)}
      className={name}
      min={min}
      max={max}
      step={step}
      value={[attributes[`min_${name}`], attributes[`max_${name}`]]}
      onChange={event => onRangeChange(props, name, event)}
    />
  );

  const singleSlider = (
    <Slider
      className={name}
      min={min}
      max={max}
      step={step}
      value={attributes[`target_${name}`]}
      disabled={attributes[`${name}Disabled`]}
      marks={id === 'mode' ? { 0: 'Minor', 1: 'Major' } : {}}
      onChange={event => onSliderChange(props, name, event)}
    />
  );

  let output;
  let slider = rangeSlider;
  switch (id) {
    case 'dur':
      output = `${millisToMinutesAndSeconds(attributes.min_duration)} to ${millisToMinutesAndSeconds(attributes.max_duration)}`;
      break;
    case 'loud':
      output = `${attributes.min_loudness} dB to ${attributes.max_loudness} dB`;
      break;
    case 'temp':
      output = `${attributes.min_tempo} to ${attributes.max_tempo} bpm`;
      break;
    case 'key':
      output = convertKey(attributes.target_key);
      slider = singleSlider;
      break;
    case 'mode':
      output = '';
      slider = singleSlider;
      break;
    case 'sig':
      output = `${attributes.target_signature} beats per measure`;
      slider = singleSlider;
      break;
    case 'pop':
      output = `${Math.floor(attributes[`min_${name}`])} to ${Math.floor(attributes[`max_${name}`])}`;
      break;
    default:
      output = `${Math.floor(attributes[`min_${name}`] * 100)} to ${Math.floor(attributes[`max_${name}`] * 100)}`;
  }

  return (
    <FormGroup>
      {
        id === 'sig' || id === 'key' || id === 'mode'
          ? <Input type="checkbox" onChange={() => toggleAttr(props, name)} /> : ''
      }
      <Label for={name}>
        {id === 'sig' ? `Time ${capitalize(name)}` : `${capitalize(name)}`}
      </Label>
      <i
        className="help far fa-question-circle"
        role="button"
        id={`${id}Popover`}
        onClick={() => togglePopover(props, id)}
        onKeyPress={() => togglePopover(props, id)}
        tabIndex={0}
      />
      <Popover
        placement="auto"
        isOpen={popovers[`${id}PopoverOpen`]}
        target={`${id}Popover`}
        toggle={() => togglePopover(props, id)}
      >
        <PopoverHeader>{ name }</PopoverHeader>
        <PopoverBody>{ AttrDesc[id].description }</PopoverBody>
      </Popover>
      { slider }
      <output htmlFor={name}>{ output }</output>
    </FormGroup>
  );
};

AttrSlider.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  attributes: PropTypes.shape({}).isRequired,
  popovers: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  attributes: state.attributes,
  popovers: state.popovers,
});

export default connect(mapStateToProps, actions)(AttrSlider);

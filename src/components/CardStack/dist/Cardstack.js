"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var equalsZero = function equalsZero(num) {
  return num === 0;
};

var errorMessage = 'CardStack component must have at least two child Card components. Please check the children of this CardStack instance.';

var CardStack =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(CardStack, _React$Component);

  function CardStack(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    var children = props.children,
        height = props.height,
        initialCard = props.initialCard;
    var childrenLength = children.length || 1;
    var headerHeight = height / childrenLength;
    if (childrenLength <= 1) throw new Error(errorMessage);
    _this.initialTopOffsets = props.children.map(function (child, i) {
      return equalsZero(i) ? 0 : headerHeight * i;
    });
    _this.state = {
      topOffsets: _this.initialTopOffsets,
      cardSelected: false
    };
    return _this;
  }

  var _proto = CardStack.prototype;

  _proto.componentWillMount = function componentWillMount() {
    if (this.props.initialCard >= this.props.children.length) console.warn('prop "initialCard" cannot be equal or greater than children.length');else if (this.props.initialCard >= 0) this.handleCardClick(this.props.initialCard);
  };

  _proto.handleCardClick = function handleCardClick(id, cb) {
    var _this2 = this;

    var initialState = {
      topOffsets: [],
      cardSelected: true
    };
    var cardSelected = this.state.cardSelected;

    var nextState = function nextState(prev, offset, index) {
      var newOffset = index === id ? 0 : _this2.props.height;
      return {
        cardSelected: !cardSelected,
        topOffsets: prev.topOffsets.concat([cardSelected ? _this2.initialTopOffsets[index] : newOffset])
      };
    };

    this.setState(this.state.topOffsets.reduce(nextState, initialState));
    if (cb) cb(this.state.cardSelected, id);
  };

  _proto.renderCards = function renderCards() {
    var _this3 = this;

    var cloneCard = function cloneCard(child, i) {
      return _react.default.cloneElement(child, {
        key: i,
        cardId: i,
        hoverOffset: _this3.props.hoverOffset,
        cardSelected: _this3.state.cardSelected,
        height: _this3.props.height,
        topOffset: _this3.state.topOffsets[i],
        onClick: _this3.handleCardClick.bind(_this3)
      });
    };

    return this.props.children.map(cloneCard);
  };

  _proto.render = function render() {
    var stackStyles = _extends({}, styles, {
      background: this.props.background,
      height: this.props.height,
      width: this.props.width
    });

    return _react.default.createElement("ul", {
      style: stackStyles
    }, this.renderCards());
  };

  return CardStack;
}(_react.default.Component);

var styles = {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  padding: 0,
  margin: 0
};
CardStack.propTypes = {
  background: _propTypes.default.string,
  height: _propTypes.default.number,
  hoverOffset: _propTypes.default.number,
  width: _propTypes.default.number,
  initialCard: _propTypes.default.number
};
CardStack.defaultProps = {
  width: 350,
  height: 600,
  bgColor: 'f8f8f8',
  hoverOffset: 30,
  initialCard: -1
};
var _default = CardStack;
exports.default = _default;
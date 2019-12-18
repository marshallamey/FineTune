"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var Card =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Card, _React$Component);

  function Card(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      hover: false
    };
    _this.handleMouseEnter = _this.handleMouseEnter.bind(_assertThisInitialized(_this));
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Card.prototype;

  _proto.handleMouseEnter = function handleMouseEnter() {
    this.setState({
      hover: true
    });
  };

  _proto.handleMouseLeave = function handleMouseLeave() {
    this.setState({
      hover: false
    });
  };

  _proto.handleClick = function handleClick() {
    var _props = this.props,
        cardId = _props.cardId,
        cardClicked = _props.cardClicked;
    this.props.onClick(cardId, cardClicked);
    this.setState({
      hover: false
    });
  };

  _proto.render = function render() {
    var _props2 = this.props,
        cardId = _props2.cardId,
        cardSelected = _props2.cardSelected,
        topOffset = _props2.topOffset,
        hoverOffset = _props2.hoverOffset;
    var offset = cardId !== 0 && this.state.hover && !cardSelected ? hoverOffset : 0;
    var transform = "translate3d(0," + (topOffset - offset) + "px,0)";

    var cardStyles = _extends({}, styles, {
      background: this.props.background,
      transform: transform,
      WebkitTransform: transform,
      height: this.props.height
    });

    return _react.default.createElement("li", {
      style: cardStyles,
      onClick: this.handleClick.bind(this),
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave
    }, this.props.children);
  };

  return Card;
}(_react.default.Component);

var styles = {
  position: 'absolute',
  top: 0,
  width: '100%',
  cursor: 'pointer',
  transition: '0.5s transform ease',
  WebkitTransition: '-webkit-transform 0.5s ease'
};
var _default = Card;
exports.default = _default;
/*  Basic Unit */

var React = require('react');
var PropTypes = React.PropTypes;

var Square = React.createClass({
  propTypes: {
    // Determines if it is an blank space, an occupied space, or a block
    blank: PropTypes.number.isRequired
  },

  getDefaultProps: function() {
    return {
      blank: 0
    }
  },

  render: function () {
    var square = 'square-component square';
    switch (this.props.blank) {
      case 0:
        square += ' blank';
        break;
      case 1:
        square += ' occupied';
        break;
      case 2:
        square += ' o';
        break;
      case 3:
        square += ' i';
        break;
      case 4:
        square += ' j';
        break;
      case 5:
        square += ' l';
        break;
      case 6:
        square += ' s';
        break;
      case 7:
        square += ' t';
        break;
      case 8:
        square += ' z';
        break;
    }
    return (<span className={square}></span>);
  }
});

module.exports = Square;

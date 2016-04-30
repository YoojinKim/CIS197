var React = require('react');
var Square = require('./square.jsx');
var PropTypes = React.PropTypes;

var blocks = [
  [ // O
    [2, 2],
    [2, 2]
  ],
  [ // I
    [0, 3, 0, 0],
    [0, 3, 0, 0],
    [0, 3, 0, 0],
    [0, 3, 0, 0]
  ],
  [ // J 
    [4, 0, 0],
    [4, 4, 4],
    [0, 0, 0]
  ],
  [ // L
    [0, 5, 0],
    [0, 5, 0],
    [0, 5, 5]
  ],
  [ // S
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0]
  ],
  [ // T
    [0, 7, 0],
    [7, 7, 7],
    [0, 0, 0]
  ],
  [ // Z
    [8, 8, 0],
    [0, 8, 8],
    [0, 0, 0]
  ]
];

function initialBoard (rows, columns) {
  var board = new Array(rows);
  for (var i = 0; i < rows; i++) {
    board[i] = new Array(columns);
    for (var j = 0; j < columns; j++) {
      board[i][j] = 0;
    }
  }
  return board;
}

var getBlock = function () {
  var selection = Math.floor(Math.random() * blocks.length);
  return blocks[selection];
};

function mergeBlock (board, block, pos) {
  var merged = []
  for (var i = 0; i < board.length; i++) {
    merged.push(board[i].slice(0));
  }

  for (var i = 0; i < block.length; i++) {
    for (var j = 0; j < block[i].length; j++) {
      var y = i + pos[1];
      var x = j + pos[0];
      if (block[i][j] !== 0) {
        merged[y][x] = block[i][j];
      }
    }
  }

  return merged;
};

var filled = function (row) {
  for (var i = 0; i < row.length; i++) {
    if (row[i] === 0) {
        return false;
    }
  }
  return true;
};

var count = 0;
var inspectBoard = function (board, score) {
  var line = Array(board.length);
  var cols  = board[0].length;
  var src = board.length - 1;
  var dst = line.length - 1;

  while (dst >= 0) {
      if (src < 0) {
        line[dst] = Array(cols);
        for (var i = 0; i < cols; i++) {
          line[dst][i] = 0;
        } 
        dst--;
      } else if (filled(board[src])) {
        src--;
        count++;
        console.log(count);
      } else {
        line[dst] = board[src].slice(0);
        dst--;
        src--;
      }
  }
  return line;
};

var Row = React.createClass({
  render: function () {
    var key = 0;
    var squares = this.props.row.map(function (square) {
      return (<Square key={key++} blank={square} />);
    }); 
    return (<div className="row">{squares}</div>);
  }
});

var Tetris = React.createClass({
  propTypes: {
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired
  },

  componentDidMount: function () {
    document.addEventListener("keydown", this.onKeyDown);
    setInterval(this.down, 250);
  },

  onKeyDown: function (event) {
    switch (event.keyCode) {
    // Enter
    case 13: this.startGame(); break;
    // Space Bar
    case 32: this.drop(); break;
    case 37: this.left(); break;
    case 38: this.rotate(); break;
    case 39: this.right(); break;
    case 40: this.down(); break;
    }

  },

  getInitialState: function () {
      return {
        board: initialBoard(this.props.rows, this.props.columns),
        block: getBlock(),
        pos  : [4, 0],
        status: "ready",
      }
  },

  outOfBounds: function (x, y) {
      return (x < 0 || x >= this.props.columns || y < 0 || y >= this.props.rows);
  },

  isValidMove: function (board, block, pos) {
      for (var i = 0; i < block.length; i++) {
        for (var j = 0; j < block[i].length; j++) {
            var y = i + pos[1];
            var x = j + pos[0];
            if (this.outOfBounds(x, y)) {
              if (block[i][j] !== 0) {
                  return false;
              }
            } else {
              if ((board[y][x] !== 0) && (block[i][j] !== 0)) {
                  return false;
              }
            }
        }
      }
      return true;
  },

  down: function () {
    if (this.state.status === "playing") {
        
      var pos = this.state.pos.slice(0);
      pos[1] += 1;
      if (this.isValidMove(this.state.board, this.state.block, pos)) {
        var board = inspectBoard(this.state.board);
        this.setState({board: board, pos: pos, });
      } else {
        var merged = mergeBlock(this.state.board, this.state.block, this.state.pos);
        var block  = getBlock();
        var pos    = [4, 0];
        if (this.isValidMove(merged, block, pos)) {
          this.setState({board: merged, block: block, pos: pos,});
        } else {
          // Player Lost
          this.setState({status: "lost"});
        }
      }
    }
  },

  right: function () {
    var pos = this.state.pos.slice(0);
    pos[0] += 1;
    if (this.isValidMove(this.state.board, this.state.block, pos)) {
        this.setState({pos: pos});
      } 
  },

  left: function () {
    var pos = this.state.pos.slice(0);
    pos[0] -= 1;
    if (this.isValidMove(this.state.board, this.state.block, pos)) {
        this.setState({pos: pos});
      } 
  },

  rotate: function () {
    var len   = this.state.block.length;
      var block = new Array(len);
      for (var i = 0; i < len; i++) {
        block[i] = new Array(len);
      }
      for (var r = 0; r < len; r++) {
        for (var c = 0; c < len; c++) {
            var x = len - r - 1;
            var y = c;
            block[r][c] = this.state.block[y][x];
        }
      }
      if (this.isValidMove(this.state.board, block, this.state.pos)) {
        this.setState({block: block});
      }
  },

  drop: function () {
    var pos = this.state.pos.slice(0);
    while (this.isValidMove(this.state.board, this.state.block, pos)) {
        pos[1] += 1;
      }
      pos[1] -= 1; 
      if (this.isValidMove(this.state.board, this.state.block, pos)) {
        this.setState({pos: pos});
      } 

  },

  startGame: function (e) {
    this.setState({
        board: initialBoard(this.props.rows, this.props.columns),
        block: getBlock(),
        pos  : [4, 0],
        status: "playing",
      })
  },

  render: function () {
    var key = 0;
    var board = this.state.board;
    if (this.state.status === "playing" || this.state.status === "lost") {
      board = mergeBlock(this.state.board, this.state.block, this.state.pos);
    }
   
    var rows = board.map(function (row) {
      return (<Row key={key++} row={row} />);
    });

    var score = "Score: " + count * 10;

    return (
    <div className="game">
    <div class="row">
    <div class="col-sm-8">
    <div className="board">{rows}</div>
    </div>
    <div class="col-sm-4">
    <div className="score">{score}</div>
    </div>
    </div>
    </div>
    );
  }
});

module.exports = Tetris;
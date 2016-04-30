var React = require('react');
var ReactDOM = require('react-dom');
var Tetris = require('./tetris.jsx');

var rows = 20;
var columns = 10;

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <Tetris rows={rows} columns={columns}/>,
    document.getElementById('tetris')
  );  
});

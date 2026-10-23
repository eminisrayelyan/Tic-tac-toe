const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: '*' } });
const players = { X: null, O: null };
const emptyBoard = () => Object.fromEntries(
  Array.from({ length: 9 }, (_, i) => [String(i + 1), ''])
);
let board = emptyBoard();
let nextSign = 'X';
let winner = null;
let refreshTimer = null;
const winningLines = [
  ['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'],
  ['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9'],
  ['1', '5', '9'], ['3', '5', '7'],
];

function sendBoard() {
  io.emit('updateBoard', {
    board, nextSign, winner,
    ready: Boolean(players.X && players.O),
  });
}

io.on('connection', (socket) => {
  const sign = !players.X ? 'X' : !players.O ? 'O' : null;
  if (sign) players[sign] = socket.id;
  socket.emit('playerSign', sign);
  sendBoard();

  socket.on('makeMove', (id) => {
    if (!sign || players[sign] !== socket.id || sign !== nextSign ||
        !players.X || !players.O || winner ||
        typeof id !== 'string' || !Object.hasOwn(board, id) || board[id]) {
      return;
    }
    players
    board[id] = sign;
    if (winningLines.some(line => line.every(cell => board[cell] === sign))) {
      winner = sign;
    } else if (Object.values(board).every(Boolean)) {
      winner = 'draw';
    }
    nextSign = sign === 'X' ? 'O' : 'X';
    sendBoard();
    if (winner) {
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        board = emptyBoard();
        nextSign = 'X';
        winner = null;
        sendBoard();
        io.emit('refreshGame');
      }, 5000);
    }
  });

  socket.on('disconnect', () => {
    if (sign && players[sign] === socket.id) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
      players[sign] = null;
      board = emptyBoard();
      nextSign = 'X';
      winner = null;
      sendBoard();
    }
  });
});

httpServer.listen(3000);

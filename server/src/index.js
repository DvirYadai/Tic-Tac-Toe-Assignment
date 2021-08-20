const app = require("./app");
const Game = require("./classes/Game");
const PORT = process.env.PORT || 3001;
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

let sockets = [];
let game;
let playAgainArr = [];

// fired when player connect
io.on("connection", (socket) => {
  console.log(socket.id);
  sockets.push(socket.id);

  // prevent from third player (and so on) to enter the game.
  if (io.engine.clientsCount > 2) {
    socket.emit("socket limit", { message: "reach the limit of connections" });
    return;
  }

  // check if this is the first player or the second that entered the game.
  if (io.engine.clientsCount === 1) {
    socket.emit("first player", { message: "player 1" });
  } else {
    socket.emit("second player");
  }

  // game is fired when second player entered the game
  socket.on("player 2 entered", () => {
    game = new Game(sockets[0], sockets[1]);
    io.emit("game start", game);
  });

  // fired when player make a move
  socket.on("player move", (data) => {
    const indexesArr = [data.firstIndex, data.secondIndex];
    const message = game.makeOneMove(data.symbol, indexesArr);
    if (message === "this is illegal move, try again!") {
      socket.emit("illegal move", { message });
    } else if (message === game.players[0] || message === game.players[1]) {
      io.emit("player win", { message, game });
    } else {
      io.emit("next turn", game);
    }
  });

  // fired when player click play again button
  socket.on("play again", () => {
    playAgainArr.push(socket.id);
    if (playAgainArr.length === 2) {
      game.resetGame();
      io.emit("new game", game);
      playAgainArr = [];
      return;
    }
    socket.emit("wait for player", { message: "Wait for other player..." });
  });

  // fired when player disconnect
  socket.on("disconnect", () => {
    console.log(`user has disconnected`);
    sockets = sockets.filter((socketID) => socketID !== socket.id);
    socket.broadcast.emit("other player disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = server;

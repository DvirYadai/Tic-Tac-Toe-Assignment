const Board = require("./Board");

class Game {
  board = new Board();
  players = [];
  playerTurn;
  isWin = false;
  winningCount = {};
  constructor(player1, player2) {
    this.players.push(player1);
    this.players.push(player2);
    this.winningCount[player1] = { wins: 0 };
    this.winningCount[player2] = { wins: 0 };
    this.#whichPlayerStartRandomly();
  }

  #whichPlayerStartRandomly() {
    if (Math.floor(Math.random() * 2 + 1) === 1) {
      this.playerTurn = this.players[0];
    } else {
      this.playerTurn = this.players[1];
    }
  }

  #playerWin(player) {
    this.isWin = true;
    this.winningCount[player].wins = this.winningCount[player].wins + 1;
  }

  makeOneMove(symbol, place) {
    const message = this.board.makeMove(symbol, place);
    if (message === "illegal move") {
      return "this is illegal move, try again!";
    } else if (message === "win") {
      this.#playerWin(this.playerTurn);
      return this.playerTurn;
    } else {
      this.playerTurn = this.players.filter(
        (player) => player !== this.playerTurn
      )[0];
    }
  }

  resetGame() {
    this.#whichPlayerStartRandomly();
    this.isWin = false;
    this.board.resetBoard();
  }
}

module.exports = Game;

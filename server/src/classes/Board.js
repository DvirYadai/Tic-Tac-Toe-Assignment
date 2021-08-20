class Board {
  boardArr = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  #isMoveLegal(place) {
    if (this.boardArr[place[0]][place[1]] !== null) {
      return "illegal move";
    }
  }

  #isWin() {
    if (
      this.boardArr[0][0] !== null &&
      this.boardArr[0][0] === this.boardArr[1][0] &&
      this.boardArr[0][0] === this.boardArr[2][0]
    ) {
      return "win";
    } else if (
      this.boardArr[0][1] !== null &&
      this.boardArr[0][1] === this.boardArr[1][1] &&
      this.boardArr[0][1] === this.boardArr[2][1]
    ) {
      return "win";
    } else if (
      this.boardArr[0][2] !== null &&
      this.boardArr[0][2] === this.boardArr[1][2] &&
      this.boardArr[0][2] === this.boardArr[2][2]
    ) {
      return "win";
    } else if (
      this.boardArr[0].every((value) => value === "X") ||
      this.boardArr[0].every((value) => value === "O")
    ) {
      return "win";
    } else if (
      this.boardArr[1].every((value) => value === "X") ||
      this.boardArr[1].every((value) => value === "O")
    ) {
      return "win";
    } else if (
      this.boardArr[2].every((value) => value === "X") ||
      this.boardArr[2].every((value) => value === "O")
    ) {
      return "win";
    } else if (
      this.boardArr[0][0] !== null &&
      this.boardArr[0][0] === this.boardArr[1][1] &&
      this.boardArr[0][0] === this.boardArr[2][2]
    ) {
      return "win";
    } else if (
      this.boardArr[0][2] !== null &&
      this.boardArr[0][2] === this.boardArr[1][1] &&
      this.boardArr[0][2] === this.boardArr[2][0]
    ) {
      return "win";
    }
  }

  makeMove(symbol, place) {
    let message;
    message = this.#isMoveLegal(place);
    if (message) return message;
    this.boardArr[place[0]][place[1]] = symbol;
    message = this.#isWin();
    if (message) return message;
  }

  resetBoard() {
    this.boardArr = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }
}

module.exports = Board;

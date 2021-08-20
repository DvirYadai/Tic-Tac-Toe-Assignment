import React from "react";
import TableRow from "./TableRow";

const Board = ({ game, symbol, socket }) => {
  return (
    <div>
      <table>
        <tbody>
          {game &&
            game.board.boardArr.map((row, i) => (
              <TableRow
                rowArr={row}
                id={i}
                key={i}
                symbol={symbol}
                game={game}
                socket={socket}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Board;

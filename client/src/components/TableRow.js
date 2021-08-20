import React, { useEffect } from "react";

const TableRow = ({ rowArr, id, symbol, game, socket }) => {
  const makeMove = (e) => {
    // send player move to the server
    socket.emit("player move", {
      firstIndex: id,
      secondIndex: e.target.id,
      symbol,
    });
  };

  return (
    <tr id={id}>
      {rowArr.map((symbol, i) => (
        <td
          id={i}
          key={i}
          onClick={
            game.isWin === true
              ? null
              : game.playerTurn === socket.id
              ? (e) => makeMove(e)
              : () => alert("This isn't your turn!")
          }
        >
          {symbol === null ? "" : symbol}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;

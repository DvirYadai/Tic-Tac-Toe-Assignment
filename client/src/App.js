import "./App.css";
import socket from "./socketConfig";
import Board from "./components/Board";
import { useEffect, useState } from "react";

function App() {
  const [socketMessage, setSocketMessage] = useState("");
  const [game, setGame] = useState();
  const [symbol, setSymbol] = useState("");

  useEffect(() => {
    // fired when this client is the third player or more.
    socket.on("socket limit", (data) => {
      setSocketMessage(data.message);
    });

    // fired when this client is the first player to enter
    socket.on("first player", (data) => {
      setSocketMessage(data.message);
    });

    // fired when this client is the second player to enter
    socket.on("second player", () => {
      setSocketMessage("");
      socket.emit("player 2 entered");
    });

    // fired when game start (after 2 players enter the game)
    socket.on("game start", (gameObj) => {
      setSymbol(gameObj.playerTurn === socket.id ? "X" : "O");
      setGame(gameObj);
      setSocketMessage("");
    });

    // fired when one of two players that playing is disconnecting
    socket.on("other player disconnected", () => {
      setSocketMessage("player 1");
    });

    // fired when player make illegal move
    socket.on("illegal move", (data) => {
      alert(data.message);
    });

    // fired when player win
    socket.on("player win", (data) => {
      alert(data.message === socket.id ? "You win! :)" : "You lost! :(");
      setGame(data.game);
    });

    // fired when server approve client move and switch the turn
    socket.on("next turn", (game) => {
      setGame(game);
    });

    // fired when this client is the first to click the play again button
    socket.on("wait for player", (data) => {
      alert(data.message);
    });

    // fired when the second client click the play again button
    socket.on("new game", (gameObj) => {
      setSymbol(gameObj.playerTurn === socket.id ? "X" : "O");
      setGame(gameObj);
    });

    // cleaning up the socket
    return () => {
      socket.close();
    };
  }, []);

  const playAgainButton = () => {
    socket.emit("play again");
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      {socketMessage === "reach the limit of connections" ? (
        <h2>There are 2 players playing, please wait</h2>
      ) : socketMessage === "player 1" ? (
        <h2>Please wait for another player to join...</h2>
      ) : (
        <>
          {game && (
            <>
              {game.isWin === true ? (
                <button onClick={() => playAgainButton()}>Play again?</button>
              ) : null}
              <h2>
                {game.playerTurn === game.players[0]
                  ? "Player Turn: Player 1"
                  : "Player Turn: Player 2"}
              </h2>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <div>
                  <h3>
                    {socket.id === game.players[0]
                      ? "You are: Player 1"
                      : "You are: Player 2"}
                  </h3>
                  <h4>{"wins: " + game.winningCount[socket.id].wins}</h4>
                </div>
                <Board game={game} symbol={symbol} socket={socket} />
                <div>
                  <h3>
                    {socket.id === game.players[0] ? "Player 2" : "Player 1"}
                  </h3>
                  <h4>
                    {socket.id === game.players[0]
                      ? "wins: " + game.winningCount[game.players[1]].wins
                      : "wins: " + game.winningCount[game.players[0]].wins}
                  </h4>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;

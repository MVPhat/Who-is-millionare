const chalk = require("chalk");
const { clientNames } = require("../state");
const path = require("path");
const rawData = require(path.join(path.resolve(), "uploads/", "data.json"));

let curQuestion = null;

let data = [];

const getRandomQuestion = () => {
  const randomQuestion = Math.floor(Math.random() * data.length);

  curQuestion = data[randomQuestion];
  console.log(data.length, randomQuestion);

  data.splice(randomQuestion, 1);
  // console.log(curQuestion, data.length, randomQuestion)
  return {
    question: curQuestion.question,
    answers: curQuestion.ans,
    url: curQuestion.url,
  };
};

const checkIfWinner = () => {
  return clientNames.length === 1 || data.length === 0;
};

const sendQuestionToSingleClient = (order, notChange = false) => {
  if (clientNames.length === 1) {
    global.__io.in(clientNames[0]).emit("server:endGame");
    clientNames.splice(0, clientNames.length);
  } else {
    clientNames.forEach((name) => {
      if (name === order) {
        global.__io.in("client_" + order).emit(
          "server:sendQuestion",
          notChange
            ? {
                question: curQuestion.question,
                answers: curQuestion.ans,
                url: curQuestion.url,
              }
            : getRandomQuestion()
        );
      } else {
        global.__io.in("client_" + name).emit("server:waitingNextQuestion", {
          curClient: clientNames.indexOf(order),
          curName: order,
        });
      }
    });
  }
};

const findNextClient = (curName) => {
  const curClient = clientNames.indexOf(curName);
  const nextClient = curClient === clientNames.length - 1 ? 0 : curClient + 1;
  return clientNames[nextClient];
};

class SocketService {
  connection(socket) {
    socket.on("ping", () => {
      socket.emit("pong");
    });
    socket.on("disconnect", async () => {
      console.log(chalk.bgRed("[DISCONNECT]"), socket.role, socket.id);
      if (socket.role) {
        if (socket.role.slice(0, 6) === "client") {
          clientNames.splice(clientNames.indexOf(socket.role.slice(7)), 1);

          console.log(clientNames);
        }
      }
      global.__io
        .fetchSockets()
        .then((sockets) => {
          console.log(chalk.yellow("# connecting socket: " + sockets.length));
        })
        .catch((err) =>
          console.log(chalk.red("# error connecting socket: " + err))
        );
    });

    socket.on("player:answerQuestion", (msg) => {
      const curClient = msg.order;
      const nextClient = findNextClient(msg.order);

      if (msg.answer === curQuestion.solution) {
        if (checkIfWinner()) {
          global.__io.in("client_" + curClient).emit("server:endGame");
          clientNames.splice(0, clientNames.length);
          return;
        } else {
          global.__io.in("client_" + curClient).emit("server:answerCorrect");
        }
        sendQuestionToSingleClient(curClient);

      } else {
        global.__io.in("client_" + curClient).emit("server:wrongAnswer");

        clientNames.splice(clientNames.indexOf(msg.order), 1);

        clientNames.forEach((name) => {
          global.__io.in("client_" + name).emit("server:syncData", {
            status: curClient + " failed by answered wrong question",
            clientNames,
          });
        });

        if (checkIfWinner()) {
          global.__io.in("client_" + nextClient).emit("server:endGame");
          clientNames.splice(0, clientNames.length);
          return;
        }
        sendQuestionToSingleClient(nextClient);
      }

      clientNames.forEach((name) => {
        console.log(name, data.length);
        global.__io
          .in("client_" + name)
          .emit("server:numQuestionsLeft", { quesCount: data.length });

        if (data.length === 0) {
          global.__io.in("client_" + name).emit("server:turnOffSkip");
        }
      });
    });

    socket.on("player:timeout", (data) => {
      global.__io.in("client_" + data.name).emit("server:timeout");

      clientNames.splice(clientNames.indexOf(data.name), 1);

      if (checkIfWinner()) {
        global.__io
          .in("client_" + findNextClient(data.name))
          .emit("server:endGame");
      } else {
        sendQuestionToSingleClient(data.name);
      }
    });

    socket.on("player:startGame", () => {
      clientNames.forEach((name) => {
        global.__io.in("client_" + name).emit("server:syncData", {
          clientNames,
          status: "All players are already connected",
        });
      });

      data = [...rawData.slice(0, process.env.NUM_QUESTION)];

      sendQuestionToSingleClient(clientNames[0]);

      clientNames.forEach((name) => {
        global.__io
          .in("client_" + name)
          .emit("server:numQuestionsLeft", { quesCount: data.length });
      });
    });

    socket.on("player:useSkipRequest", (res) => {
      console.log(res)

      clientNames.forEach((name) => {
        global.__io.in("client_" + name).emit("server:syncData", {
          clientNames,
          status: res.name + " skipped the question to next player",
        });
      });

      if (checkIfWinner()) {
        global.__io.in("client_" + res.name).emit("server:endGame");
        clientNames.splice(0, clientNames.length);
      }

      sendQuestionToSingleClient(findNextClient(res.name), true);

      clientNames.forEach((name) => {
        global.__io
          .in("client_" + name)
          .emit("server:numQuestionsLeft", { quesCount: data.length });
      });
    });

    socket.on("player:validateName", (data, callback) => {
      if (clientNames.includes(data.name)) {
        callback({
          status: data.name + " is already registered",
        });
      } else {
        clientNames.push(data.name);
        socket.role = "client_" + data.name;
        socket.join(socket.role);
        let countLeft = process.env.NUM_CLIENT - clientNames.length;

        callback({
          status: "ok",
          numClientLeft: countLeft,
          order: clientNames.indexOf(data.name),
        });

        clientNames.forEach((name, idx) => {
          global.__io.in("client_" + name).emit("server:numPlayersLeft", {
            count: countLeft,
            order: idx,
          });
        });
      }
      global.__io
        .fetchSockets()
        .then((sockets) => {
          console.log(chalk.red("# connecting socket: " + sockets.length));
        })
        .catch((err) =>
          console.log(chalk.red("# error connecting socket: " + err))
        );
    });
  }
}

module.exports = new SocketService();

const chalk = require("chalk");
const path = require("path");
const rawData = require(path.join(path.resolve(), "./uploads", "data.json"));

let clientNames = [];

let curQuestion = null;

let data = [];

const getRandomQuestion = () => {
  const randomQuestion = Math.floor(Math.random() * data.length);

  curQuestion = data[randomQuestion];

  data.splice(randomQuestion, 1);
  // console.log(curQuestion, data.length, randomQuestion)
  return {
    question: curQuestion.question,
    answers: curQuestion.ans,
    url: curQuestion.url,
    quesLeft: data.length,
  };
};

const checkIfGameEnded = () => {
  return clientNames.length === 1 || data.length === 0;
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const sendQuestionToClient = (order, notChange = false) => {
  if (clientNames.length === 1) {
    global.__io.in(clientNames[0]).emit("server:winner");
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
                quesLeft: data.length,
              }
            : getRandomQuestion()
        );
      } else {
        global.__io.in("client_" + name).emit("server:waitingForQuestion", {
          curClient: clientNames.indexOf(order),
          curName: order,
        });
      }
    });
  }
};

const getNextClient = (curName) => {
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

    socket.on("client:sendAnswer", (msg) => {
      const curClient = msg.order;

      if (data.length === 1) {
        global.__io.in("client_" + curClient).emit("server:winner");
        clientNames.splice(0, clientNames.length);
        clientNames = [];
      } else {
        const nextClient = getNextClient(msg.order);

        if (msg.answer === curQuestion.solution) {
          //   if (checkIfGameEnded()) {
          //     global.__io.in("client_" + curClient).emit("server:winner");
          //     clientNames.splice(0, clientNames.length);
          //     return;
          //   } else {
          //   global.__io.in("client_" + curClient).emit("server:correctAnswer");
          //   }
          sendQuestionToClient(curClient);
        } else {
          global.__io.in("client_" + curClient).emit("server:wrongAnswer");

          clientNames.splice(clientNames.indexOf(msg.order), 1);

          clientNames.forEach((name) => {
            global.__io.in("client_" + name).emit("server:updateClient", {
              status: curClient + " failed by answered wrong question",
              clientNames,
            });
          });

          if (checkIfGameEnded()) {
            global.__io.in("client_" + nextClient).emit("server:winner");
            clientNames.splice(0, clientNames.length);
            return;
          }
          sendQuestionToClient(nextClient);
        }

        clientNames.forEach((name) => {
          global.__io
            .in("client_" + name)
            .emit("server:countQuesLeft", { quesCount: data.length });

          if (data.length === 0) {
            global.__io.in("client_" + name).emit("server:turnOffSkip");
          }
        });
      }
    });

    socket.on("client:playGame", () => {
      clientNames = shuffle(clientNames);

      data = [...rawData.slice(0, process.env.NUM_QUESTION)];
      clientNames.forEach((name) => {
        global.__io.in("client_" + name).emit("server:updateClient", {
          clientNames,
          status: "All players are already connected",
          setLength: data.length,
        });
      });

      sendQuestionToClient(clientNames[0]);

      clientNames.forEach((name) => {
        global.__io
          .in("client_" + name)
          .emit("server:countQuesLeft", { quesCount: data.length });
      });
    });

    socket.on("client:skipQuestion", (res) => {
      clientNames.forEach((name) => {
        global.__io.in("client_" + name).emit("server:updateClient", {
          clientNames,
          status: res.name + " skipped the question to next player",
        });
      });

      if (checkIfGameEnded()) {
        global.__io.in("client_" + res.name).emit("server:winner");
        clientNames.splice(0, clientNames.length);
      }

      sendQuestionToClient(getNextClient(res.name), true);

      clientNames.forEach((name) => {
        global.__io
          .in("client_" + name)
          .emit("server:countQuesLeft", { quesCount: data.length });
      });
    });

    socket.on("client:checkPlayerName", (data, callback) => {
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
          global.__io.in("client_" + name).emit("server:countClientLeft", {
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

    // socket.on("client:");
  }
}

module.exports = new SocketService();

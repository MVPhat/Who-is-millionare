import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";

// import Logo from "assets/images/logo.png";
import { Button, FormGroup, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Dot from "../../animations/Dot";
import { socket } from "../../service/socket";

import LoginBg from "../../assets/login_bg.jpg";
import WaitingBg from "../../assets/waiting_bg.png";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const useStyles = makeStyles((theme) => ({
  container: {
    width: 400,
    maxWidth: "80%",
    padding: "24px 36px",
    borderRadius: 6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    // whiteSpace: "nowrap",
    maxHeight: "80vh",
    borderRadius: 20,
    boxShadow: "none",
    // backgroundColor: "white",
  },
  header: {
    color: "#189",
    fontSize: 50,
    // textShadow:
    //   "-1px 1px 0 #72d3e9,-2px 2px 0 #72d3e9,-3px 3px 0 #72d3e9,-4px 4px 0 #72d3e9,-5px 5px 0 #72d3e9,-6px 6px 0 #72d3e9,-7px 7px 0 #72d3e9",
  },
  logo: {
    width: "30%",
  },
  form: {
    width: "100%",
    gap: 20,
    boxShadow: "none !important",
    marginTop: 20,
  },
  btnSubmit: {
    backgroundColor: "black",
  },
}));

const Login = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numClientLeft, setNumClientLeft] = useState(-1);

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    localStorage.setItem("name", name);
    localStorage.setItem("skip", true);
    localStorage.setItem("curClient", 0);

    socket.emit("player:validateName", { name }, (res) => {
      localStorage.setItem("order", res.order);

      if (res.numClientLeft === 0) {
        navigate(`/client/${res.order}`);
        socket.emit("player:startGame");
      } else {
        setNumClientLeft(res.numClientLeft);
        if (res.status === "ok") {
          setIsLoading(true);
        } else {
          setError(res.status);
        }
      }
    });
  };

  useEffect(() => {
    socket.on("server:numPlayersLeft", (data) => {
      if (data.count === 0) {
        setIsLoading(false);
        socket.emit("player:startGame");
        navigate(`/client/${data.order}`);
      } else {
        setNumClientLeft(data.count);
      }
    });

    return () => {
      socket.off("server:numPlayersLeft");
    };
  }, []);

  return (
    <div className={styles.container}>
      <img
        alt="bg"
        src={LoginBg}
        style={{
          width: "120%",
          height: "140%",
          position: "absolute",
          zIndex: -1,
          top: "-20%",
          borderRadius: 40,
        }}
      />
      {!isLoading ? (
        <h2 className={styles.header}>A.T.M.H</h2>
      ) : (
        <img
          src={WaitingBg}
          alt="waiting"
          style={{
            height: "50%",
            width: "50%",
          }}
        />
      )}
      {!isLoading ? (
        <form onSubmit={handleLogin}>
          <FormGroup className={styles.form}>
            <TextField
              id="name"
              label="Your nickname"
              fullWidth
              required
              onChange={handleChangeName}
              value={name}
            />
            {error && <p style={{ color: "red" }}>*{error}</p>}
            <Button
              className={styles.btnSubmit}
              type="submit"
              sx={{ color: "white", fontWeight: "bold" }}
              variant="contained"
              color="warning"
            >
              Ready
            </Button>
          </FormGroup>
        </form>
      ) : (
        <div
          style={{
            boxShadow: "none",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontSize: 20,
          }}
        >
          <p>Invite more player to start the game</p>
          <div
            style={{
              color: "gray",
              border: "1px solid gray",
              borderRadius: 15,
              padding: 10,
              marginTop: 10,
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {`http://${import.meta.env.VITE_SERVER_URL}:3000/`}
            <ContentCopyIcon
              onClick={() => {
                navigator.clipboard.writeText(
                  `http://${import.meta.env.VITE_SERVER_URL}:3000/`
                );

                // Alert the copied text
                alert("Copied");
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginRight: 20,
              gap: 20,
            }}
          >
            <p>
              Slot left:{" "}
              <span
                style={{
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                {numClientLeft}
              </span>
            </p>
            <Dot type="pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

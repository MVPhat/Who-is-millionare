import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";

// import Logo from "assets/images/logo.png";
import { Button, FormGroup, TextField } from "@mui/material";
import { socket } from "../../service/socket";
import { redirect, useNavigate } from "react-router-dom";
import ButtonImpressive from "../../components/ButtonImpressive";
import Dot from "../../animations/Dot";

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
    border: "2px solid #189",
    backgroundColor: "white",
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
  },
  btnSubmit: {},
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

    socket.emit("client:checkPlayerName", { name }, (res) => {
      localStorage.setItem("order", res.order);

      if (res.numClientLeft === 0) {
        navigate(`/questions/${res.order}`);
        socket.emit("client:playGame");
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
    socket.on("server:countClientLeft", (data) => {
      if (data.count === 0) {
        setIsLoading(false);
        socket.emit("client:playGame");
        navigate(`/questions/${data.order}`);
      } else {
        setNumClientLeft(data.count);
      }
    });

    return () => {
      socket.off("server:countClientLeft");
    };
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>M . Game</h2>
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
            <ButtonImpressive onClick={handleLogin}>
              <Button
                className={styles.btnSubmit}
                type="submit"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Ready
              </Button>
            </ButtonImpressive>
          </FormGroup>
        </form>
      ) : (
        <div
          style={{
            boxShadow: "none",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 30,
          }}
        >
          <p>
            Waiting for{" "}
            <span
              style={{
                color: "red",
                fontWeight: "bold",
                fontSize: 24,
              }}
            >
              {numClientLeft}
            </span>{" "}
            more players connecting
          </p>
          <Dot type="pulse" />
        </div>
      )}
    </div>
  );
};

export default Login;

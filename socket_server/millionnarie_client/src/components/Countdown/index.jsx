import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { socket } from "../../service/socket";

const useStyles = makeStyles(() => ({
  container: {
    fontSize: 200,
    margin: 0,
    alignSelf: "center",
  },
}));

const Countdown = ({ type }) => {
  const styles = useStyles();
  const [time, setTime] = useState(import.meta.env.VITE_SERVER_DURATION * 1000);
  const [status, setStatus] = useState(1);
  // -1: stop, 0: pause, 1: start

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (status === 1) {
      let timeInterval = setTimeout(() => {
        if (duration < time) {
          setDuration((prev) => prev + 100);
        } else {
          clearTimeout(timeInterval);
        }
      }, 100);

      if (duration === time) {
        socket.emit("player:timeout", {
          name: localStorage.getItem("name"),
        });
      }

      return () => {
        clearTimeout(timeInterval);
      };
    }
  }, [status, duration]);

  useEffect(() => {
    socket.on("server:set_time", (data) => {
      setTime(data.time);
    });

    socket.on("server:set_status", (data) => {
      setStatus(1);
    });

    return () => {
      socket.off("server:set_time");
      socket.off("server:set_status");
    };
  }, []);

  switch (type) {
    case "process":
      return (
        <div
          style={{
            boxShadow: "none",
            border: "2px solid white",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 10,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className={duration !== time ? "wave" : ""}
            style={{
              height: `calc(1025px - ${(duration / time) * 100}%)`,
            }}
          ></div>
        </div>
      );
    default:
      return <p className={styles.container}>{duration}</p>;
  }
};

export default Countdown;

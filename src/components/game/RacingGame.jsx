import React, { useEffect, useState, useRef } from "react";
import styles from "./Game.module.scss";

const TRACK_WIDTH_RATIO = 0.6; // 60% šířky obrazovky
const CAR_WIDTH_RATIO = 0.1;
const CAR_HEIGHT_RATIO = 0.1;
const OBSTACLE_SIZE_RATIO = 0.1;

export default function RacingGame() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [carX, setCarX] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const gameInterval = useRef(null);
  const obstacleInterval = useRef(null);

  const updateDimensions = () => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const trackWidth = dimensions.width * TRACK_WIDTH_RATIO;
  const trackLeft = (dimensions.width - trackWidth) / 2;
  const carWidth = dimensions.width * CAR_WIDTH_RATIO;
  const carHeight = dimensions.height * CAR_HEIGHT_RATIO;
  const obstacleSize = dimensions.width * OBSTACLE_SIZE_RATIO;
  const carBottom = 5; // vh

  useEffect(() => {
    setCarX(trackLeft + (trackWidth - carWidth) / 2); // centrování auta na začátku
  }, [dimensions]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver) return;
      const step = carWidth * 0.5;

      if (e.key === "ArrowLeft") {
        setCarX((prev) => Math.max(prev - step, trackLeft));
      } else if (e.key === "ArrowRight") {
        setCarX((prev) => Math.min(prev + step, trackLeft + trackWidth - carWidth));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    gameInterval.current = setInterval(() => {
      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, y: obs.y + dimensions.height * 0.01 }))
          .filter((obs) => obs.y < dimensions.height)
      );
      setScore((s) => s + 1);
    }, 30);

    obstacleInterval.current = setInterval(() => {
      const lanes = Math.floor(trackWidth / obstacleSize);
      const randomLane = Math.floor(Math.random() * lanes);
      const newObstacle = {
        x: trackLeft + randomLane * obstacleSize,
        y: -obstacleSize,
        id: Math.random().toString(36).substr(2, 9),
      };
      setObstacles((prev) => [...prev, newObstacle]);
    }, 1000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameInterval.current);
      clearInterval(obstacleInterval.current);
    };
  }, [isGameOver, dimensions]);

  useEffect(() => {
    const carTop = dimensions.height - (carBottom / 100) * dimensions.height - carHeight;

    obstacles.forEach((obs) => {
      const isCollision =
        obs.y + obstacleSize > carTop &&
        obs.y < carTop + carHeight &&
        obs.x < carX + carWidth &&
        obs.x + obstacleSize > carX;

      if (isCollision) {
        setIsGameOver(true);
        clearInterval(gameInterval.current);
        clearInterval(obstacleInterval.current);
      }
    });
  }, [obstacles, carX, dimensions]);

  return (
    <div className={styles.container}>
      <div
        className={styles.track}
        style={{ width: trackWidth, left: trackLeft }}
      />

      <div
        className={styles.car}
        style={{
          width: carWidth,
          height: carHeight,
          left: carX,
          bottom: `${carBottom}vh`,
        }}
      />

      {obstacles.map((obs) => (
        <div
          key={obs.id}
          className={styles.obstacle}
          style={{
            width: obstacleSize,
            height: obstacleSize,
            left: obs.x,
            top: obs.y,
          }}
        />
      ))}

      <div className={styles.score}>Skóre: {score}</div>

      {isGameOver && (
        <div className={styles.gameOver}>
          🏁 Konec hry!<br />
          Skóre: {score}
        </div>
      )}
    </div>
  );
}

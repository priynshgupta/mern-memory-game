import React, { useState, useEffect } from "react";

const cardsData = [
  { id: 1, emoji: "🐶" },
  { id: 2, emoji: "🐱" },
  { id: 3, emoji: "🐭" },
  { id: 4, emoji: "🐰" },
  { id: 5, emoji: "🦊" },
  { id: 6, emoji: "🐻" },
];

function shuffle(array) {
  return array
    .concat(array)
    .sort(() => Math.random() - 0.5)
    .map((card, index) => ({ ...card, uniqueId: index, matched: false }));
}

export default function App() {
  const [cards, setCards] = useState(() => shuffle(cardsData));
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);

  function handleChoice(card) {
    if (!disabled) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  }

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.id === choiceTwo.id) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === choiceOne.id ? { ...card, matched: true } : card
          )
        );
        setScore(prev => prev + 1);
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  function resetTurn() {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
  }

  function resetGame() {
    setCards(shuffle(cardsData));
    setScore(0);
    resetTurn();
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Memory Matching Game</h1>
      <button onClick={resetGame}>Restart Game</button>
      <p>Score: {score}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 80px)",
          gap: 10,
          marginTop: 20,
        }}
      >
        {cards.map(card => (
          <div
            key={card.uniqueId}
            onClick={() => !card.matched && handleChoice(card)}
            style={{
              width: 80,
              height: 80,
              fontSize: 40,
              backgroundColor:
                card === choiceOne || card === choiceTwo || card.matched
                  ? "#fff"
                  : "#444",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: 8,
              userSelect: "none",
            }}
          >
            {(card === choiceOne || card === choiceTwo || card.matched) &&
              card.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

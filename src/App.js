import { useEffect, useState } from 'react';
import './App.css';
import SingleCard from './components/SingleCard';

const cardImages = [
  { "src": "/img/bayern.png", matched: false },
  { "src": "/img/real.png", matched: false },
  { "src": "/img/chelsea.png", matched: false },
  { "src": "/img/psg.png", matched: false },
  { "src": "/img/barca.png", matched: false },
  { "src": "/img/juventus.png", matched: false },
  { "src": "/img/mancity.png", matched: false },
  { "src": "/img/dortmund.png", matched: false }
]

function App() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)

  // Timer states
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))

    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
    setStartTime(Date.now()) // Capture start time
    setElapsedTime(0)
    setIsActive(true) // Start the timer when a new game starts
  }

  // Handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  // Compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)

      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  // Check if all cards are matched to stop the timer
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setIsActive(false) // Stop the timer when all cards are matched
    }
  }, [cards]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        const now = Date.now();
        const timeElapsed = (now - startTime) / 1000; // Calculate elapsed time in seconds with milliseconds
        setElapsedTime(timeElapsed.toFixed(4)); // Keep 4 decimal places
      }, 10); // Update every 10ms
    } else if (!isActive && elapsedTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime, elapsedTime]);

  // Reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  // Start a new game automatically
  useEffect(() => {
    shuffleCards()
  }, [])

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className='card-grid'>
        {cards.map(card => (
          <SingleCard key={card.id} card={card} handleChoice={handleChoice} flipped={card === choiceOne || card === choiceTwo || card.matched} disabled={disabled} />
        ))}
      </div>
      <p>Turns: {turns}</p>
      <p>Time: {elapsedTime} seconds</p> {/* Display elapsed time */}
    </div>
  );
}

export default App;

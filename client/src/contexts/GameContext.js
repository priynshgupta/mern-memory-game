import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import axiosInstance from '../config/axiosConfig';
import API_URL from '../config/api';
import { useAuth } from './AuthContext';

// Initial game state
const initialState = {
  cards: [],
  flippedCards: [],
  matchedCards: [],
  moves: 0,
  score: 0,
  gameStarted: false,
  gameOver: false,
  currentLevel: 1,
  startTime: null,
  endTime: null,
  loading: false,
  error: null,
  leaderboard: [],
  userScores: []
};

// Game context
const GameContext = createContext(initialState);

// Card images by level (you can replace these with your own image URLs)
const cardImages = {
  1: [
    { id: 1, image: '🐶' },
    { id: 2, image: '🐱' },
    { id: 3, image: '🦊' },
    { id: 4, image: '🐻' },
    { id: 5, image: '🐼' },
    { id: 6, image: '🦁' },
  ],
  2: [
    { id: 1, image: '🐶' },
    { id: 2, image: '🐱' },
    { id: 3, image: '🦊' },
    { id: 4, image: '🐻' },
    { id: 5, image: '🐼' },
    { id: 6, image: '🦁' },
    { id: 7, image: '🐮' },
    { id: 8, image: '🐷' },
  ],
  3: [
    { id: 1, image: '🐶' },
    { id: 2, image: '🐱' },
    { id: 3, image: '🦊' },
    { id: 4, image: '🐻' },
    { id: 5, image: '🐼' },
    { id: 6, image: '🦁' },
    { id: 7, image: '🐮' },
    { id: 8, image: '🐷' },
    { id: 9, image: '🐸' },
    { id: 10, image: '🐵' },
  ]
};

// Game reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE_GAME':
      return {
        ...initialState,
        cards: action.payload,
        currentLevel: action.level,
        gameStarted: true,
        startTime: Date.now()
      };
    case 'FLIP_CARD':
      return {
        ...state,
        flippedCards: [...state.flippedCards, action.payload],
        moves: state.flippedCards.length === 1 ? state.moves + 1 : state.moves
      };
    case 'CHECK_MATCH':
      const [firstCard, secondCard] = state.flippedCards;
      const isMatch = firstCard.image === secondCard.image;

      // Update matched cards if match found
      const newMatchedCards = isMatch
        ? [...state.matchedCards, firstCard.id, secondCard.id]
        : state.matchedCards;

      // Calculate score (more points for fewer moves)
      const pointsPerMatch = 100 * state.currentLevel;
      const newScore = isMatch ? state.score + pointsPerMatch : state.score;

      // Check if game is over (all cards matched)
      const isGameOver = newMatchedCards.length === state.cards.length;
      const endTime = isGameOver ? Date.now() : null;

      return {
        ...state,
        flippedCards: [],
        matchedCards: newMatchedCards,
        score: newScore,
        gameOver: isGameOver,
        endTime
      };
    case 'NEXT_LEVEL':
      return {
        ...initialState,
        currentLevel: state.currentLevel + 1,
        score: state.score, // Maintain score across levels
        cards: action.payload,
        gameStarted: true,
        startTime: Date.now()
      };
    case 'RESET_FLIPPED_CARDS':
      return {
        ...state,
        flippedCards: []
      };
    case 'FETCH_LEADERBOARD_START':
    case 'FETCH_USER_SCORES_START':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_LEADERBOARD_SUCCESS':
      return {
        ...state,
        leaderboard: action.payload,
        loading: false
      };
    case 'FETCH_USER_SCORES_SUCCESS':
      return {
        ...state,
        userScores: action.payload,
        loading: false
      };
    case 'FETCH_LEADERBOARD_ERROR':
    case 'FETCH_USER_SCORES_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// Provider component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { isAuthenticated, user, updateStats } = useAuth();

  // Initialize game with cards based on level
  const startGame = (level = 1) => {
    const levelCards = cardImages[level] || cardImages[1];

    // Create pairs of cards (doubling the array)
    const cardPairs = [...levelCards, ...levelCards].map((card, index) => ({
      ...card,
      id: index,
      isFlipped: false,
      isMatched: false
    }));

    // Shuffle the cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);

    dispatch({
      type: 'INITIALIZE_GAME',
      payload: shuffledCards,
      level
    });
  };

  // Handle card click
  const flipCard = (card) => {
    // Prevent flipping if already flipped or matched
    if (
      state.flippedCards.length === 2 ||
      state.flippedCards.find(c => c.id === card.id) ||
      state.matchedCards.includes(card.id)
    ) {
      return;
    }

    dispatch({
      type: 'FLIP_CARD',
      payload: card
    });
  };

  // Check for matches when we have 2 flipped cards
  useEffect(() => {
    if (state.flippedCards.length === 2) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CHECK_MATCH' });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [state.flippedCards]);  // Save score when game is over
  useEffect(() => {
    // Only run when the game is over and user is logged in
    if (!state.gameOver || !isAuthenticated || !user) return;

    const saveScore = async () => {
      const timeTaken = Math.floor((state.endTime - state.startTime) / 1000);

      try {        // Save score to API
        await axiosInstance.post(`/scores`, {
          score: state.score,
          level: state.currentLevel,
          timeTaken
        });

        // Update user stats if they've improved
        if (state.score > (user.highScore || 0)) {
          await updateStats({
            highScore: state.score,
            level: state.currentLevel > user.level ? state.currentLevel : user.level
          });
        }

        // Fetch updated leaderboard
        fetchLeaderboard();
      } catch (err) {
        console.error('Error saving score:', err);
      }
    };

    saveScore();
  // Using state.gameOver as the main dependency, other values accessed inside
  // are relatively stable during the game over state
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameOver]);

  // Move to next level
  const nextLevel = () => {
    if (state.currentLevel < Object.keys(cardImages).length) {
      const nextLevelNum = state.currentLevel + 1;
      const levelCards = cardImages[nextLevelNum];

      // Create pairs of cards (doubling the array)
      const cardPairs = [...levelCards, ...levelCards].map((card, index) => ({
        ...card,
        id: index,
        isFlipped: false,
        isMatched: false
      }));

      // Shuffle the cards
      const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);

      dispatch({
        type: 'NEXT_LEVEL',
        payload: shuffledCards
      });
    }
  };  // Fetch leaderboard with useCallback to maintain function identity
  const fetchLeaderboard = useCallback(async () => {
    dispatch({ type: 'FETCH_LEADERBOARD_START' });
    try {
      // Use axios directly for the leaderboard since it doesn't require authentication
      // This ensures the leaderboard loads even for non-logged in users
      const res = await axios.get(`${API_URL}/scores/leaderboard`);
      dispatch({
        type: 'FETCH_LEADERBOARD_SUCCESS',
        payload: res.data
      });
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      dispatch({
        type: 'FETCH_LEADERBOARD_ERROR',
        payload: err.response?.data?.message || 'Error fetching leaderboard'
      });
    }
  }, [dispatch, API_URL]);
  // Fetch user's scores with useCallback to maintain function identity
  const fetchUserScores = useCallback(async () => {
    if (!isAuthenticated) return;

    dispatch({ type: 'FETCH_USER_SCORES_START' });
    try {
      const res = await axiosInstance.get(`/scores/user`);
      dispatch({
        type: 'FETCH_USER_SCORES_SUCCESS',
        payload: res.data
      });
    } catch (err) {
      console.error('User scores fetch error:', err);
      dispatch({
        type: 'FETCH_USER_SCORES_ERROR',
        payload: err.response?.data?.message || 'Error fetching user scores'
      });
    }
  }, [dispatch, isAuthenticated]);

  return (
    <GameContext.Provider
      value={{
        ...state,
        startGame,
        flipCard,
        nextLevel,
        fetchLeaderboard,
        fetchUserScores
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};


import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { socket } from '../utils/socket';
import Btn from '../Components/btn';
import { motion, AnimatePresence } from 'framer-motion';

const PHASES = {
  WRITING: 'writing',
  SHOW: 'show',
  REVEAL: 'reveal',
  RESULT: 'result',
  WAITING: 'waiting',
};

const labelFor = (nextPhase) => ({
  [PHASES.SHOW]: 'Revealing Answers...',
  [PHASES.REVEAL]: 'The Imposter was...',
  [PHASES.WRITING]: 'Starting new round...',
}[nextPhase] || 'Loading...');

// normalize user id fields coming from server
const uid = (u) => (u?.userId ?? u?.id ?? u); // accept either shape

const GameRoom = () => {
  const location = useLocation();
  const { roomId } = useParams();

  // players passed via navigation OR fetched from server
  const navPlayers = location.state?.players || [];
  const [allPlayers, setAllPlayers] = useState(navPlayers);

  const [phase, setPhase] = useState(PHASES.WRITING);
  const [transition, setTransition] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState('');

  const [round, setRound] = useState(1);

  const [question, setQuestion] = useState('');
  const [realQuestion, setRealQuestion] = useState('');

  const [answer, setAnswer] = useState('');
  const [ansDis, setAnsDis] = useState(false);
  const [subPlayer, setSubPlayer] = useState([]);

  const [allAnswers, setAllAnswers] = useState([]);
  const [selectedVote, setSelectedVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [timesVote, setTimesVote] = useState(0);

  const [imposters, setImposters] = useState({});
  const [impQuestion, setImpQuestion] = useState('');
  const [impAnswer, setImpAnswer] = useState('');

  const [readyPlayers, setReadyPlayers] = useState([]);

  const playersCount = useMemo(
    () => (allPlayers?.length || navPlayers?.length || 0),
    [allPlayers, navPlayers]
  );

  // Floating background: compute once
  const floatingElements = useMemo(
    () =>
      [...Array(15)].map((_, i) => ({
        id: i,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
          animationDuration: `${Math.random() * 20 + 10}s`,
          animationDelay: `${Math.random() * 5}s`,
        },
      })),
    []
  );

  // Transition helper with cleanup
  const transitionTimer = useRef(null);
  const transitionToPhase = useCallback((newPhase, delay = 1200) => {
    setTransitionLabel(labelFor(newPhase));
    setTransition(true);
    clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => {
      setPhase(newPhase);
      setTransition(false);
    }, delay);
  }, []);
  useEffect(() => () => clearTimeout(transitionTimer.current), []);

  // --- Initial data sync / reconnect ---
  useEffect(() => {
    // ask server for room snapshot (phase, players, etc.)
    socket.emit('get-data', { roomId, userId: socket.id });
    const handleGetData = ({ phase: srvPhase, players: srvPlayers } = {}) => {
      if (srvPhase) setPhase(srvPhase);
      if (Array.isArray(srvPlayers) && srvPlayers.length) setAllPlayers(srvPlayers);
    };
    socket.off('get-data', handleGetData).on('get-data', handleGetData);
    return () => socket.off('get-data', handleGetData);
  }, [roomId]);

  // --- Start round when round changes ---
  useEffect(() => {
    socket.emit('start-round', { roomId }, (response) => {
      if (response?.error) alert(response.error);
    });
    const handleRoundStarted = ({ question: q } = {}) => setQuestion(q || '');
    socket.off('round-started', handleRoundStarted).on('round-started', handleRoundStarted);
    return () => socket.off('round-started', handleRoundStarted);
  }, [roomId, round]);

  // --- Phase-driven fetches ---
  useEffect(() => {
    if (phase === PHASES.SHOW) {
      socket.emit('get-answers', { roomId });
      const handleGetAnswers = ({ answers = [], question = '' } = {}) => {
        setAllAnswers(Array.isArray(answers) ? answers : []);
        setRealQuestion(question);
      };
      socket.off('get-answers', handleGetAnswers).on('get-answers', handleGetAnswers);
      return () => socket.off('get-answers', handleGetAnswers);
    }

    if (phase === PHASES.REVEAL) {
      socket.emit('get-impQues', { roomId });
      const handleImpQues = ({ imp, question, answer } = {}) => {
        setImposters(imp || {});
        setImpQuestion(question || '');
        setImpAnswer(answer || '');
      };
      socket.off('get-impQues', handleImpQues).on('get-impQues', handleImpQues);
      return () => socket.off('get-impQues', handleImpQues);
    }

    if (phase === PHASES.RESULT) {
      setAllAnswers([]);
    }
  }, [phase, roomId]);

  // --- Submissions tracking ---
  useEffect(() => {
    const handleAnswerSubmitted = ({ userId, nickname, avatar } = {}) => {
      setSubPlayer((prev) => {
        if (prev.some((p) => uid(p) === userId)) return prev;
        const next = [...prev, { userId, nickname, avatar }];
        // when everyone has submitted, transition
        if (playersCount > 0 && next.length >= playersCount) {
          // reset write-state and move to SHOW
          setAnsDis(false);
          setAnswer('');
          transitionToPhase(PHASES.SHOW);
          return []; // clear chips
        }
        return next;
      });
    };

    socket.off('answer-submitted', handleAnswerSubmitted).on('answer-submitted', handleAnswerSubmitted);
    return () => socket.off('answer-submitted', handleAnswerSubmitted);
  }, [playersCount, transitionToPhase]);

  // --- Voting updates ---
  useEffect(() => {
    const handleVote = ({ answer } = {}) => {
      // server returns updated answers array (with votes)
      if (Array.isArray(answer)) setAllAnswers(answer);
      setTimesVote((prev) => {
        const next = prev + 1;
        if (playersCount > 0 && next >= playersCount) {
          setAllAnswers([]);
          transitionToPhase(PHASES.REVEAL);
        }
        return next;
      });
    };
    socket.off('submit-vote', handleVote).on('submit-vote', handleVote);
    return () => socket.off('submit-vote', handleVote);
  }, [playersCount, transitionToPhase]);

  // --- Ready / next round ---
  const nextRound = useCallback(() => {
    socket.emit('next-round', { roomId, userId: socket.id });
  }, [roomId]);

  useEffect(() => {
    const handleNextRound = ({ player } = {}) => {
      setReadyPlayers((prev) => {
        if (!player || prev.some((p) => p.id === player.id)) return prev;
        const next = [...prev, player];

        // when all are ready, reset & start next round
        if (playersCount > 0 && next.length >= playersCount) {
          setAllAnswers([]);
          setHasVoted(false);
          setSelectedVote(null);
          setTimesVote(0);
          setReadyPlayers([]);
          socket.emit('reset', { roomId });
          transitionToPhase(PHASES.WRITING);
          setRound((r) => r + 1);
        }
        return next;
      });
    };

    socket.off('next-round', handleNextRound).on('next-round', handleNextRound);
    return () => socket.off('next-round', handleNextRound);
  }, [playersCount, roomId, transitionToPhase]);

  // --- Actions ---
  const submitAnswer = useCallback(
    (e) => {
      e.preventDefault();
      const text = answer.trim();
      if (!text) {
        alert('Please write your answer before submitting');
        return;
      }
      setAnsDis(true);
      socket.emit(
        'submit-answer',
        { roomId, userId: socket.id, text },
        (response) => {
          if (response?.error) {
            setAnsDis(false);
            alert(response.error);
          } else {
            // keep disabled until server broadcasts "answer-submitted"
            setAnswer('');
          }
        }
      );
    },
    [answer, roomId]
  );

  const submitVote = useCallback(
    (votedUserId) => {
      if (hasVoted || !votedUserId) return;
      socket.emit('submit-vote', { roomId, userId: socket.id, votedUserId });
      setHasVoted(true);
    },
    [hasVoted, roomId]
  );

  // derived display of who you voted for
  const votedForName = useMemo(() => {
    const found = allAnswers.find((a) => uid(a?.user) === selectedVote);
    return found?.user?.nickname || 'Unknown';
  }, [allAnswers, selectedVote]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full bg-blue-500/10 animate-float"
            style={el.style}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex gap-3">
          {subPlayer.map((p, k) => (
            <motion.div
              key={`${uid(p)}-${k}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: k * 0.05 }}
              className="text-4xl p-3 rounded-full bg-black/50 text-white border-2 border-yellow-400/50"
              title={p.nickname}
            >
              {p.avatar}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Round indicator */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-block bg-purple-500/20 px-6 py-2 rounded-full border border-purple-400/30">
          <span className="font-mono text-yellow-400">
            Round {round}{playersCount ? ` • Players ${playersCount}` : ''}
          </span>
        </div>
      </div>

      {/* Transition overlay */}
      <AnimatePresence>
        {transition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="text-4xl font-bold bg-gradient-to-r p-5 from-purple-500 to-blue-500 bg-clip-text text-transparent"
            >
              {transitionLabel}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="max-w-3xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {phase === PHASES.WRITING && (
            <motion.div
              key="writing"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                className="max-w-md mx-auto bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 shadow-xl"
              >
                <h3 className="text-2xl font-medium mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  “{question}”
                </h3>

                <textarea
                  rows={5}
                  className="w-full bg-gray-700/50 text-white p-4 rounded-xl border border-gray-600/50 
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition text-lg"
                  placeholder="Type your creative answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />

                <Btn
                  text={ansDis ? 'Submitted' : 'Submit Answer'}
                  handle={submitAnswer}
                  disabled={!answer.trim() || ansDis}
                  loading={ansDis}
                  dull={ansDis}
                  className={`mt-6 w-full py-4 text-lg ${
                    !answer.trim() || ansDis
                      ? 'bg-gray-600/50'
                      : 'bg-green-600/90 hover:bg-green-700/90'
                  }`}
                />
              </motion.div>
            </motion.div>
          )}

          {phase === PHASES.SHOW && (
            <motion.div
              key="show"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-8"
            >
              <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 mb-6">
                <h3 className="text-xl text-gray-300 mb-2">The question was</h3>
                <p className="text-2xl font-semibold text-white mb-6">{realQuestion}</p>
                <h3 className="text-xl text-yellow-400 mb-4">Click to vote for the imposter:</h3>
              </div>

              <div className="grid gap-4 max-w-xl w-full mx-auto">
                {allAnswers?.map((ans, i) => {
                  const ansUserId = uid(ans?.user);
                  return (
                    <motion.div
                      key={`${ansUserId}-${i}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => setSelectedVote(ansUserId)}
                      className={`flex items-center p-5 rounded-2xl cursor-pointer transition-all relative border-2 ${
                        selectedVote === ansUserId
                          ? 'bg-purple-600/30 border-purple-400 scale-105'
                          : 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-700/70'
                      }`}
                    >
                      <div className="text-3xl mr-4 bg-black/30 p-3 rounded-full border border-white/10">
                        {ans?.user?.avatar}
                      </div>
                      <div className="text-lg flex-1 text-left">{ans?.text}</div>
                      <div className="absolute bottom-2 right-3 flex gap-1">
                        {(ans?.votes || []).map((p, k) => (
                          <div key={`${uid(p)}-${k}`} className="text-lg opacity-80">
                            {p.avatar}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <Btn
                text={hasVoted ? 'Vote Submitted!' : 'Submit Vote'}
                handle={() => {
                  if (selectedVote != null) submitVote(selectedVote);
                  else alert('Please select an answer to vote for');
                }}
                disabled={hasVoted || selectedVote == null}
                className={`mt-8 w-full max-w-xs mx-auto py-4 text-lg ${
                  hasVoted || selectedVote == null
                    ? 'bg-gray-600/50'
                    : 'bg-green-600/90 hover:bg-green-700/90'
                }`}
              />

              {hasVoted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-green-400"
                >
                  You voted for: {votedForName}
                </motion.p>
              )}
            </motion.div>
          )}

          {phase === PHASES.REVEAL && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 shadow-xl"
              >
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6">
                  The Imposter Was...
                </h2>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-6xl mb-4"
                >
                  {imposters?.avatar}
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-8">{imposters?.nickname}</h2>

                <div className="space-y-4 text-left max-w-md mx-auto">
                  <div className="bg-gray-700/50 p-4 rounded-xl">
                    <h3 className="text-sm text-gray-400 mb-1">Their secret question was:</h3>
                    <p className="text-lg">{impQuestion}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-xl mb-10">
                    <h3 className="text-sm text-gray-400 mb-1">Their answer was:</h3>
                    <p className="text-lg">{impAnswer}</p>
                  </div>
                </div>

                <Btn
                  text="Ready for Next Round"
                  handle={nextRound}
                  className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 text-lg rounded-xl"
                />

                <div className="mt-6 flex justify-center gap-2">
                  {readyPlayers?.map((p, k) => (
                    <motion.div
                      key={`${p.id}-${k}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: k * 0.08 }}
                      className="text-xl bg-black/30 p-2 rounded-full border border-yellow-400/30"
                      title={p.nickname}
                    >
                      {p.avatar}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameRoom;

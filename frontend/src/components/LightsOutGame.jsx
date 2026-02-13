import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, Home, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LightsOutGame() {
    const [gameState, setGameState] = useState('idle'); // idle, ready, waiting, go, finished, early
    const [lights, setLights] = useState(0);
    const [result, setResult] = useState(null);
    const startTimeRef = useRef(null);
    const timeoutRef = useRef(null);
    const intervalRef = useRef(null);

    const startGame = () => {
        setGameState('ready');
        setLights(0);
        setResult(null);

        // Start lights sequence
        let currentLight = 0;
        intervalRef.current = setInterval(() => {
            currentLight++;
            setLights(currentLight);

            if (currentLight === 5) {
                clearInterval(intervalRef.current);
                setGameState('waiting');

                // Random delay between 0.2s and 3s
                const randomDelay = Math.random() * 2800 + 200;

                timeoutRef.current = setTimeout(() => {
                    setGameState('go');
                    setLights(0); // Lights out!
                    startTimeRef.current = performance.now();
                }, randomDelay);
            }
        }, 1000);
    };

    const handleInteraction = () => {
        if (gameState === 'idle' || gameState === 'finished' || gameState === 'early') return;

        if (gameState === 'go') {
            const endTime = performance.now();
            const reactionTime = endTime - startTimeRef.current;
            setResult(reactionTime);
            setGameState('finished');
        } else if (gameState === 'ready' || gameState === 'waiting') {
            // Jump start
            clearTimeout(timeoutRef.current);
            clearInterval(intervalRef.current);
            setGameState('early');
            setLights(5); // Keep lights on to show fail
        }
    };

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
            clearInterval(intervalRef.current);
        };
    }, []);

    const getRank = (ms) => {
        if (ms < 200) return { title: "F1 WORLD CHAMPION", color: "text-racing-orange" };
        if (ms < 250) return { title: "F1 DRIVER", color: "text-green-500" };
        if (ms < 300) return { title: "F2 DRIVER", color: "text-blue-500" };
        if (ms < 400) return { title: "SAFETY CAR DRIVER", color: "text-yellow-500" };
        return { title: "SUNDAY DRIVER", color: "text-gray-400" };
    };

    return (
        <div
            className="relative w-full h-full flex flex-col items-center justify-center select-none cursor-pointer"
            onMouseDown={handleInteraction}
            onTouchStart={handleInteraction}
        >
            {/* Lights Container */}
            <div className="bg-black p-4 md:p-8 rounded-3xl border border-gray-800 shadow-2xl flex gap-2 md:gap-4 mb-12 relative z-10">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="relative">
                        {/* Light Housing */}
                        <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gray-900 border-4 border-gray-800 shadow-inner flex items-center justify-center">
                            {/* The Light Bulb */}
                            <div className={`w-full h-full rounded-full transition-colors duration-100 ${lights >= i
                                    ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)]'
                                    : gameState === 'early'
                                        ? 'bg-red-600' // Keep red on fail
                                        : 'bg-gray-950'
                                }`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Feedback / Instructions */}
            <div className="text-center h-32 relative z-10">
                {gameState === 'idle' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); startGame(); }}
                        className="bg-white text-racing-black text-xl font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        <Play size={24} fill="currentColor" /> Start Race
                    </motion.button>
                )}

                {gameState === 'ready' && <p className="text-2xl font-bold text-white animate-pulse">Wait for lights out...</p>}
                {gameState === 'waiting' && <p className="text-2xl font-bold text-white">Wait for lights out...</p>}

                {gameState === 'go' && <p className="text-4xl font-black text-green-500">GO! GO! GO!</p>}

                {gameState === 'early' && (
                    <div className="animate-shake">
                        <p className="text-red-500 text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                            <AlertCircle /> JUMP START!
                        </p>
                        <button
                            onClick={(e) => { e.stopPropagation(); startGame(); }}
                            className="bg-white/10 text-white px-6 py-2 rounded-full font-bold hover:bg-white/20 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {gameState === 'finished' && result && (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <p className="text-6xl font-black text-white mb-2">{result.toFixed(0)}<span className="text-2xl text-gray-400">ms</span></p>
                        <p className={`text-xl font-bold tracking-widest ${getRank(result).color} mb-6`}>{getRank(result).title}</p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={(e) => { e.stopPropagation(); startGame(); }}
                                className="bg-white text-racing-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200"
                            >
                                <RefreshCw size={20} /> Retry
                            </button>
                            <Link
                                to="/"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white/10 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white/20"
                            >
                                <Home size={20} /> Exit
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Hints */}
            {gameState === 'idle' && (
                <p className="absolute bottom-8 text-gray-500 text-sm">Tap anywhere when the lights go out.</p>
            )}
        </div>
    );
}

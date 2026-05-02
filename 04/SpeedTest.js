import React, { useEffect, useRef, useState } from 'react';
import useRandomItem from './hook';

function SpeedTest() {
    const [word, regenerateWord] = useRandomItem(['devmentor.pl', 'abc', 'JavaScript']);
    const [value, setValue] = useState('');
    const [time, setTime] = useState(0);
    const [length, setLength] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        regenerateWord();
    }, []);

    function nextWord() {
        setValue('');
        regenerateWord();
    }

    useEffect(() => {
        if (value === word) {
            setLength((s) => s + value.length);
            nextWord();
        }
    }, [value]);

    const stopGame = () => {
        setValue('');
        clearInterval(intervalRef.current);
    };

    const startInterval = () => {
        intervalRef.current = setInterval(() => {
            setTime((t) => t + 1);
        }, 1000);
    };

    const startGame = () => {
        setTime(0);
        setLength(0);
        nextWord();
        startInterval();
    };

    return (
        <div>
            <h1>{word}</h1>
            <p>Number of seconds: {time}</p>
            <p>Number of characters written: {length}</p>
            <input
                onFocus={() => startGame()}
                onChange={(e) => setValue(e.target.value)}
                value={value}
                onBlur={() => stopGame()}
            />
        </div>
    );
}

export default SpeedTest;

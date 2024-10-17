import React, { useState, useEffect } from 'react';

const books = {
    "GEN": 50,
    "EXO": 40,
};

const getRandomPassageId = () => {
    const bookKeys = Object.keys(books);
    const randomBook = bookKeys[Math.floor(Math.random() * bookKeys.length)];
    const maxChapter = books[randomBook];
    const randomChapter = Math.floor(Math.random() * maxChapter) +1;
    return `${randomBook}.${randomChapter}`;
};






const BibleTyper = () => {
    const [text, setText] = useState("")
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [wpm, setWpm] = useState(null);
    const [accuracy, setAccuracy] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        handleRestart();
    }, []);

    //Restarts the game
    const handleRestart = () => {
        setInput("");
        setStartTime(null);
        setEndTime(null);
        setWpm(null);
        setAccuracy(null);
        setLoading(true);

        const passageId = getRandomPassageId();
        const apiUrl = `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/passages/${passageId}`
        const headers = {
            "api-key": "7a40855b2993aa6f487ac3ba7efb7606",
            "Content-Type": "application/json"
        };

        fetch(apiUrl, {headers})
            .then(response => response.json())
            .then(data => {
                setText(data.data.content.replace(/<[^>]*>/g, ''));
                setLoading(false);
                setError(null);
            })
            .catch(error => {
                console.error("Couldn't fetch the chapter", error);
                setLoading(false);
                setError("It's a bit hard loading up the bible verse");
            });
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);

        if (!startTime) {
            setStartTime(new Date().getTime());
        }

        if (value === text) {
            setEndTime(new Date().getTime());
        }
    };


    useEffect(() => {
        if (startTime && endTime) {
            const timeTakenInMinutes = (endTime - startTime) / 60000;
            const wordCount = text.split(" ").length;
            const calculatedWpm = (wordCount / timeTakenInMinutes).toFixed(2);
            const correctChars = text.split("").filter((char, index) => char === input[index]).length;
            const calculatedAccuracy = ((correctChars / text.length) * 100).toFixed(2);

            setWpm(calculatedWpm);
            setAccuracy(calculatedAccuracy);
        }
    }, [endTime]);
    

    return (
        <div>
            <h1> TypeTheBible </h1>
            {loading ? (
                <p>Loading...</p> 
            ) : (
            <p>{text}</p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type here"
                disabled={wpm != null} 
            />
            {wpm && accuracy && (
                <div>
                    <p>WPM: {wpm} </p>
                    <p>Accuracy: {accuracy}%</p>
                    <button onClick={handleRestart}>Restart</button>
                </div>
            )}
        </div>
        );
};

export default BibleTyper;

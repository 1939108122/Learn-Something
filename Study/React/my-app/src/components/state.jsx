import React, { useState } from 'react';

export default function State () {
    const [number, setNumber] = useState(0);

    const handleClick = () => {
        setNumber(number + 1);
        setNumber(number + 1);
        setTimeout(() => {
            setNumber(number + 1);
        }, 1000);
    }
    return (
        <button onClick={handleClick}>{number}</button>
    )
}
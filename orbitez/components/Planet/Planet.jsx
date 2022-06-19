import React, { useState } from 'react';
import PlanetGenerator  from '../PlanetGenerator/PlanetGenerator';

const DEFAULT_PLANET_FEATURES = {
    habitability: 0,
    size: 0,
    age: 0,
    gravity: 0,
    exoplanet: false
}

export default function Planet({ className="", children }) {
    const [mintHash, setMintHash] = useState('');
    const [planetFeatures, setPlanetFeatures] = useState(DEFAULT_PLANET_FEATURES)

    return (
        <div className={`planet ${ className}`}>
            <PlanetGenerator mint_hash={mintHash} />

            {children}
        </div>
    )
}
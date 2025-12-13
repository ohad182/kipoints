import React from 'react';
import Confetti from '../../../components/celebrations/Confetti';
import Fireworks from '../../../components/celebrations/Fireworks';
import FallingEmoji from '../../../components/celebrations/FallingEmoji';
import FloatingEmojis from '../../../components/celebrations/FloatingEmojis';
import FlyingEmoji from '../../../components/celebrations/FlyingEmoji';

const celebrationMap = {
    Confetti,
    Fireworks,
    FallingEmoji,
    FloatingEmojis,
    FlyingEmoji,
};

function DynamicCelebration({ preferences, category, onComplete }) {
    if (!preferences) return null;

    const animation = preferences[`${category}_animation`];
    const emoji = preferences[`${category}_emoji`];

    const CelebrationComponent = celebrationMap[animation];

    if (!CelebrationComponent || animation === 'None') {
        return null;
    }

    return <CelebrationComponent emoji={emoji} onComplete={onComplete} />;
}

export default DynamicCelebration;

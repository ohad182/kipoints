import { useState, useCallback, useEffect } from 'react';

const getPreferencesFromStorage = (childId) => {
    const stored = localStorage.getItem(`child-preferences-${childId}`);
    return stored ? JSON.parse(stored) : null;
};

const setPreferencesInStorage = (childId, preferences) => {
    localStorage.setItem(`child-preferences-${childId}`, JSON.stringify(preferences));
};

export const useChildPreferences = (childId) => {
    const [preferences, setPreferences] = useState(() => getPreferencesFromStorage(childId));

    useEffect(() => {
        // Update state if the childId changes
        setPreferences(getPreferencesFromStorage(childId));
    }, [childId]);

    const updatePreferences = useCallback((newPreferences) => {
        setPreferencesInStorage(childId, newPreferences);
        setPreferences(newPreferences);
    }, [childId]);

    return [preferences, updatePreferences];
};

// Hook to manage all children's preferences
export const useAllChildPreferences = () => {
    const updateAllPreferences = useCallback((children) => {
        children.forEach(child => {
            if (child.preferences) {
                setPreferencesInStorage(child.id, child.preferences);
            }
        });
    }, []);

    return { updateAllPreferences };
};

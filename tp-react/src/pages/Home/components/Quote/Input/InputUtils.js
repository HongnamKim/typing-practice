export const areJamoEqual = (separated1, separated2) => {
    if (separated1.length !== separated2.length) return false;
    for (let i = 0; i < separated1.length; i++) {
        if (separated1[i] !== separated2[i]) return false;
    }
    return true;
};

export const calculateAccuracy = (isCorrect, correctCount, incorrectCount) => {
    const totalChecked = correctCount + incorrectCount + 1;
    const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
    return (newCorrectCount / totalChecked) * 100;
};

export const sum = (array) => {
    return array.reduce((prev, curr) => prev + curr, 0);
};

export const average = (array) => {
    if (array.length === 0) return 0;
    return sum(array) / array.length;
};

export const max = (array) => {
    if (array.length === 0) return 0;
    return Math.max(...array);
};

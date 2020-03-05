function getWinner() {
    const winner = Math.random() * 36;
    return {
        winnerIndex: Math.floor(winner),
        exact: winner
    };
}

module.exports = {
    getWinner
};

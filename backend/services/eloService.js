const K_FACTOR = 32;

/**
 * Standard ELO formula. Returns the rating delta for the given player.
 * expectedScore = 1 / (1 + 10^((opponentElo - playerElo) / 400))
 * newElo = playerElo + K * (actualScore - expectedScore)
 */
export function calculateEloDelta(playerElo, opponentElo, didWin) {
  const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const actual = didWin ? 1 : 0;
  return Math.round(K_FACTOR * (actual - expected));
}

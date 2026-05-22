function computeRecommendations(graph, sourceId, visitedMap) {
  const source = graph.getNode(sourceId);
  const results = [];

  for (const [id, { depth }] of visitedMap.entries()) {
    if (id === sourceId) continue;
    const movie = graph.getNode(id);
    if (!movie) continue;

    let score = 0;

    // Depth score: BFS distance (closer = more relevant)
    const depthScore = (1 / depth) * 40;
    score += depthScore;

    // Genre overlap (each shared genre adds weight)
    const sharedGenres = source.genres.filter(g => movie.genres.includes(g));
    score += sharedGenres.length * 20;

    // Rating proximity bonus
    const ratingDiff = Math.abs(source.rating - movie.rating);
    if (ratingDiff <= 0.3) score += 18;
    else if (ratingDiff <= 0.7) score += 10;
    else if (ratingDiff <= 1.2) score += 4;

    // Absolute rating quality bonus
    score += (movie.rating - 7) * 5;

    // Direct neighbor bonus (depth === 1)
    if (depth === 1) score += 15;

    results.push({
      movie,
      score: Math.round(score * 10) / 10,
      depth,
      sharedGenres
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

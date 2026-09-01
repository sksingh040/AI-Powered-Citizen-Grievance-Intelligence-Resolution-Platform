export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};

export const calculateTextSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  const words1 = new Set(str1.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  const words2 = new Set(str2.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean));

  if (words1.size === 0 || words2.size === 0) return 0;

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
};

export const findPotentialDuplicates = (newComplaint, existingComplaints, maxDistanceMeters = 300) => {
  const potentialMatches = [];

  for (const existing of existingComplaints) {
    if (existing._id?.toString() === newComplaint._id?.toString()) continue;
    if (existing.ticketId === newComplaint.ticketId) continue;

    const dist = calculateDistanceMeters(
      newComplaint.location.lat,
      newComplaint.location.lng,
      existing.location.lat,
      existing.location.lng
    );

    if (dist > maxDistanceMeters) continue;

    const categoryMatch =
      newComplaint.aiInference?.predictedCategory === existing.aiInference?.predictedCategory ||
      newComplaint.departmentId === existing.departmentId;

    const textSim = calculateTextSimilarity(
      newComplaint.translatedText || newComplaint.originalText,
      existing.translatedText || existing.originalText
    );

    let similarityScore = 0;
    if (dist <= 50) similarityScore += 50;
    else if (dist <= 150) similarityScore += 35;
    else similarityScore += 20;

    if (categoryMatch) similarityScore += 30;
    similarityScore += Math.round(textSim * 20);

    if (similarityScore >= 60) {
      potentialMatches.push({
        matchedComplaint: existing,
        distanceMeters: dist,
        similarityScore: Math.min(similarityScore, 98),
        reason: `Located ${dist}m away with matching category (${existing.aiInference?.predictedCategory}) and text overlap.`
      });
    }
  }

  return potentialMatches.sort((a, b) => b.similarityScore - a.similarityScore);
};

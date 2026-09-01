import { PRIORITY_BANDS } from '../config/constants.js';

export const calculatePriorityScore = ({
  category = 'pothole',
  isSafetyHazard = false,
  isSensitiveZone = false,
  sensitiveZoneType = null,
  recurrenceCount = 0,
  affectedPopulation = 'medium',
  sentimentUrgency = 'moderate',
  createdAt = new Date(),
  slaHours = 48
}) => {
  const categoryBaseWeights = {
    pothole: 22,
    broken_road: 20,
    bridge_hazard: 35,
    traffic_light_failure: 26,
    water_leakage: 18,
    drainage_overflow: 28,
    contaminated_water: 32,
    sewer_blockage: 24,
    garbage_overflow: 16,
    dead_animal_removal: 22,
    dirty_public_toilet: 12,
    hanging_wire_hazard: 34,
    broken_electric_pole: 30,
    transformer_spark: 35,
    streetlight_dark: 15,
    mosquito_fogging: 18,
    stagnant_water_hazard: 20,
    fallen_tree: 25,
    encroachment: 14
  };

  const baseWeight = categoryBaseWeights[category] || 20;

  let publicSafetyRisk = 0;
  if (isSafetyHazard) publicSafetyRisk += 25;
  if (['hanging_wire_hazard', 'transformer_spark', 'bridge_hazard', 'contaminated_water'].includes(category)) {
    publicSafetyRisk += 10;
  }
  publicSafetyRisk = Math.min(publicSafetyRisk, 35);

  let populationImpact = 10;
  if (affectedPopulation === 'severe') populationImpact = 20;
  else if (affectedPopulation === 'high') populationImpact = 15;
  else if (affectedPopulation === 'medium') populationImpact = 10;
  else if (affectedPopulation === 'low') populationImpact = 5;

  let sensitiveZoneBonus = 0;
  if (isSensitiveZone) {
    if (sensitiveZoneType === 'Hospital') sensitiveZoneBonus = 20;
    else if (sensitiveZoneType === 'School') sensitiveZoneBonus = 18;
    else if (sensitiveZoneType === 'Metro Station' || sensitiveZoneType === 'Bus Terminus') sensitiveZoneBonus = 15;
    else sensitiveZoneBonus = 10;
  }

  const recurrenceBoost = Math.min(recurrenceCount * 4, 15);

  let urgencyBonus = 0;
  if (sentimentUrgency === 'high') urgencyBonus = 10;
  else if (sentimentUrgency === 'moderate') urgencyBonus = 5;

  const rawScore = baseWeight + publicSafetyRisk + populationImpact + sensitiveZoneBonus + recurrenceBoost + urgencyBonus;
  const finalScore = Math.min(Math.max(Math.round(rawScore), 10), 100);

  let band = 'Normal';
  if (finalScore >= PRIORITY_BANDS.CRITICAL.min) band = 'Critical';
  else if (finalScore >= PRIORITY_BANDS.HIGH.min) band = 'High';
  else if (finalScore >= PRIORITY_BANDS.NORMAL.min) band = 'Normal';
  else band = 'Low';

  const factors = [];
  if (publicSafetyRisk > 15) factors.push(`Direct public safety hazard detected (+${publicSafetyRisk} pts)`);
  if (sensitiveZoneBonus > 0) factors.push(`High vulnerability zone: ${sensitiveZoneType || 'Sensitive Area'} (+${sensitiveZoneBonus} pts)`);
  if (populationImpact >= 15) factors.push(`High density population impact (+${populationImpact} pts)`);
  if (recurrenceBoost > 0) factors.push(`Recurring complaints in vicinity (${recurrenceCount} reports, +${recurrenceBoost} pts)`);
  if (urgencyBonus > 0) factors.push(`High distress/urgency detected in citizen narrative (+${urgencyBonus} pts)`);

  return {
    score: finalScore,
    band,
    breakdown: {
      severity: baseWeight,
      publicSafetyRisk,
      populationImpact,
      sensitiveZoneBonus,
      recurrenceCount: recurrenceBoost,
      slaProximityWeight: 0
    },
    topFactors: factors.length > 0 ? factors : ['Standard routine civic issue base priority']
  };
};

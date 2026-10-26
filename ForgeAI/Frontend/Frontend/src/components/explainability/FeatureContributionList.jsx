/**
 * ForgeAI — FeatureContributionList
 *
 * Renders the full list of SHAP feature contributions, sorted by
 * absolute contribution magnitude (largest first).
 *
 * Each feature is rendered via FeatureContributionBar.
 * The list calculates maxAbsShap to normalize bar widths relative
 * to the single largest contributor.
 *
 * @param {{
 *   features: import('../../services/explainabilityService').ExplanationFeature[],
 * }} props
 */

import FeatureContributionBar from './FeatureContributionBar'

function FeatureContributionList({ features }) {
  if (!features || features.length === 0) return null

  // Max absolute SHAP value for normalizing bar widths
  const maxAbsShap = Math.max(...features.map((f) => Math.abs(f.shapValue)))

  return (
    <div className="space-y-1.5" role="list" aria-label="Feature contributions to prediction">
      {features.map((feature) => (
        <FeatureContributionBar
          key={feature.name}
          displayName={feature.displayName}
          value={feature.value}
          unit={feature.unit}
          shapValue={feature.shapValue}
          direction={feature.direction}
          maxAbsShap={maxAbsShap}
        />
      ))}
    </div>
  )
}

export default FeatureContributionList

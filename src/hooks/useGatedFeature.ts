'use client';
import { useSubscriptionStore, FeatureKey } from '@/store/useSubscriptionStore';

/**
 * Returns a wrapped function that checks the plan before executing.
 * If the feature is locked, it opens the upgrade modal instead.
 *
 * Usage:
 *   const gated = useGatedFeature();
 *   <button onClick={gated('finance', () => router.push('/finance/bill-utility'))}>
 *     Create Bill
 *   </button>
 */
export function useGatedFeature() {
    const { canUse, promptUpgrade } = useSubscriptionStore();

    return (feature: FeatureKey, action: () => void) => () => {
        if (canUse(feature)) {
            action();
        } else {
            promptUpgrade(feature);
        }
    };
}
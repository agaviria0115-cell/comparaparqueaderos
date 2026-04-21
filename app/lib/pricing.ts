type Parking = {
  id: string;
  price_per_day: number;
  pricing_strategy?: "simple" | "package" | "optimized";
  pricing_time_unit?: "day" | "fractional";
  hourly_price?: number;
};

type PricingPackage = {
  duration_type: string;
  duration_days: number;
  price_total: number;
  min_days?: number;
  max_days?: number;
};

export type PriceBreakdownItem = {
  type: string;
  days: number;
  price: number;
};

type PricingResult = {
  totalPrice: number;
  pricingType: "simple" | "optimized";
  breakdown: PriceBreakdownItem[];
  savings: number;
  savingsPercent: number;
  hasRealSavings: boolean;
  explanation: string;
};

// -----------------------------------
// ✅ Shared explanation builder
// -----------------------------------
function buildExplanation(
  totalDays: number,
  remainingHours: number,
  hasRealSavings: boolean,
  savingsPercent: number
): string {
  if (hasRealSavings && savingsPercent > 0) {
    return `Ahorra ${Math.round(savingsPercent)}% vs tarifa diaria`;
  }

  if (remainingHours > 0) {
    return `Total por ${totalDays} día${totalDays !== 1 ? "s" : ""} + ${remainingHours} hora${remainingHours !== 1 ? "s" : ""}`;
  }

  return `Total por ${totalDays} día${totalDays !== 1 ? "s" : ""}`;
}

// -----------------------------------
// MAIN FUNCTION
// -----------------------------------
export function calculatePrice(
  parking: Parking,
  packages: PricingPackage[] = [],
  totalDays: number,
  remainingHours: number = 0
): PricingResult {

  // -----------------------------------
  // SAFETY
  // -----------------------------------
  if (!parking || (totalDays <= 0 && remainingHours <= 0)) {
    return {
      totalPrice: 0,
      pricingType: "simple",
      breakdown: [],
      savings: 0,
      savingsPercent: 0,
      hasRealSavings: false,
      explanation: "",
    };
  }

  // ✅ Enforce minimum 1 day when using fractional pricing
  const billableDays =
    totalDays > 0
      ? totalDays
      : parking.pricing_time_unit === "fractional" && remainingHours > 0
      ? 1
      : 0;
  

  const strategy = parking.pricing_strategy || "simple";

  // =====================================================
  // RANGE PRICING
  // =====================================================
  const rangePackages = packages
    .filter((p) => p.min_days != null && p.max_days != null)
    .sort((a, b) => (b.max_days || 0) - (a.max_days || 0));

  const rangePackage = rangePackages[0];

  if (rangePackage) {
    let remainingDays = billableDays;
    let totalPrice = 0;
    const breakdown: PriceBreakdownItem[] = [];

    const blockSize = rangePackage.max_days || rangePackage.duration_days;
    const blockPrice = rangePackage.price_total;

    const blocks = Math.floor(remainingDays / blockSize);

    if (blocks > 0) {
      breakdown.push({
        type: rangePackage.duration_type,
        days: blocks * blockSize,
        price: blocks * blockPrice,
      });

      totalPrice += blocks * blockPrice;
      remainingDays -= blocks * blockSize;
    }

    if (remainingDays > 0) {
      if (
        remainingDays >= (rangePackage.min_days || 0) &&
        remainingDays <= (rangePackage.max_days || 0)
      ) {
        breakdown.push({
          type: rangePackage.duration_type,
          days: remainingDays,
          price: rangePackage.price_total,
        });

        totalPrice += rangePackage.price_total;
      } else {
        const fallbackPrice = parking.price_per_day * remainingDays;

        breakdown.push({
          type: "day",
          days: remainingDays,
          price: fallbackPrice,
        });

        totalPrice += fallbackPrice;
      }
    }

    // fractional hours
    if (
      parking.pricing_time_unit === "fractional" &&
      remainingHours > 0 &&
      parking.hourly_price
    ) {
      const cappedHourlyCost = Math.min(
        remainingHours * parking.hourly_price,
        parking.price_per_day
      );

      breakdown.push({
        type: "hour",
        days: remainingHours / 24,
        price: cappedHourlyCost,
      });

      totalPrice += cappedHourlyCost;
    }

    const baseline =
      parking.price_per_day * billableDays +
      (remainingHours > 0
        ? Math.min(
            remainingHours * (parking.hourly_price || 0),
            parking.price_per_day
          )
        : 0);

    const savings = Math.max(0, baseline - totalPrice);
    const savingsPercent =
      baseline > 0 ? Math.round((savings / baseline) * 100) : 0;

    const usedRange =
      blocks > 0 ||
      (
        rangePackage.min_days != null &&
        rangePackage.max_days != null &&
        remainingDays >= rangePackage.min_days &&
        remainingDays <= rangePackage.max_days
      );

    return {
      totalPrice,
      pricingType: usedRange ? "optimized" : "simple",
      breakdown,
      savings: usedRange ? savings : 0,
      savingsPercent: usedRange ? savingsPercent : 0,
      hasRealSavings: usedRange,
      explanation: buildExplanation(billableDays, remainingHours, usedRange, savingsPercent),
    };
  }

  // =====================================================
  // SIMPLE PRICING
  // =====================================================
  if (strategy === "simple" || packages.length === 0) {
    let totalPrice = parking.price_per_day * billableDays;

    const breakdown: PriceBreakdownItem[] = [
      { type: "day", days: billableDays, price: totalPrice },
    ];

    if (
      parking.pricing_time_unit === "fractional" &&
      remainingHours > 0 &&
      parking.hourly_price
    ) {
      const cappedHourlyCost = Math.min(
        remainingHours * parking.hourly_price,
        parking.price_per_day
      );

      breakdown.push({
        type: "hour",
        days: remainingHours / 24,
        price: cappedHourlyCost,
      });

      totalPrice += cappedHourlyCost;
    }

    return {
      totalPrice,
      pricingType: "simple",
      breakdown,
      savings: 0,
      savingsPercent: 0,
      hasRealSavings: false,
      explanation: buildExplanation(billableDays, remainingHours, false, 0),
    };
  }

  // =====================================================
  // OPTIMIZED PRICING
  // =====================================================
  const validPackages = packages
    .filter((p) => p.duration_days > 1 && p.price_total > 0)
    .sort((a, b) => b.duration_days - a.duration_days);

  let remainingDays = billableDays;
  let totalPrice = 0;
  const breakdown: PriceBreakdownItem[] = [];
  let usedPackage = false;

  for (const pkg of validPackages) {
    const count = Math.floor(remainingDays / pkg.duration_days);

    if (count > 0) {
      const daysUsed = count * pkg.duration_days;
      const price = count * pkg.price_total;

      breakdown.push({
        type: pkg.duration_type,
        days: daysUsed,
        price,
      });

      totalPrice += price;
      remainingDays -= daysUsed;
      usedPackage = true;
    }
  }

  if (remainingDays > 0) {
    const dailyPrice = parking.price_per_day * remainingDays;

    breakdown.push({
      type: "day",
      days: remainingDays,
      price: dailyPrice,
    });

    totalPrice += dailyPrice;
  }

  if (
    parking.pricing_time_unit === "fractional" &&
    remainingHours > 0 &&
    parking.hourly_price
  ) {
    const cappedHourlyCost = Math.min(
      remainingHours * parking.hourly_price,
      parking.price_per_day
    );

    breakdown.push({
      type: "hour",
      days: remainingHours / 24,
      price: cappedHourlyCost,
    });

    totalPrice += cappedHourlyCost;
  }

  const baseline =
    parking.price_per_day * billableDays +
    (remainingHours > 0
      ? Math.min(
          remainingHours * (parking.hourly_price || 0),
          parking.price_per_day
        )
      : 0);

  const savings = Math.max(0, baseline - totalPrice);
  const savingsPercent =
    baseline > 0 ? Math.round((savings / baseline) * 100) : 0;

  return {
    totalPrice,
    pricingType: usedPackage ? "optimized" : "simple",
    breakdown,
    savings: usedPackage ? savings : 0,
    savingsPercent: usedPackage ? savingsPercent : 0,
    hasRealSavings: usedPackage,
    explanation: buildExplanation(billableDays, remainingHours, usedPackage, savingsPercent),
  };
}

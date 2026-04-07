type Parking = {
  id: string;
  price_per_day: number;
  pricing_strategy?: "simple" | "package" | "optimized";
};

type PricingPackage = {
  duration_type: string;
  duration_days: number;
  price_total: number;
};

type PriceBreakdownItem = {
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
};

export function calculatePrice(
  parking: Parking,
  packages: PricingPackage[] = [],
  totalDays: number
): PricingResult {

  // --- SAFETY ---
  if (!parking || totalDays <= 0) {
    return {
      totalPrice: 0,
      pricingType: "simple",
      breakdown: [],
      savings: 0,
      savingsPercent: 0,
    };
  }

  const strategy = parking.pricing_strategy || "simple";

  // =====================================================
  // SIMPLE PRICING
  // =====================================================
  if (strategy === "simple" || packages.length === 0) {
    const totalPrice = parking.price_per_day * totalDays;

    return {
      totalPrice,
      pricingType: "simple",
      breakdown: [
        {
          type: "day",
          days: totalDays,
          price: totalPrice,
        },
      ],
      savings: 0,
      savingsPercent: 0,
    };
  }

  // =====================================================
  // OPTIMIZED PRICING (GREEDY)
  // =====================================================

  // 1. Filter valid packages (exclude "day")
  const validPackages = packages
    .filter(
      (p) =>
        p.duration_days > 1 && // exclude daily packages
        p.price_total > 0
    )
    .sort((a, b) => b.duration_days - a.duration_days); // DESC

  let remainingDays = totalDays;
  let totalPrice = 0;
  const breakdown: PriceBreakdownItem[] = [];

  // 2. Apply greedy allocation
  for (const pkg of validPackages) {
    if (remainingDays <= 0) break;

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
    }
  }

  // 3. Fill remaining with daily price (fallback)
  if (remainingDays > 0) {
    const dailyPrice = parking.price_per_day * remainingDays;

    breakdown.push({
      type: "day",
      days: remainingDays,
      price: dailyPrice,
    });

    totalPrice += dailyPrice;
  }

  // =====================================================
  // SAVINGS CALCULATION
  // =====================================================
  const baseline = parking.price_per_day * totalDays;

  const savings = Math.max(0, baseline - totalPrice);

  const savingsPercent =
    baseline > 0 ? Math.round((savings / baseline) * 100) : 0;

  return {
    totalPrice,
    pricingType: "optimized",
    breakdown,
    savings,
    savingsPercent,
  };
}
"use client";

import { useState } from "react";
import type { Parking } from "../types";
import { ResultsToolbar } from "./ResultsToolbar";
import { ResultsList } from "./ResultsList";

interface ResultsClientProps {
  parkings: Parking[];
}

export function ResultsClient({ parkings }: ResultsClientProps) {
  const [sortBy, setSortBy] = useState<
    "cheapest" | "closest" | "best"
  >("cheapest");

  const sortedParkings = [...parkings].sort((a, b) => {
    if (sortBy === "cheapest") {
      return a.totalPrice - b.totalPrice;
    }

    if (sortBy === "closest") {
      return a.distanceMeters - b.distanceMeters;
    }

    // Best value (placeholder)
    return a.totalPrice - b.totalPrice;
  });

  return (
    <>
      {sortedParkings.length > 1 && (
        <ResultsToolbar
          sortBy={sortBy}
          onChange={setSortBy}
        />
      )}

      <ResultsList parkings={sortedParkings} />
    </>
  );
}

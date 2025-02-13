import { useState, useCallback, useEffect, useRef } from "react";
import { INITIAL_EPOCH_TIMESTAMP } from "@/config/protocols";
import { getEpochBoundaries } from "@/lib/utils";

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

export function useEpoch(onEpochChange?: (epochNumber: number) => void) {
  const now = useRef(Math.floor(Date.now() / 1000)).current;
  const [currentTimestamp, setCurrentTimestamp] = useState(now);

  // Find the most recent Thursday at 00:00 UTC
  const currentThursday = getEpochBoundaries(currentTimestamp).start;

  // Calculate current epoch based on the most recent Thursday
  const [selectedEpochNumber, setSelectedEpochNumber] = useState(
    Math.floor((currentThursday - INITIAL_EPOCH_TIMESTAMP) / WEEK_IN_SECONDS)
  );

  // Calculate current epoch based on current timestamp
  const currentEpoch = Math.floor(
    (getEpochBoundaries(currentTimestamp).start - INITIAL_EPOCH_TIMESTAMP) /
      WEEK_IN_SECONDS
  );

  // Calculate epoch difference
  const epochDiff = selectedEpochNumber - currentEpoch;

  // Update current timestamp every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate epoch boundaries based on selected epoch number
  const selectedEpochTimestamp =
    INITIAL_EPOCH_TIMESTAMP + selectedEpochNumber * WEEK_IN_SECONDS;
  const epochBoundaries = getEpochBoundaries(selectedEpochTimestamp);

  const handlePreviousEpoch = useCallback(() => {
    setSelectedEpochNumber((prev) => {
      const newEpoch = Math.max(0, prev - 1);
      onEpochChange?.(newEpoch);
      return newEpoch;
    });
  }, [onEpochChange]);

  const handleNextEpoch = useCallback(() => {
    setSelectedEpochNumber((prev) => {
      const newEpoch = prev + 1;
      onEpochChange?.(newEpoch);
      return newEpoch;
    });
  }, [onEpochChange]);

  const handleResetToCurrentEpoch = useCallback(() => {
    setSelectedEpochNumber(currentEpoch);
    onEpochChange?.(currentEpoch);
  }, [currentEpoch, onEpochChange]);

  return {
    currentTimestamp,
    currentEpochNumber: selectedEpochNumber,
    epochStart: epochBoundaries.start,
    epochEnd: epochBoundaries.end,
    handlePreviousEpoch,
    handleNextEpoch,
    handleResetToCurrentEpoch,
    epochDiff,
  };
}

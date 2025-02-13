# Epoch Explorer Requirements

## Global Controls (Top Section)

- Global epoch controls in the top section MUST affect ALL protocols simultaneously
- Left/Right arrows increment/decrement ALL protocols together
- "Current Epoch" button resets ALL protocols to current epoch
- Tooltip for "Current Epoch" MUST appear BELOW the button (not overlaying arrows)

## Protocol-Specific Controls

- Each protocol card has its own independent epoch control
- Protocol-specific epoch changes MUST ONLY affect that individual protocol
- Protocol-specific changes MUST NOT affect other protocols
- Protocol-specific state MUST persist even when using global controls

## State Management Rules

- Global state changes (top section) = affects ALL protocols
- Protocol-specific changes = affects ONLY that protocol
- Both global and protocol-specific states must work independently
- Proper relative epoch display (-1, -2, etc.) relative to current time

## Implementation Details

### State Management

```typescript
interface EpochStore {
  globalOffset: number;           // Affects all protocols
  protocolOffsets: {             // Individual protocol offsets
    [protocolId: string]: number;
  };
}
```

### Global Controls

- When using global controls, the formula is:

  ```typescript
  displayEpoch = currentEpoch + globalOffset + protocolOffset
  ```

- Global controls modify globalOffset which affects all protocols

### Protocol Controls

- Protocol controls only modify their own protocolOffset
- Each protocol maintains its own state independent of global state
- Protocol-specific changes don't affect globalOffset

### UI Requirements

- Tooltips must not interfere with other UI elements
- All controls must be clearly visible and accessible
- State changes must be immediately reflected in the UI
- Error handling for all operations

### Epoch Calculation

- Protocol reference timestamp and epoch are used as alignment points
- Current epoch MUST be calculated based on weeks passed since reference point
- Formula: currentEpoch = referenceEpoch + (currentTimestamp - referenceTimestamp) / WEEK_IN_SECONDS
- Display epoch MUST show actual current epoch number (e.g., 52, 53) before any offsets
- Reference values are used only to establish the starting point for epoch calculations

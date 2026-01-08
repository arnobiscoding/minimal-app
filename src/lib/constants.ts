/**
 * Application-wide constants
 */

// Game Configuration
export const GAME_CONFIG = {
  MIN_PLAYERS: 4,
  MAX_PLAYERS: 4,
  ROUNDS_PER_HALF: 2,
  TOTAL_ROUNDS: 4,
  KEY_SELECTION_TIMEOUT: 60 * 1000, // 60 seconds
  ROUND_TIMEOUT: 120 * 1000, // 2 minutes
  MATCHMAKING_POLL_INTERVAL: 2000, // 2 seconds
  MATCHMAKING_TIMEOUT: 60000, // 60 seconds
} as const;

// MMR Configuration
export const MMR_CONFIG = {
  DEFAULT_MMR: 1000,
  MMR_CHANGE: 25,
  RANK_THRESHOLDS: {
    DIAMOND: 2000,
    GOLD: 1500,
    SILVER: 1200,
    BRONZE: 0,
  },
  MATCHMAKING_RANGE: 100, // ±100 MMR
} as const;

// API Configuration
export const API_CONFIG = {
  MAX_PROPOSAL_LENGTH: 20,
  MAX_GUESS_LENGTH: 50,
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 100,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  NOT_FOUND: "Resource not found",
  FORBIDDEN: "Forbidden",
  VALIDATION_ERROR: "Validation error",
  INTERNAL_ERROR: "Internal server error",
  MATCH_NOT_FOUND: "Match not found",
  NOT_PARTICIPANT: "Not a participant in this match",
  INVALID_PHASE: "Invalid game phase",
  INVALID_ROLE: "Invalid role for this action",
  MATCH_CANCELLED: "Match was cancelled",
  INSUFFICIENT_PLAYERS: "Not enough players",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  MATCH_CREATED: "Match created successfully",
  QUEUE_JOINED: "Joined matchmaking queue",
  QUEUE_LEFT: "Left matchmaking queue",
  READY: "Marked as ready",
  PROPOSAL_CREATED: "Proposal created",
  VOTE_RECORDED: "Vote recorded",
  GUESS_SUBMITTED: "Guess submitted",
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  GONE: 410,
  INTERNAL_ERROR: 500,
} as const;


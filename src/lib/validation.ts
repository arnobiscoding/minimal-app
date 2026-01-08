/**
 * Input validation schemas using Zod
 */

import { z } from "zod";

// Match ID validation
export const matchIdSchema = z.string().uuid("Invalid match ID format");

// Proposal validation
export const proposalSchema = z.object({
  matchId: matchIdSchema,
  text: z
    .string()
    .min(1, "Proposal text is required")
    .max(20, "Proposal text must be 20 characters or less")
    .transform((val) => val.toUpperCase().trim()),
});

// Vote validation
export const voteSchema = z.object({
  matchId: matchIdSchema,
  proposalId: z.string().uuid("Invalid proposal ID format"),
});

// Guess validation
export const guessSchema = z.object({
  matchId: matchIdSchema,
  text: z
    .string()
    .min(1, "Guess text is required")
    .max(50, "Guess text must be 50 characters or less")
    .transform((val) => val.trim()),
});

// Ready validation
export const readySchema = z.object({
  matchId: matchIdSchema,
});

// Leave match validation
export const leaveMatchSchema = z.object({
  matchId: matchIdSchema,
});

// Auth validation
export const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Type exports
export type ProposalInput = z.infer<typeof proposalSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type GuessInput = z.infer<typeof guessSchema>;
export type ReadyInput = z.infer<typeof readySchema>;
export type LeaveMatchInput = z.infer<typeof leaveMatchSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;


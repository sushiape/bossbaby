export type VoteCategory = "pack" | "flavour";

export interface VoteSelections {
  pack: string[];
  flavour: string[];
}

export interface VoteResults {
  pollId: string;
  totalParticipants: number;
  participantHasVoted?: boolean;
  counts: Record<VoteCategory, Record<string, number>>;
}

export interface Suggestion {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
  canDelete?: boolean;
}

export interface SuggestionPage {
  suggestions: Suggestion[];
  nextCursor: string | null;
  hasMore: boolean;
}

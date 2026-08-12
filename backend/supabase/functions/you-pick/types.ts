export interface CursorValue {
  createdAt: string;
  id: string;
}

export interface SuggestionRow {
  id: string;
  user_id: string;
  author_name: string;
  text: string;
  created_at: string;
}

export interface SuggestionResource {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
  canDelete?: boolean;
}

export interface VoteSelections {
  pack: string[];
  flavour: string[];
}

export interface VoteResults {
  pollId: string;
  totalParticipants: number;
  participantHasVoted?: boolean;
  counts: {
    pack: Record<string, number>;
    flavour: Record<string, number>;
  };
}

# Expose vote results instead of raw votes

Public clients receive aggregate vote counts and total participation, never individual vote rows or participant identifiers. PostgreSQL computes aggregates through a database function called by the You Pick Edge Function, while the frontend converts safe counts into display percentages so presentation rounding remains independently testable.

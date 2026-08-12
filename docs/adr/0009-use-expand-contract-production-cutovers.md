# Use expand-contract production cutovers

Breaking backend changes use two compatible production releases: first add and deploy the new backend path and switch the frontend, then remove the old path only after production verification. For the initial refactor, direct table grants remain during the Edge Function cutover and are revoked in a follow-up release, preventing the currently deployed frontend from losing its backend mid-release.

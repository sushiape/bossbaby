# Use backward-compatible forward-fix releases

Production database changes are additive and backward-compatible so a failed release can stop before the frontend without breaking the live version. Database migrations are never automatically reversed; failures are repaired forward, while the initial service-boundary cutover retains a documented emergency path to restore old table grants until direct access is safely retired.

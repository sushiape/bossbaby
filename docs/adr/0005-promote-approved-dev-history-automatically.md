# Promote approved dev history automatically

Feature branches enter `dev` only through pull requests with required CI and one human approval. After merge, automation opens or updates a `dev`-to-`main` promotion pull request and enables auto-merge once full CI passes; no second human approval is required because `main` receives only already-reviewed `dev` history, and production deployment starts only from `main`.

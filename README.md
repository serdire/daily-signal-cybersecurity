# Daily Signal

A static cybersecurity site that features one source-linked, evergreen explainer per day. The seven explainers rotate weekly; this is not a breaking-news service and it does not need an AI API key.

## Publish with GitHub Pages

1. Push this project to a GitHub repository.
2. In **Settings → Pages**, set the build and deployment source to **GitHub Actions**.
3. Ensure Actions are enabled and the workflow has permission to write repository contents and deploy Pages.
4. The workflow deploys on pushes to the default branch and runs the daily rotation at 05:23 UTC.

The scheduled workflow updates `current.json`, commits that daily feature to the default branch, and deploys the site. GitHub may delay scheduled workflows, and a contribution streak is not guaranteed: contributions depend on GitHub's rules, the commit email being associated with the account, the default branch, and the workflow running each day. Automated commits are attributed to the account that last changed the workflow; verify the resulting commit attribution in GitHub.

Run the rotation checks locally with `node --test`. To add or edit explainers, update `articles.json`.

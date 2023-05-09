# comment-selector

This repo is split into two parts:

## ig-data.ts

Collects a list of comments from a specific post using the Instagram API.

The list is saved to the file `data/comments.json`.

To use this part, a `.env` file based on the template provided in `.env.example` must be created.

## index.ts

Calls `getComments()` from `ig-data.ts`. Then, selects `NUM_TO_SELECT` winning comments from `data/comments.json` with the following conditions:

- Winners cannot be selected multiple times, and
- The comment must have been posted before the timestamp specified by `DEADLINE`.

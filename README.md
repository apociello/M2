# Chess Scout

A Chess.com player scouting app built with Vite and vanilla JavaScript.

## Features

- Search any Chess.com player by username
- Profile with avatar, title, followers and link to Chess.com
- Current and best rating in bullet, blitz, rapid and daily
- Report of the last 30 days: wins, draws and losses, win rate as white and black
- List of the most recent games, linking to each game
- Loading, error and empty states
- API responses cached in localStorage for 10 minutes

## Built with

- HTML
- CSS
- JavaScript
- Vite
- [Chess.com Published-Data API](https://www.chess.com/news/view/published-data-api)

## AI usage

This is a university project for a web development course built around
working with AI.

I worked with Claude Code during the whole project. It helped me implement
the features, and it was a great help explaining everything along the way.
I reviewed and tested every change before committing it, and dropped or
simplified the parts I didn't want.

## Autopsy

1. I always load the player's last two months with games, then keep only the
   last 30 days. If someone hasn't played for a year, those two months are
   downloaded for nothing. I could check the dates first, but the screen shows
   the same result and the code stays simpler.

2. At first I didn't want the cache to expire at all, but a very active
   player can play several games in a few minutes, and the app would keep
   showing old data. So every cached response expires after 10 minutes.


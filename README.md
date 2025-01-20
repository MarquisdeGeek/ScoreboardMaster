# Scoreboard Master
A very simple score board app, used in the 2025 FOSDEM keynote


## Usage

* Copy the .env.sample to .env and adjust the parameters as appropriate
* Run with `node index.js`
* Visit the URL indicated in the output
* Append ?presentation to hide the score increment buttons
* Append ?game_id=12 to specify other score totals
* Append ?players=2 to specify a given number of players (this removes the names from a gamedata file)
* You should also be able to run this on a single machine, without sockets, with the main index.htm file

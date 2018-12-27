/*
* @Author: Vyn
* @Date:   2018-12-23 11:19:11
* @Last Modified by:   Vyn
* @Last Modified time: 2018-12-27 16:34:13
*/

const readlineSync = require('readline-sync');
const Game = require("./Game");
const Ai = require("./Ai");
const utils = require("./utils")

let players = [{}, {ai: null, lastBoard: null}, {ai: null, lastBoard: null}]
let training = false;

for (let i = 2; i < process.argv.length; ++i)
{
	if (process.argv[i] == "-debug")
		utils.EnableDebug(true);
	if (process.argv[i] == "-ai1")
		players[1].ai = new Ai(1);
	if (process.argv[i] == "-ai2")
		players[2].ai = new Ai(2);
	if (process.argv[i] == "-train")
		training = true;
}

let game = new Game;
let nbPlayer1Win = 0;
let nbPlayer2Win = 0;

function Play()
{
	game.Reset();
	if (players[1].ai)
		players[1].ai.Reset();
	if (players[2].ai)
		players[2].ai.Reset();
	players[1].lastBoard = null;
	players[2].lastBoard = null;

	let currentPlayer = 1;

	while (!game.IsGameFinished())
	{
		let caseId;

		if (players[currentPlayer].ai == null)
		{
			caseId = readlineSync.question("play (1-9):");
			if (game.Play(currentPlayer, caseId) == false)
			{
				console.log("Error, can't play (" + caseId + ")")
				return ;
			}
		}
		else
		{
			if (players[currentPlayer].lastBoard != null)
				players[currentPlayer].ai.GiveReward(0, players[currentPlayer].lastBoard, game.GetBoard());
			caseId = players[currentPlayer].ai.Play(game.GetBoard());
			players[currentPlayer].lastBoard = game.GetBoard().slice();
			if (game.Play(currentPlayer, caseId) == false)
			{
				console.log("Error, can't play (" + caseId + ")")
				return ;
			}
			
		}

		if (!training)
		{
			game.ShowBoard();
			console.log("------");
		}

		currentPlayer = (currentPlayer == 1 ? 2 : 1);
	}

	if (!training)
		console.log("Player " + game.GetWinner() + " won !")

	if (players[1].ai != null)
	{
		if (game.GetWinner() == 0)
		{
			players[1].ai.GiveReward(0, players[1].lastBoard, game.GetBoard());
		}
		else if (game.GetWinner() == 1)
		{
			players[1].ai.GiveReward(1, players[1].lastBoard, game.GetBoard());
			++nbPlayer1Win;
		}
		else
		{
			players[1].ai.GiveReward(-1, players[1].lastBoard, game.GetBoard());
		}
	}
	if (players[2].ai != null)
	{
		if (game.GetWinner() == 0)
		{
			players[2].ai.GiveReward(0, players[2].lastBoard, game.GetBoard());
		}
		else if (game.GetWinner() == 2)
		{
			players[2].ai.GiveReward(1, players[2].lastBoard, game.GetBoard());
			++nbPlayer2Win;
		}
		else
		{
			players[2].ai.GiveReward(-1, players[2].lastBoard, game.GetBoard());
		}
	}
}

function Train(learningRate, epsilon, nbLoop)
{
	console.log("Training with Learning Rate: " + learningRate + ", Epsilon: " + epsilon + " with " + nbLoop + " loop(s)");
	if (players[1].ai)
	{
		players[1].ai.SetLearningRate(learningRate);
		players[1].ai.SetEpsilon(epsilon);
	}
	if (players[2].ai)
	{
		players[2].ai.SetLearningRate(learningRate);
		players[2].ai.SetEpsilon(epsilon);
	}
	let startTime = process.hrtime();
	for (let i = 0; i < nbLoop; ++i)
	{
		//console.log("LOOP NB " + i);
		Play();
		//console.log("LOOP NB " + i + " FINISHED");
	}
	console.log("It took " + process.hrtime(startTime)[0] + " second(s)");
}

if (training)
{
	if (players[1].ai == null)
		players[1].ai = new Ai(1);
	if (players[2].ai == null)
		players[2].ai = new Ai(2);
	console.log("Starting training, it will take about 5 minutes (depends of your computer)");
	let startTime = process.hrtime();
	Train(0.1, 1, 10000);
	Train(0.1, 0.9, 10000);
	Train(0.1, 0.8, 10000);
	Train(0.1, 0.7, 10000);
	Train(0.1, 0.6, 10000);
	Train(0.1, 0.5, 10000);
	Train(0.1, 0.4, 10000);
	Train(0.1, 0.3, 10000);
	Train(0.1, 0.2, 10000);
	Train(0.1, 0.1, 10000);
	Train(0.1, 0.01, 10000);
	Train(0.1, 0, 10000);

	Train(0.1, 0.8, 10000);
	Train(0.1, 0.1, 10000);
	Train(0.1, 0, 10000);
	console.log("The training took a total of " + process.hrtime(startTime)[0] + " second(s)");
	//console.log("NB WIN PLAYER 1: " + nbPlayer1Win);
	//console.log("NB WIN PLAYER 2: " + nbPlayer2Win);
}
else
{
	Play();
}

if (players[1].ai != null)
	players[1].ai.SaveStates();

if (players[2].ai != null)
	players[2].ai.SaveStates();
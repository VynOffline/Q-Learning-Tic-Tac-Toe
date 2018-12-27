/*
* @Author: Vyn
* @Date:   2018-12-23 11:20:06
* @Last Modified by:   Vyn
* @Last Modified time: 2018-12-27 16:38:16
*/

const fs = require('fs')
const utils = require('./utils')

class Ai
{
	constructor(playerId)
	{
		this.playerId = playerId;
		//this.states = [{board: [], actions: [{caseId: 0, reward: 0}]}];
		this.epsilon = 0.00;
		this.learningRate = 0.1;
		this.gamma = 0.9;
		this.Reset();
		this.states = [];
		this.LoadStates();
	}

	Reset()
	{
		this.lastAction = null;
		this.lastReward = null;
	}

	SetEpsilon(newEpsilon)
	{
		this.epsilon = newEpsilon;
	}

	SetLearningRate(newLearningRate)
	{
		this.learningRate = newLearningRate;
	}

	GetPossibilities(board)
	{
		let possibilities = [];
		for (let i = 0; i < 9; ++i)
		{
			if (board[i] == 0)
				possibilities.push(i + 1);
		}
		return (possibilities);
	}

	Explore(board)
	{
		utils.PrintDebug("==Explore==");
		let possibilities = this.GetPossibilities(board);
		let selected = possibilities[Math.floor(Math.random() * possibilities.length)];
		return (selected);
	}

	Greed(board)
	{
		utils.PrintDebug("==Greed==");
		let currentStateData = this.GetStateFromMemory(board);
		utils.PrintDebug(currentStateData);
		let bestAction = this.GetBestAction(currentStateData);
		return (bestAction.caseId);
	}

	Play(board)
	{
		utils.PrintDebug("==PLAYING==")
		if (Math.random() < this.epsilon)
			this.lastAction = this.Explore(board);
		else
			this.lastAction = this.Greed(board);
		return (this.lastAction);
	}

	ShowStateInMemory()
	{
		utils.PrintDebug("States in memory:");
		utils.InspectDebug(this.states);
	}

	GetBestAction(state)
	{
		let bestAction = null;
		state.actions.forEach((action) => {
			if (bestAction == null || action.reward > bestAction.reward)
				bestAction = action;
		})
		return (bestAction);
	}

	GetAction(state, caseId)
	{
		for (let i = 0; i < state.actions.length; ++i)
		{
			if (state.actions[i].caseId == caseId)
				return (state.actions[i]);
		}
	}

	GiveReward(reward, oldBoard, newBoard)
	{
		utils.PrintDebug("==Giving Reward==");
		let oldState = this.GetStateFromMemory(oldBoard);
		let newState = this.GetStateFromMemory(newBoard);
		let bestAction = this.GetBestAction(newState);
		if (bestAction == null) {bestAction = {reward: 0}};
		this.GetAction(oldState, this.lastAction).reward += this.learningRate * (reward + (this.gamma * bestAction.reward) - this.GetAction(oldState, this.lastAction).reward)
	}

	GetStateFromMemory(board)
	{
		for (let i = 0; i < this.states.length; ++i)
		{
			let ok = 0;
			for (let j = 0; j < 9; ++j)
			{
				if (this.states[i].board[j] == board[j])
					++ok;
				if (ok == 9)
					return (this.states[i]);
			}
		}
		utils.PrintDebug("Creating new state");
		let state = {board: board.slice(), actions: this.GetPossibilities(board)}
		for (let i = 0; i < state.actions.length; ++i)
		{
			state.actions[i] = {caseId: state.actions[i], reward: 0};
		}
		utils.PrintDebug(state);
		this.states.push(state);
		return (state);
	}

	SaveStates()
	{
		fs.writeFileSync("memory_" + this.playerId + ".json", JSON.stringify(this.states));
	}

	LoadStates()
	{
		try {
			this.states = JSON.parse(fs.readFileSync('memory_' + this.playerId + '.json', 'utf8'))
			utils.PrintDebug("Memories found");
		} catch (e) {
			utils.PrintDebug("No memories found");
		}
	}
}

module.exports = Ai;
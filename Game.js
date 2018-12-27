/*
* @Author: Vyn
* @Date:   2018-12-23 11:19:55
* @Last Modified by:   Vyn
* @Last Modified time: 2018-12-27 16:38:48
*/

class Game
{
	constructor()
	{
		this.Reset();
	}

	Reset()
	{
		this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
	}

	GetBoard() {return (this.board);}
	
	GetBoardCase(x, y)
	{
		return (this.board[x + (y * 3)]);
	}

	CheckLine(line)
	{
		let caseOwner = this.GetBoardCase(0, line);
		if (caseOwner == 0)
			return (0);
		for (let x = 1; x < 3; ++x)
		{
			if (this.GetBoardCase(x, line) != caseOwner)
				return (0);
		}
		return (caseOwner);
	}

	CheckColumn(column)
	{
		let caseOwner = this.GetBoardCase(column, 0);
		if (caseOwner == 0)
			return (0);
		for (let y = 1; y < 3; ++y)
		{
			if (this.GetBoardCase(column, y) != caseOwner)
				return (0);
		}
		return (caseOwner);
	}

	HasWin(playerId)
	{
		for (let y = 0; y < 3; ++y)
		{
			let winner = this.CheckLine(y);
			if (winner == playerId)
				return (true);
		}
		for (let x = 0; x < 3; ++x)
		{
			let winner = this.CheckColumn(x);
			if (winner == playerId)
				return (true);
		}
		let caseOwner = this.GetBoardCase(0, 0);
		if (caseOwner == playerId)
		{
			if (this.GetBoardCase(1, 1) == caseOwner && this.GetBoardCase(2, 2) == caseOwner)
				return(true)
		}
		
		caseOwner = this.GetBoardCase(0, 2);
		if (caseOwner == playerId)
		{
			if (this.GetBoardCase(1, 1) == caseOwner && this.GetBoardCase(2, 0) == caseOwner)
				return(true)
		}
		return (false);
	}

	GetWinner()
	{
		if (this.HasWin(1))
			return (1);
		if (this.HasWin(2))
			return (2);
		return (0);
	}

	IsGameFinished()
	{
		if (this.GetWinner() != 0)
			return (true);
		for (let i = 0; i < this.board.length; ++i)
		{
			if (this.board[i] == 0)
				return (false);
		}
		return (true);
	}

	Play(playerId, caseId)
	{
		caseId = caseId - 1;
		if (caseId < 0 || caseId > 8)
			return (false);
		if (this.board[caseId] == 0)
		{
			this.board[caseId] = playerId
			return (true);
		}
		return (false);
	}

	ShowBoard()
	{
		for (let i = 0; i < 9; ++i)
		{
			if (this.board[i] == 1)
				process.stdout.write("X ");
			else if (this.board[i] == 2)
				process.stdout.write("O ");
			else
				process.stdout.write("* ");
			if (i % 3 == 2)
			{
				process.stdout.write("\n")
			}
		}
	}
}

module.exports = Game;
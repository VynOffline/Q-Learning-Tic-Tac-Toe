# Q-Learning-Tic-Tac-Toe

This is a simple Tic Tac Toe game playable in your terminal. Play against your friends or an AI.

## Installation

*You must have **Node.js** and **npm** installed*  
Simply clone this repository then go in and install npm dependencies that's all :)  
Here are the 3 commands:
```
git clone https://github.com/VynOffline/Q-Learning-Tic-Tac-Toe.git
cd Q-Learning-Tic-Tac-Toe
npm install
```

## Usage

```
node index.js
```
You can give some parameters to the program:  
**-ai1**: The first player will be an AI  
**-ai2**: The second player will be an AI  
**-train**: This will train the AI, fighting against herself  
**-debug**: This will show some debug informations about statements, rewards, board, etc.  (You can't use it if you used -train)

## Quick start
```
node index.js -train
node index.js -ai1
```
This will train the AI then start a match with the AI as first player

## Don't forget
The AI is not trained when you cloned the repository, don't forget to train her!  
The AI is not perfect and will still learn during your match :)

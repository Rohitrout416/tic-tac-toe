const board = document.querySelector(".board");
const cells = document.querySelectorAll(".cell");
const Status = document.querySelector(".status");
const resetButton = document.querySelector(".reset");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

updateStatus(null);

function checkWin(board){
    for(const pattern of winningCombinations){
        const [a, b, c] = pattern;
        if(board[a] && (board[a] === board[b] && board[a] === board[c])){
            return board[a];
        }
    }

    return board.includes('') ? null : 'Tie';
}

function updateStatus(winner) {
    if (winner === 'Tie') 
        Status.textContent = "It's a tie!";
    else if (winner) 
        Status.textContent = `${winner} wins!`;
    else 
        Status.textContent = `${currentPlayer}'s turn`;
}

function minimax(board, depth, isMaximizing){
    const winner = checkWin(board);
    if(winner=='O') return 10-depth;
    if(winner=='X') return depth-10;
    if(winner=='Tie') return 0;

    if(isMaximizing){
        let bestScore = -Infinity;
        for(let i=0; i<9; i++){
            if(board[i]==''){
                board[i]='O';
                let score = minimax(board, depth+1, false);
                board[i]='';

                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;
    }

   else {
        let bestScore=Infinity;
        for(let i=0; i<9; i++){
            if(board[i]==''){
                board[i]='X';
                let score = minimax(board, depth+1, true);
                board[i]='';

                bestScore = Math.min(score, bestScore);
            }
        }

        return bestScore;
    }
}

function aiMove(){
    let bestScore = -Infinity;
    let bestIndex = 0;
    for(let i=0; i<9; i++){
        if(gameBoard[i]==''){
            gameBoard[i]='O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i]='';

            if(score>bestScore){
                bestScore=score;
                bestIndex=i;
            }
        }
    }

    gameBoard[bestIndex] = 'O';
    cells[bestIndex].textContent = 'O';
    currentPlayer='X';

    const winner = checkWin(gameBoard);
    updateStatus(winner);
    if(winner) gameActive=false;
}

function handleClick(e){
    const index = e.target.getAttribute('data-index');

    if(gameBoard[index]!=='' || !gameActive || currentPlayer=='O') return;

    gameBoard[index]='X';
    cells[index].textContent = 'X';
    const winner = checkWin(gameBoard);
    updateStatus(winner);

    if(winner) {
        gameActive=false;
        return;
    }

    currentPlayer='O';
    setTimeout(aiMove, 500);
}

function reset(){
    updateStatus(null);
    gameActive=true;
    gameBoard=['','','','','','','',''];
    currentPlayer='X';
    cells.forEach(cell => cell.textContent = '');
}

board.addEventListener('click', handleClick);
resetButton.addEventListener('click', reset);


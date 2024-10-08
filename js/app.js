var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var Score ;
var BallCaont ;
var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var gBoard;
var gGamerPos;
var intervalId ;



function initGame() {
	Score =0;
	BallCaont=2;
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);

}

randomBallPosition()
function randomBallPosition() {

	intervalId  = setInterval(function () {
		let randomBallPositioni = Math.floor(Math.random() * 8)+1;
		let randomBallPositionj = 	Math.floor(Math.random() * 10)+1;
		while(gBoard[randomBallPositioni][randomBallPositionj].gameElement!== null){
			randomBallPositioni =  Math.floor(Math.random() * 8)+1;
		    randomBallPositionj =Math.floor(Math.random() * 10)+1;
		}
        gBoard[randomBallPositioni][randomBallPositionj].gameElement = BALL;
		BallCaont++;
		
        renderCell({i:randomBallPositioni,j:randomBallPositionj}, BALL_IMG);
	},3500);
}



function buildBoard() {
	// Create the Matrix
	// var board = createMat(10, 12)
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}
            if((i==0&&j==Math.floor(board[0].length/2)) || (i==board.length-1&&j==Math.floor(board[0].length/2)||(i==Math.floor(board.length/2)&&j==0) || (i==Math.floor(board.length/2)&&j==board[0].length-1)) )
			{
				cell.type=FLOOR;
			}
			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })


			cellClass += currCell.type === FLOOR ? ' floor' : ' wall';			
			// TODO - change to short if statement
			// if (currCell.type === FLOOR) cellClass += ' floor';
			// else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To ES6 template string
			// strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';
			strHTML +=`\t<td class="cell ${cellClass}   onclick="moveTo(${i} ,  ${j} ,${false})" >\n`;

			// TODO - change to switch case statement
			// if (currCell.gameElement === GAMER) {
			// 	strHTML += GAMER_IMG;
			// } else if (currCell.gameElement === BALL) {
			// 	strHTML += BALL_IMG;
			// }
            switch (currCell.gameElement) {
				case GAMER:
				  strHTML += GAMER_IMG;
				  break;
				case BALL:
				  strHTML += BALL_IMG;
				  break;
			  }
			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	console.log('strHTML is:');
	console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j,ensure) {

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);
    var flag =false;
	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)||ensure) {

		if (targetCell.gameElement === BALL) {			
			Score++;
		    BallCaont--;
			console.log(BallCaont);
			renderScore()
			if(BallCaont==0)
			{
				flag=true;
				
			}
		}

		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);
		if(flag){
			clearInterval(intervalId);
			alert('You Won!');
		}

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}


function renderScore() {
	var elScore = document.getElementById('score');
    elScore.innerHTML= Score.toString() ;
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			if(i==Math.floor(gBoard.length/2) && j==0)
			{   console.log("Please")
				moveTo(Math.floor(gBoard.length/2), gBoard[0].length-1,true);
			}
			else{
			moveTo(i, j - 1,false);
			}
			break;
		case 'ArrowRight':
			if(i==Math.floor(gBoard.length/2) && j==gBoard[0].length-1)
			{
                moveTo(Math.floor(gBoard.length/2), 0,true);
			}
			else{
				
				moveTo(i, j + 1,false);
			}
			break;
		case 'ArrowUp':
			if(i==0 && j==Math.floor(gBoard[0].length/2))
			{
                moveTo(gBoard.length-1, Math.floor(gBoard[0].length/2),true);
			}
			else{
                moveTo(i - 1, j,false);
            }
			break;
		case 'ArrowDown':
			if(i==gBoard.length-1 && j==Math.floor(gBoard[0].length/2))
			{
                moveTo(0, Math.floor(gBoard[0].length/2),true);
			}
			else{
                moveTo(i + 1, j,false);
            }
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function onReset()
{
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = '';
	initGame();
	randomBallPosition();
	Score=0;
	renderScore()

	BallCaont=2;
}
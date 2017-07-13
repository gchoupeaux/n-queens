/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none 
// of them can attack each other
window.findNRooksSolution = function(n, rIndex, boardObj) {
  var rIndex = rIndex || 0;
  if (rIndex === 0) {
    var boardObj = new Board({n: n});  
  }
  var board = boardObj.rows();
  // root matrix one rook R1 C1 [0, 0]
  if (rIndex === 0) {
    boardObj.togglePiece(rIndex, 0);
  }
  rIndex++;
  if (rIndex === n) {
    console.log('Single solution for ' + n + ' rooks:', JSON.stringify(board));
    return board;
  }
  // for each colum of 2nd row
  for (var c = 0; c < board.length; c++) {
    // add rook
    boardObj.togglePiece(rIndex, c);
    // if no conflict => recursive call
    if (!boardObj.hasAnyRooksConflicts()) {
      findNRooksSolution(n, rIndex, boardObj);
    } else {
      boardObj.togglePiece(rIndex, c); 
    }
  }  
  return board;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none 
// of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = undefined; //fixme
  
  var fact = function fact(x) {
    if ( x === 0) {
      return 1;
    }
    return x * fact(x - 1); 
  };
  
  

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return fact(n);
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none 
// of them can attack each other
window.findNQueensSolution = function(n, rIndex, boardObj) {
  
  if (n === 0) {
    return [];
  }
  if (n === 2) {
    return [[0, 0], [0, 0]];
  }
  if (n === 3) {
    return [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  }
  
  
  var start = 0;
  var nbrQueens = 0;
  
  var checkForNQueens = function(n, start, rIndex, boardObj) {
    var rIndex = rIndex || 0;
    if (rIndex === 0) {
      var boardObj = new Board({n: n});  
    }
    var board = boardObj.rows();
    // root matrix one rook R1 C1 [0, 0]
    if (rIndex === 0) {
      boardObj.togglePiece(0, start);
    }
    rIndex++;
    if (rIndex === n) {
      console.log('Single solution for ' + n + ' queens:', JSON.stringify(board));
      return boardObj;
    }
    // for each colum of 2nd row
    for (var c = 0; c < board.length; c++) {
      // add rook
      boardObj.togglePiece(rIndex, c);
      // if no conflict => recursive call
      if (!boardObj.hasAnyQueensConflicts()) {
        checkForNQueens(n, start, rIndex, boardObj);
      } else {
        boardObj.togglePiece(rIndex, c); 
      }
    }  
    return boardObj;  
  }; 
  
  while (nbrQueens < n && start < n) {
    
    var ourBoard = checkForNQueens(n, start, 0);
    if (n === 6 && start === 3) {
      debugger;
    }
    nbrQueens = ourBoard.piecesAmount();
    start++;
  }
  
  return ourBoard.rows();
  
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

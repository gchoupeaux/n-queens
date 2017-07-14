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
  
  
  var fact = function fact(x) {
    if ( x === 0) {
      return 1;
    }
    return x * fact(x - 1); 
  };
  
  var solutionCount = fact(n); //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none 
// of them can attack each other
// window.findNQueensSolution = function(n, rIndex, boardObj) {

  
//   if (n === 0) {
//     return [];
//   }
//   if (n === 2) {
//     return [[0, 0], [0, 0]];
//   }
//   if (n === 3) {
//     return [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
//   }
  
  
//   var start = 0;
//   var nbrQueens = 0;

//   var checkForNQueens = function(n, start, rIndex, boardObj) {
//     var rIndex = rIndex || 0;
//     if (rIndex === 0) {
//       var boardObj = new Board({n: n});  
//     }
//     var board = boardObj.rows();
//     // root matrix one rook R1 C1 [0, 0]
//     if (rIndex === 0) {
//       boardObj.togglePiece(0, start);
//     }
//     rIndex++;
//     if (rIndex === n) {
//       console.log('Single solution for ' + n + ' queens:', JSON.stringify(board));
//       return boardObj;
//     }
//     // for each colum of 2nd row
//     for (var c = 0; c < board.length; c++) {
//       // add rook
//       boardObj.togglePiece(rIndex, c);
//       // if no conflict => recursive call
//       if (!boardObj.hasAnyQueensConflicts()) {
//         checkForNQueens(n, start, rIndex, boardObj);
//       } else {
//         boardObj.togglePiece(rIndex, c); 
//       }
//     }  
//     return boardObj;  
//   }; 
  
//   while (nbrQueens < n && start < n) {
    
//     var ourBoard = checkForNQueens(n, start, 0);
//     if (n === 6 && start === 3) {
//       debugger;
//     }
//     nbrQueens = ourBoard.piecesAmount();
//     start++;
//   }
  
//   return ourBoard.rows();
  
// };


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
  
  var Tree = function(value) {
    this.value = value;
    this.children = [];
  };

  Tree.prototype.addChild = function(child) {
    if (!child || !(child instanceof Tree)) {
      child = new Tree(child);
    }

    if (!this.isDescendant(child)) {
      this.children.push(child);
    } else {
      throw new Error('That child is already a child of this tree');
    }
    // return the new child node for convenience
    return child;
  };

  /**
  * check to see if the provided tree is already a child of this
  * tree __or any of its sub trees__
  */
  Tree.prototype.isDescendant = function(child) {
    if (this.children.indexOf(child) !== -1) {
      // `child` is an immediate child of this tree
      return true;
    } else {
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].isDescendant(child)) {
          // `child` is descendant of this tree
          return true;
        }
      }
      return false;
    }
  };

  /**
  * remove an immediate child
  */
  Tree.prototype.removeChild = function(child) {
    var index = this.children.indexOf(child);
    if (index !== -1) {
      // remove the child
      this.children.splice(index, 1);
    } else {
      throw new Error('That node is not an immediate child of this tree');
    }
  };
  
  var arrCopy = function (arr) {
    
    var newArr = [];
    var tempArr = [];
    // rebuild array
    for (var r = 0; r < arr.length; r++) {
      for (var c = 0; c < arr.length; c++) {
        tempArr.push(arr[r][c]);
      }
      newArr.push(tempArr);
      tempArr = [];
    }
    return newArr;
    
    
  };
  
  var buildTree = function(n, r, node, myTree) {
    
    // create tree with root empty board of size n
    if (node === undefined ) {
      var boardObj = new Board({n: n});
    } else {
      var boardObj = node.value || new Board({n: n});
    }

    // retrieving a new board from last child
    var board = boardObj.rows();
    var boardCopy = arrCopy(board); // WEIRD!!!
    var child;
    var tempBoardObj;
    
    // row increment
    var r = (r === undefined) ? -1 : r;
    r++;
    
    // create myTree
    if ( r === 0 ) {
      var myTree = new Tree(boardObj);  
      node = myTree;
    }
    
    if ( r === 2 ) {
      debugger; 
    }
    
    //base case 
    if ( n === r) {
      return myTree;
    }
    
    // iterate through row 0
    for (var c = 0; c < n; c++) {
      // create a copy the current parent
      tempBoardObj = new Board(boardCopy);
      tempBoardObj.togglePiece(r, c);
      // if there is no confict
      if (!tempBoardObj.hasAnyQueensConflicts()) {
        
        /* -------------JUST FOR DEBUG---------------------- */
        //var x = child.rows();
        /* -------------------------------------------------*/
        
        // add this child to the parent
        child = node.addChild(tempBoardObj);
        
        // call recursive function
        node = buildTree(n, r, child, myTree);
      } else {
        tempBoardObj.togglePiece(r, c);
      }
    }  
    
    //if (node.children.length === 0) {
    return myTree;
    //}   
  };
  
  var getSolutionBoard = function(myTree) {
    //base case
    if (!myTree.children.length) {
      /* -------------JUST FOR DEBUG----------------------*/
      //var x = myTree.value.rows();
      /* -------------------------------------------------*/
      return myTree;
    } 
    for (var i = 0; i < myTree.children.length; i++) {
    
      /* -------------JUST FOR DEBUG----------------------*/
      //var x = myTree.children[i].value.rows();
      /* -------------------------------------------------*/
      return getSolutionBoard(myTree.children[i]);
    }
  };
  
  // var buildTree = function(n, r, tempBoardObj, myTree) {
    
  //   // create tree with root empty board of size n
  //   var boardObj = tempBoardObj || new Board({n: n});

  //   // retrieving a new board from last child
  //   var board = boardObj.rows();
  //   var boardCopy = arrCopy(board); // WEIRD!!!
  //   var child;
  //   var tempBoardObj;
    
  //   // row increment
  //   var r = (r === undefined) ? -1 : r;
  //   r++;
    
  //   // create myTree
  //   if ( r === 0 ) {
  //     var myTree = new Tree(boardObj);  
  //     node = myTree;
  //   }
    
  //   if ( r === 2 ) {
  //     debugger; 
  //   }
    
    
    
  //   if ( r > 0 ) {
  //     // add this child to the parent
  //     node = node.addChild(tempBoardObj);
  //   }
    
  //   //base case 
  //   if ( n === r) {
  //     return myTree;
  //   }
    
  //   // iterate through row 0
  //   for (var c = 0; c < n; c++) {
  //     // create a copy the current parent
  //     tempBoardObj = new Board(boardCopy);
  //     tempBoardObj.togglePiece(r, c);
  //     // if there is no confict
  //     if (!tempBoardObj.hasAnyQueensConflicts()) {
        
  //       /* -------------JUST FOR DEBUG----------------------*/
  //       //var x = child.rows();
  //       /* -------------------------------------------------*/
        
        
        
  //       // call recursive function
  //       node = buildTree(n, r, tempBoardObj, myTree);
  //     } else {
  //       tempBoardObj.togglePiece(r, c);
  //     }
  //   }  
    
  //   //if (node.children.length === 0) {
  //   return myTree;
  //   //}   
  // };
  
  // var getSolutionBoard = function(myTree) {
  //   //base case
  //   if (!myTree.children.length) {
  //     /* -------------JUST FOR DEBUG----------------------*/
  //     //var x = myTree.value.rows();
  //     /* -------------------------------------------------*/
  //     return myTree;
  //   } 
  //   for (var i = 0; i < myTree.children.length; i++) {
    
  //     /* -------------JUST FOR DEBUG----------------------*/
  //     //var x = myTree.children[i].value.rows();
  //     /* -------------------------------------------------*/
  //     return getSolutionBoard(myTree.children[i]);
  //   }
  // };
  
  var myTree = buildTree(n);
  var boardObj = getSolutionBoard(myTree).value;
  var solution = boardObj.rows();
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
  
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

/**
* Takes a file containing a text based maze of 0s and 1s as an argument and recursively
* finds a way to the exit if one exists (S for start, E for exit)
*
* Bugs: does not always find the most efficient route, could be improved
*/
class Maze {
  constructor() {
    this.file = `12 11
0 0 0 0 0 0 0 0 0 0 0 
0 S 1 1 1 1 1 1 1 1 0 
0 0 0 0 0 1 0 0 0 0 0 
0 1 1 1 0 1 0 1 1 1 0 
0 0 0 1 1 1 1 1 0 0 0 
0 1 0 0 0 1 0 0 0 1 0 
0 1 1 0 0 1 0 1 1 1 0 
0 1 1 0 0 1 0 1 1 1 0 
0 1 0 0 1 1 1 1 1 1 0 
0 1 0 1 1 1 1 1 0 1 0 
0 1 1 0 0 1 0 0 E 1 0 
0 0 0 0 0 0 0 0 0 0 0`;
    this.myMaze = this.loadMaze(this.file); // will contain the 1s and 0s that comprise the "maze"
    this.exitPath = []; // will contain the x, y values of the correct S to E path
    this.startLocation = this.getStart(); // will contain the x, y values of S location
    this.solved = 0; // value of 0 for no attempt made, 1 for solution found and 2 for unsolvable
  }

  /**
  * makes an array of the first 2 digits of the passed file and fills it with the remaining maze data in the file
  *
  * @param (fileName) the file passed in args[0] that contains the maze map data
  * @return char array of the puzzle map organized into an iterable data type
  */
  loadMaze(content) {
    let maze = content.split("\n");
    if(maze[0].length < 6)
      maze.shift(); // removes size indicators
    for(let i = 0; i < maze.length; ++i) {
      maze[i] = maze[i].trim();
      maze[i] = maze[i].split(" ");
    }
    while(maze[maze.length - 1] === "")
      maze.pop();
    return maze;
  }

  // sets "startLocation" array values to x, y values of 'S' location
  getStart() {
    for(let i = 0; i < this.myMaze.length; ++i) {
      if(this.myMaze[i].indexOf('S') !== -1) {
        let loc = [];
        loc.push(i);
        loc.push(this.myMaze[i].indexOf('S'));
        return loc;
      }
    }
    console.log("ERROR ==> NO START LOCATION PROVIDED IN MAZE");
  }

  // changes values of "myMaze" to '2' at locations saved in "exitPath" array
  markExitPath() {
    if(this.solved === 1) {
     for(let i = 0; i < this.exitPath.length; i += 1) {
       this.myMaze[this.exitPath[i][0]][this.exitPath[i][1]] = '2';
     }
     this.exitPath.reverse();
    }
  }

  /**
  * takes the data stored in the given array and prints its contents
  *
  * @param (maze) the array containing the maze data
  */
  printMaze() {
    if(this.solved === 0) {
     console.log("Initial State: ");
    }
    if(this.solved === 1) {
     console.log("Solution State: ");
    }
    if(this.solved === 2) {
     console.log("No solution!");
     return;
    }
    let string = "";
    for (var i = 0; i <= 4 * this.myMaze[0].length; i++) {
      string = string.concat("-");
    }
    console.log(string);
    for (i = 0; i < this.myMaze.length; i++) {
      string = "";
      for (var j = 0; j < this.myMaze[i].length; j++) {
        string = string.concat("| " + this.myMaze[i][j] + " ");
      }
      console.log(string + "|");
      string = "";
      for (var k = 0; k <= 4 * this.myMaze[0].length; k++) {
         string = string.concat("-");
      }
      console.log(string);
    }
    console.log("");
  }

  /**
  * uses recursive backtracking to check if there is a route from start to finish and if there is,
  * log it into the exitPath array
  *
  * @param (x) the x coordinate of the current position in the maze array
  * @param (y) the y coordinate of the current position in the maze array
  * @return true if the coordinates point to a valid move position, false if not
  */
  exploreMyMaze(x, y) {
    // ------ base case(s) ------
    // if move out of bounds
    if(x >= this.myMaze.length || x < 0 || y >= this.myMaze[x].length || y < 0) {
      return false;
    }
    // if wall or previous move
    if(this.myMaze[x][y] === '0' || this.myMaze[x][y] === '2') {
      return false;
    }
    // if solved
    if(this.myMaze[x][y] === 'E') {
      this.solved = 1;
      return true;
    }

    this.myMaze[x][y] = '2'; // mark path as traveled

    // ------ recursive calls ------
    if(this.exploreMyMaze((x + 1), y) === true) {
      this.exitPath.push([x, y]); // save coordinates of good path
      return true;
    }
    else if (this.exploreMyMaze((x - 1), y) === true) {
      this.exitPath.push([x, y]);
      return true;
    }
    else if (this.exploreMyMaze(x, (y + 1)) === true) {
      this.exitPath.push([x, y]);
      return true;
    }
    else if (this.exploreMyMaze(x, (y - 1)) === true) {
      this.exitPath.push([x, y]);
      return true;
    }
    else {
      this.solved = 2; // if a solution hasn't been found (unsolvable)
      return false;
    }
  }
}

let theMaze = new Maze();
// console.log(theMaze);

// // print initial maze
// theMaze.printMaze();

// // solve the maze
// theMaze.exploreMyMaze(theMaze.startLocation[0], theMaze.startLocation[1]);

// // print solved maze
// theMaze.myMaze = theMaze.loadMaze(theMaze.file); // reloads original maze
// theMaze.markExitPath(); // if solution was found, marks location points in reloaded "myMaze" with a 2
// theMaze.myMaze[theMaze.startLocation[0]][theMaze.startLocation[1]] = 'S'; // sets start location back to S (from 2)
// theMaze.printMaze();

export default theMaze;
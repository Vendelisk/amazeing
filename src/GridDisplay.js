import theMaze from './Maze.js';

// Use this for exitPath searching
/* !! WARNING !!
things like this will happen: 
  for (var id in maze) {
    console.log(maze[id]);
  }
will include this function as an addition to all arrays!!
doesn't affect current operations but good to note
*/
Array.prototype.findArray = function(val) {
  var hash = {};
  for(var i=0; i<this.length; i++) {
    hash[this[i]] = i;
  }
  return (hash.hasOwnProperty(val)) ? hash[val] : -1;
}

function updateGrid(root) {
  let maze = theMaze.myMaze;
  let numCols = maze[0].length;
  let numRows = maze.length;

  root.getElementById("container").remove();
  let container = document.createElement('div');
  container.setAttribute('id', 'container');

  // This will contain the rows
  let columns = [];

  // populate columns array
  for(let i = 0; i < numCols; i++) {
    let column = document.createElement('div');
    let colNum = 'col-' + i;
    column.classList.add(colNum);
    column.classList.add('column');
    columns.push(column);
  }

  let rows = [];

  // populate rows array
  for(let i = 0; i < numRows; i++) {
    let row = document.createElement('div');
    let rowNum = 'row-' + i;
    row.classList.add(rowNum);
    row.classList.add('row');
    rows.push(row);
  }

  // Attach the created elements to the shadow dom
  root.appendChild(container);
  for(let column of columns) {
    container.appendChild(column);
    for(let row of rows)
      column.appendChild(row.cloneNode(true));
  }

  let colName = ".col-";
  let rowName = ".row-";

  for(let i = 0; i < numCols; ++i) {
    var c = root.querySelector(colName + i);
    for(let j = 0; j < numRows; ++j) {
      var cr = c.querySelector(rowName + j);
      if(maze[j][i] === '0')
        cr.classList.add('wall');
      else if(maze[j][i] === 'S')
        cr.classList.add('start');
      else if(maze[j][i] === 'E')
        cr.classList.add('end');
      else if(maze[j][i] === '2') {
        var order = theMaze.exitPath.findArray([j,i]);

        setTimeout(function(){ 
          root.querySelector(colName+i).querySelector(rowName+j).classList.add('filled');
        }, (100 * order));
      }
    }
  }

  if(theMaze.solved === 2) 
    alert("This maze isn't possible.  You know.... without a big hammer or a rocket launcher or something.  🙃");
}

function getCurCol(cols) {
  let col = document.querySelector("grid-display");
  // console.log(col);
  if(col) 
    col = col.getAttribute("higlight");
  else 
    return Array(9).fill(false);

  if(col === "-1")
    col = "0";
  // console.log(cols[col]);
  return Array(9).fill(false);
}

class GridDisplay extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({mode: 'open'});

    const container = document.createElement('div');
    container.setAttribute('id', 'container');

    // move/click handlers cover click/drag instrument toggles
    container.ondragstart = function(event) {return false} // don't try to drag my div!!
    container.ondrop = function(event) {return false}

    // Get value from data-cols="here"
    // const numCols = this.getAttribute('data-cols');
    let numCols = theMaze.myMaze[0].length;
    const numRows = theMaze.myMaze.length;

    // This will contain the rows
    let columns = [];

    // populate columns array
    for(let i = 0; i < numCols; i++) {
      let column = document.createElement('div');
      let colNum = 'col-' + i;
      column.classList.add(colNum);
      column.classList.add('column');
      columns.push(column);
    }

    // TODO
    // this returns list, need to collect those to return
    // console.log(columns[0].children);
    // for each child, if .classList.contains('filled') then true

    // One row for each instrument
    let rows = [];

    // populate rows array
    for(let i = 0; i < numRows; i++) {
      let row = document.createElement('div');
      let rowNum = 'row-' + i;
      row.classList.add(rowNum);
      row.classList.add('row');
      rows.push(row);
    }

    this.currentColumn = getCurCol(columns);


    const style = document.createElement('style');
    style.textContent = `
    :host {
      display: inline-block;
      width: 70%;
      height: 120px;
    }

    #container {
      margin-top: 5%;
      margin-bottom: 25%;
      width: 100%;
      height: 100%;
      display: flex;
    }

    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .column.highlight {
      background-color: gray;
    }

    .column.highlight .row {
      transition-duration: 0.4s;
    }

    .column.highlight .row.filled {
      transition: background-color 0.1s;
    }

    .column.highlight .row.filled {
      background-color: white;
    }

    .row {
      min-height: 25px;
      flex: 1;
      margin: 1px;
      background-color: lightgray;
      transition: background-color 0s;
    }

    .row.filled {
      background-color: teal;
    }

    .row.end {
      background-color: red;
    }

    .row.start {
      background-color: green;
    }

    .wall {
      background-image: url("brick-wall.jpeg");
    }

    button, select {
      display:inline-block;
      opacity:.9;
      padding:0.35em 1.2em;
      border:0.1em solid #FFFFFF;
      margin:0 0.3em 0.3em 0;
      border-radius:0.12em;
      box-sizing: border-box;
      text-decoration:none;
      font-family:'Roboto',sans-serif;
      font-weight:300;
      background-color:#282C34;
      // color:#FFFFFF;
      text-align:center;
      transition: all 0.2s;
    }
    button:hover, select:hover {
      // color:#000000;
      opacity:1;
      // background-color:#FFFFFF;
    }
    select {
      background-color:grey;
    }
    .green {
      background-color:green;
    }
    .blue {
      background-color:blue;
    }
    .violet {
      background-color:#662C92;
    }
    .red {
      background-color:red;
    }
    // @media all and (max-width:30em) {
    //   button, select {
    //     display:block;
    //     margin:0.4em auto;
    //   }
    }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    shadow.appendChild(container);
    for(let column of columns) {
      container.appendChild(column);
      for(let row of rows)
        column.appendChild(row.cloneNode(true));
    }

    // MAZE SWAP BUTTON
    const swapBtn = document.createElement('select');
    swapBtn.innerHTML = "Swap";

    // Create array of options to be added
    var opts = [`1 S 1 1 1
    1 0 0 0 0
    1 1 1 1 1
    0 1 0 0 E
    1 1 1 0 1`,
    `S 1 0 0 0 0 0 0 0 0 0 0
    0 1 0 1 1 1 1 1 1 1 1 1
    0 1 1 1 0 0 0 0 0 0 1 0
    0 0 0 0 0 1 1 1 1 1 1 0
    0 1 1 1 1 1 0 0 0 0 0 0
    0 0 0 1 0 0 0 1 1 1 1 0
    0 1 1 1 1 1 1 1 0 0 1 0
    0 0 0 0 0 0 0 0 0 0 1 E`,
    `0 0 0 0 0 0 0 0 0 0 0 
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
    0 0 0 0 0 0 0 0 0 0 0 `,
    `0 0 0 0 0 0 0 0 0 0 0 
    0 S 1 1 1 1 1 1 1 1 0 
    0 0 0 0 0 1 0 0 0 0 0 
    0 1 1 0 1 0 1 1 1 1 0 
    0 0 0 1 1 1 1 1 0 0 0 
    0 1 0 0 0 1 0 0 0 1 0 
    0 1 1 0 0 1 0 1 1 1 0 
    0 1 1 0 0 1 0 1 1 1 0 
    0 1 0 0 1 1 1 1 1 1 0 
    0 1 0 1 1 1 1 1 0 1 0 
    0 1 1 0 0 1 0 0 E 1 0 
    0 0 0 0 0 0 0 0 0 0 0 `,
    `0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0
    0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0
    0 S 1 1 1 1 1 1 1 1 0 0 0 0 1 0 0 0 0 0 1 1 0
    0 0 0 0 1 1 0 0 0 0 0 0 0 0 1 0 0 0 0 1 1 0 0
    0 1 1 0 1 0 1 1 1 1 0 0 0 0 1 1 1 1 1 1 1 0 0
    0 0 0 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 1 0 0 0 1 0 0 0 1 0 0 0 1 1 1 1 1 1 1 1 0 0
    0 1 1 0 0 1 0 1 1 1 0 0 0 0 0 0 0 0 0 0 1 0 0
    0 1 1 0 0 1 0 1 1 1 0 0 1 1 1 1 1 1 0 0 1 0 0
    0 1 0 0 1 1 1 1 1 1 0 0 1 0 0 0 0 1 0 0 1 0 0
    0 1 0 1 1 1 1 1 0 1 0 0 1 1 1 0 0 1 1 1 1 0 0
    0 1 1 0 0 1 0 0 1 1 0 1 0 0 1 1 0 1 0 0 0 0 0
    0 0 0 0 0 1 0 0 1 0 0 1 0 0 1 1 0 0 0 0 0 0 0
    0 0 0 0 0 1 1 1 1 1 1 1 0 1 1 1 1 1 1 1 1 0 0
    0 1 1 1 1 1 1 1 1 1 0 0 0 1 0 0 0 0 0 0 1 0 0
    0 0 0 1 0 1 0 0 0 0 1 1 1 1 0 0 1 E 0 0 1 0 0
    0 1 1 1 1 0 1 1 1 1 0 0 0 1 0 0 1 0 0 0 1 0 0
    0 0 0 1 1 1 1 1 0 0 0 0 0 1 0 0 1 1 1 1 1 0 0
    0 1 0 0 0 1 0 0 0 1 0 0 1 1 1 0 0 0 0 0 0 0 0
    0 1 1 0 0 1 0 1 1 1 0 0 0 0 1 0 0 0 0 1 1 1 0
    0 1 1 0 0 1 0 1 1 1 0 0 0 0 1 0 0 0 0 1 0 0 0
    0 1 0 0 1 1 1 1 1 1 0 0 1 1 1 1 1 1 0 1 0 0 0
    0 1 0 1 1 1 1 1 0 1 0 0 1 0 0 1 0 0 0 1 0 0 0
    0 1 1 0 0 1 0 0 1 1 0 1 1 0 0 1 0 0 0 1 0 0 0
    0 0 0 0 0 0 0 0 1 0 0 1 0 1 1 1 1 1 1 1 0 0 0
    0 0 0 0 0 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0`];

    //Create and append the options
    for (var i = 0; i < opts.length; i++) {
      var option = document.createElement("option");
      option.value = opts[i];
      option.text = "maze-" + i;
      swapBtn.appendChild(option);
    }
    swapBtn.selectedIndex = 2;

    swapBtn.onchange = function() {
      theMaze.file = swapBtn.value;
      theMaze.myMaze = theMaze.loadMaze(theMaze.file);
      theMaze.exitPath = [];
      theMaze.startLocation = theMaze.getStart();
      theMaze.solved = 0;
      updateGrid(shadow);
    };

    shadow.appendChild(swapBtn);

    // SOLUTION BUTTON
    const solveBtn = document.createElement('button');
    solveBtn.innerHTML = "Solve";
    solveBtn.classList.add('green');
    solveBtn.addEventListener ("click", function() {
      if(theMaze.solved !== 1) {
        theMaze.exploreMyMaze(theMaze.startLocation[0], theMaze.startLocation[1]);
        theMaze.myMaze = theMaze.loadMaze(theMaze.file); // reloads original maze
        theMaze.markExitPath(); // if solution was found, marks location points in reloaded 
        theMaze.myMaze[theMaze.startLocation[0]][theMaze.startLocation[1]] = 'S'; // sets start location back to S (from 2)
      }
      updateGrid(shadow);
    });
    shadow.appendChild(solveBtn);

    // CREATE MAZE BUTTON
    const createBtn = document.createElement('button');
    createBtn.innerHTML = "New Maze";
    createBtn.classList.add('blue');
    createBtn.addEventListener ("click", function() {
      createMaze(shadow);
    });
    shadow.appendChild(createBtn);

    // SAVE MAZE BUTTON
    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = "Save Maze";
    saveBtn.classList.add('violet');
    saveBtn.addEventListener ("click", function() {
      getNewPoints(shadow);
    });
    shadow.appendChild(saveBtn);

    // SET START BUTTON
    const courseBtn = document.createElement('button');
    courseBtn.innerHTML = "Set Goals";
    courseBtn.classList.add('red');
    courseBtn.addEventListener ("click", function() {
      setPoints(shadow);
    });
    shadow.appendChild(courseBtn);


    updateGrid(shadow);
  }
}

function getNewPoints(root) {
  alert('Select a start point');
  root.getElementById('container').onclick = function(event) {
    var CL = event.target.classList;
    if(CL.contains('row') && !CL.contains('wall')) {
      event.target.classList.toggle('start');
      // remove listener
      root.getElementById('container').onclick = function(){};
      getNewEnd(root);
    }
  };
}

function clearPoints(root) {
  var s = root.querySelectorAll(".start");
  if(s[0])
    s[0].classList.toggle('start');
  var e = root.querySelectorAll(".end");
  if(e[0])
    e[0].classList.toggle('end');
  var f = root.querySelectorAll(".filled")
  for(var x of f) {
    x.classList.toggle('filled');
  }
}

function setPoints(root) {
  clearPoints(root);
  getNewPoints(root);
}

function getNewEnd(root) {
  alert('Select an end point');
  root.getElementById('container').onclick = function(event) {
    var CL = event.target.classList;
    if(CL.contains('row') && !CL.contains('wall') && !CL.contains('start')) {
      CL.toggle('end');
      // remove listener
      root.getElementById('container').onclick = function(){};
      getNewMaze(root);
    }
  };
}

function getNewMaze(root) {
  let maze = [];

  let colName = ".col-";
  let rowName = ".row-";

  let numCols = root.querySelectorAll(`[class*="col-"]`).length;
  let numRows = root.querySelectorAll(`.col-0 > [class*="row-"]`).length;

  for(let i = 0; i < numRows; ++i) {
    let row = [];
    for(let j = 0; j < numCols; ++j) {
      var c = root.querySelector(colName + j);
      var cr = c.querySelector(rowName + i);
      if(cr.classList.contains('wall')) {
        row.push('0');
      }
      else if(cr.classList.contains('start'))
        row.push('S');
      else if(cr.classList.contains('end'))
        row.push('E');
      else
        row.push('1');
      // if(maze[j][i] === '0')
      //   cr.style.backgroundImage = "url('brick-wall.jpeg')";
      // else if(maze[j][i] === 'S')
      //   cr.style.backgroundColor = "green";
      // else if(maze[j][i] === 'E')
      //   cr.style.backgroundColor = "red";
      // else if(maze[j][i] === '2')
      //   cr.style.backgroundColor = "teal";
    }
    maze.push(row);
  }

  // update maze data
  theMaze.file = flattenMaze(maze);
  theMaze.myMaze = theMaze.loadMaze(theMaze.file);
  theMaze.exitPath = [];
  theMaze.startLocation = theMaze.getStart();
  theMaze.solved = 0;
}

function flattenMaze(maze) {
  for(let i = 0; i < maze.length; ++i) {
    maze[i] = maze[i].join(" ");
  }
  maze = maze.join("\n");
  return maze;
}

function askSize() {
  var size = prompt("Maze size: ", "8x9");
  if(size === null || size === "") {
    size = "8x9";
  }
  size = size.split('x');
  if(size[0] > 50) {
    size[0] = 50;
    alert("Max width exceeded.  Setting to 50.");
  }
  if(size[1] > 50) {
    size[1] = 50;
    alert("Max height exceeded.  Setting to 50.");
  }
  return size;
}

function createMaze(root) {
  if(root.getElementById("container") !== null)
    root.getElementById("container").remove();

  const container = document.createElement('div');
  container.setAttribute('id', 'container');
  container.setAttribute('data-mode', 'unset');

  // move/click handlers cover click/drag toggles
  container.ondragstart = function(event) {return false} // don't try to drag my div!!
  container.ondrop = function(event) {return false}

  container.onmouseenter = function(event) {
    if(!(event.which === 1)) 
      container.setAttribute('data-mode', 'unset');
  }

  container.onmousemove = function(event) {
    if(event.which === 1 && event.target.classList.contains('row')) {
      if(container.getAttribute('data-mode') === "unset") {
        if(event.target.classList.contains('wall'))
          container.setAttribute('data-mode', 'unfill');
        else
          container.setAttribute('data-mode', 'fill');
      }

      if(container.getAttribute('data-mode') === 'fill' && !event.target.classList.contains('wall'))
        event.target.classList.toggle('wall');
      else if(container.getAttribute('data-mode') === 'unfill' && event.target.classList.contains('filled'))
        event.target.classList.toggle('wall');
    }
  };

  container.onmouseup = function(event) {
    container.setAttribute('data-mode', 'unset');
  }

  container.onclick = function(event) {
    if(event.target.classList.contains('row')) {
      event.target.classList.toggle('wall');
    }
  };

  let CxR = askSize();

  if (CxR == null)
    return

  let numCols = CxR[0];
  let numRows = CxR[1];

  // This will contain the rows
  let columns = [];

  // populate columns array
  for(let i = 0; i < numCols; i++) {
    let column = document.createElement('div');
    let colNum = 'col-' + i;
    column.classList.add(colNum);
    column.classList.add('column');
    columns.push(column);
  }

  // TODO
  // this returns list, need to collect those to return
  // console.log(columns[0].children);
  // for each child, if .classList.contains('filled') then true

  // One row for each instrument
  let rows = [];

  // populate rows array
  for(let i = 0; i < numRows; i++) {
    let row = document.createElement('div');
    let rowNum = 'row-' + i;
    row.classList.add(rowNum);
    row.classList.add('row');
    rows.push(row);
  }

  // this.currentColumn = getCurCol(columns);


  // Attach the created elements to the root dom
  root.appendChild(container);
  for(let column of columns) {
    container.appendChild(column);
    for(let row of rows)
      column.appendChild(row.cloneNode(true));
  }
}

// Define the new element
customElements.define('grid-display', GridDisplay);
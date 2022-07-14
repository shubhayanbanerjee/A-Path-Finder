var cols = 30;
var rows = 30;
var grid = new Array(cols);


var openSet = [];
var closedSet = [];


var path = [];


var start;
var end;

var w;
var h;
var createBlock = false;


function removeFromArray(arr, element)
{
  for(var i = arr.length-1;i>=0;i--)
  {
    if(arr[i] == element)
    {
      arr.splice(i,1);
    }
  }
}


function heuristic(a,b)
{
  //var d = dist(a.i,a.j,b.i,b.j);
  var xChange = Math.abs(a.i - b.i);
  var yChange = Math.abs(a.j - b.j);
  return xChange+yChange;
}


function Cell(i,j)
{
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.wall = false;
  this.previous = undefined;
  this.neighbors = [];


  this.obstacle = function()
  {
    if(random(1)<0.2)
    {
      this.wall = true;
    }
  }

  this.clicked = function()
  {
    var d = dist(mouseX,mouseY,this.i,this.j);
    if(mouseX>this.i*w && mouseX<this.i*w+w-1  && mouseY>this.j*h && mouseY<this.j*h+h-1)
    {
      this.wall = this.wall==true?false:true;
    }
  }

  this.show = function(col)
  {
    fill(col);
    if(this.wall)
    {
      fill(52,100,140);
    }
    noStroke();
    rect(this.i*w,this.j*h , w-1, h-1);
  }

  this.addNeighbors = function(grid)
  {
    var c = this.i;
    var r = this.j;
    if(r>0)
    {
      this.neighbors,push(grid[c][r-1]);
    }
    if(r<rows-1)
    {
      this.neighbors.push(grid[c][r+1])
    }
    if(c>0)
    {
      this.neighbors,push(grid[c-1][r]);
    }
    if(c<cols-1)
    {
      this.neighbors.push(grid[c+1][r])
    }
    /*if(c<cols-1 && r<rows-1)
    {
      this.neighbors.push(grid[c+1][r+1]);
    }
    if(c>0 && r>0)
    {
      this.neighbors.push(grid[c-1][r-1]);
    }
    if(c>0 && r<rows-1)
    {
      this.neighbors.push(grid[c-1][r+1]);
    }
    if(c<cols-1 && r>0)
    {
      this.neighbors.push(grid[c+1][r-1]);
    }*/

  }

}


let findPath = false;
function setup() {
  createCanvas(1000, 650);

  button = createButton("start");
  button.mousePressed(() => findPath = true);

  randomObstacle = createButton("create obstacle");
  randomObstacle.mousePressed(createObstacle);


  w = width/cols;
  h = height/rows;

  //creating the grid
  for(var i = 0; i< cols ; i++)
  {
    grid[i] = new Array(rows);
  }

  //creating a single cell

  for(var i = 0; i< cols ; i++)
  {
    for(var j = 0; j<rows; j++)
    {
      grid[i][j] = new Cell(i,j)
    }
  }

  //adding neighbors

  for(var i = 0; i< cols ; i++)
  {
    for(var j = 0; j<rows; j++)
    {
      grid[i][j].addNeighbors(grid);
    }
  }


  start = grid[0][0];
  start.wall = false;
  end = grid[rows-1][cols-1];
  end.wall = false;

  openSet.push(start);
}


function createObstacle()
{
  for(var i = 0; i< cols ; i++)
  {
    for(var j = 0; j<rows; j++)
    {
      grid[i][j].obstacle();
    }
  }
  start.wall = false;
  end.wall = false;
}

function mousePressed()
{
  createBlock = true;
}
function mouseDragged()
{
  if(createBlock)
  {
    for(var i = 0; i< cols ; i++)
    {
      for(var j = 0; j<rows; j++)
      {
        grid[i][j].clicked();
      }
    }
  }
}
function mouseReleased()
{
  createBlock = false;
}



function draw() {

  if(findPath)
  {
    if(openSet.length > 0)
    {
      var currIndx = 0;
      for(var i = 0;i< openSet.length;i++)
      {
        if(openSet[i].f < openSet[currIndx].f)
        {
          currIndx = i;
        }
      }

      var current = openSet[currIndx];


      if(current == end)
      {
        path = [];
        var temp = current;
        path.push(temp);
        while(temp.previous)
        {
          path.push(temp.previous);
          temp = temp.previous;
        }
        path.reverse();
        noLoop();
        console.log("Finished");
      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      var neighbors = current.neighbors;
      for(var i=0;i<neighbors.length;i++)
      {
        var neighbor = neighbors[i];

        if(closedSet.includes(neighbor) || neighbor.wall)
        {
          continue;
        }
        var tempG = current.g+1;
        var newPath = false;
        if(openSet.includes(neighbor))
        {
          if(tempG<neighbor.g)
          {
            neighbor.g = tempG;
            newPath = true;
          }
        }
        else
        {
          newPath = true;
          neighbor.g = tempG;
          openSet.push(neighbor);
        }
        if(newPath)
        {
          neighbor.h = heuristic(neighbor,end);
          neighbor.f = neighbor.g + neighbor.h; 
          neighbor.previous = current;
        }

      }

    }
    else
    {
      console.log("Path Not Found");
      noLoop();
      return;
    }
  }

  background(0);


  for(var i = 0; i< cols ; i++)
  {
    for(var j = 0; j<rows; j++)
    {
      grid[i][j].show(color(255));
    }
  }


  for(var i = 0 ; i< closedSet.length;i++)
  {
    closedSet[i].show(color(176,232,255))
  }

  /*for(var i = 0 ; i< openSet.length;i++)
  {
    openSet[i].show(color(0,255,0))
  }*/

  for(var i = 0;i < path.length; i++) {
    setTimeout(function(y) {    
      path[y].show(color(255,254,40));
    }, i * 100, i);
  }
}

let x, y;
const widthOfPoint = 10;
const heightOfPoint = widthOfPoint;
let points = [];
let matrix = [];
let openList = [];
let way = [];
let pheromonesIncreases = [];

const a = 1;
const b = 1.25;
const c = 15;

const q = Math.pow(10, 10);
const p = 0.5;

const countOfIterations = 500;
const countOfAnts = 500;

let r, k, wayLength, maxPheromon;

const minGreen = 75;
let isAlgWorksNow = false;
let opportunityToDrawPoints = true;

let intervalId;

const launch_button = document.getElementById("launch_button");
const clear_btn = document.getElementById("clear_btn");
const canvas = document.getElementById("paint_place");
const ctx = canvas.getContext('2d');
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

document.getElementById("launch_button").setAttribute("disabled", "");

canvas.onmousemove = function() // записываем координаты курсора мыши
{
    x = event.offsetX;
    y = event.offsetY;
}

canvas.onmousedown = function() // рисуем квадратики при клике 
{
	for (let i = 0; i < points.length; i++)
	{
		if (points[i][0] === x && points[i][1] === y)
		{
			alert("Точка в этом месте поставлена");
			return 0;
		}
	}
	if (opportunityToDrawPoints)
	{
		document.getElementById("launch_button").removeAttribute("disabled", "");
		ctx.fillStyle = "black";
		ctx.fillRect(x-5, y-5, widthOfPoint, heightOfPoint);
		points.push([x,y]);
	}
}

launch_button.onmousedown = function()
{
    launch_button.setAttribute("disabled", "");
    isAlgWorksNow = true;
    opportunityToDrawPoints = false;
    algorithm();
}

clear_btn.onmousedown = function()
{
    launch_button.setAttribute("disabled", "");
    opportunityToDrawPoints = true;
    if (isAlgWorksNow)
    {
        clearInterval(intervalId);
        isAlgWorksNow = false;
    }
    points = [];

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function antPassage()
{
	let wishes = [];
	let sum = 0;
	for (let j = 0; j < openList.length; j++) 
	{
		wishes[openList[j]] = Math.pow(matrix[currentPoint][openList[j]][1], a) / Math.pow(matrix[currentPoint][openList[j]][0], b);
		sum += wishes[openList[j]];
	}

	let chances = [];
	let temp = 0;
	let rand = Math.random();

	for (let j = 0; j < openList.length; j++) 
	{

		chances[j] = [];
		chances[j][0] = temp;
		chances[j][1] = (wishes[openList[j]] / sum) + temp;
		temp = chances[j][1];

		if (chances[j][0] <= rand && rand <= chances[j][1]) 
		{
			wayLength += matrix[currentPoint][openList[j]][0];
			currentPoint = openList[j];
			openList = openList.filter(function(f){if (JSON.stringify(f) != JSON.stringify(currentPoint)) return f});
			way.push(currentPoint);
			break;
		}
	}
}

function draw()
{
	let green; // отрисовка феромонов
	for (let i = 0; i < points.length; i++)
	{
		for (let j = 0; j < points.length; j++) 
		{
			if (i !== j)
			{
				green = minGreen + Math.floor((matrix[i][j][1]/maxPheromon) * 255 - minGreen);
				if (green > minGreen)
				{
					ctx.beginPath();
					ctx.strokeStyle = "rgb(0," + green + ",0)";
					ctx.lineWidth = 2;
	
					ctx.moveTo(points[i][0],points[i][1])
					ctx.lineTo(points[j][0],points[j][1]);
					ctx.stroke();
				}
			}
		}
	}
}

function drawResultWay(matrix)
{
	let way = [];
	way.push(0);

	let openList = [];
	for (let j = 0; j < points.length; j++) 
	{
		if (j !== 0) 
		{
			openList.push(j);
		}
	}
	
	currentPoint = 0;

	while (openList.length !== 0) // Проход контрольного муравья для отрисовки лучшего найденного пути
	{
		let wishes = [];
		let sum = 0;
		for (let j = 0; j < openList.length; j++) 
		{
			wishes[openList[j]] = Math.pow(matrix[currentPoint][openList[j]][1], a) / Math.pow(matrix[currentPoint][openList[j]][0], b);
			sum += wishes[openList[j]];
		}
		
		let maxChance = -1;
		let pointWithMaxChance;

		for (let j = 0; j < openList.length; j++) 
		{
			if (wishes[openList[j]] > maxChance) 
			{
				maxChance = wishes[openList[j]];
				pointWithMaxChance = openList[j];
			}
		}

		currentPoint = pointWithMaxChance;
		openList = openList.filter(function(f){if (JSON.stringify(f) !== JSON.stringify(currentPoint)) return f});
		way.push(currentPoint);
	}
	way.push(0);

	ctx.beginPath();
	ctx.moveTo(points[0][0],points[0][1])
	ctx.strokeStyle = "red";
	ctx.lineWidth = 3;
	for (let i = 1; i < way.length; i++) 
	{
		ctx.lineTo(points[way[i]][0],points[way[i]][1]);
		ctx.stroke();
	}
}

function algorithm()
{
	matrix = [];
	
	for (let i = 0; i < points.length; i++) {
		matrix[i] = [];
		for (let j = 0; j < points.length; j++) {
			matrix[i][j] = [];
			if (i != j) {
				r = Math.sqrt(Math.pow(points[i][0]-points[j][0], 2) + Math.pow(points[i][1]-points[j][1], 2));
				matrix[i][j][0] = r;
				matrix[i][j][1] = Math.pow(10, -50);
			}
		}
	}
	
	pheromonesIncreases = [];
	for (let i = 0; i < points.length; i++)
	{
		pheromonesIncreases[i] = [];
		for (let j = 0; j < points.length; j++)
		{
			pheromonesIncreases[i][j] = 0;
		}
	}

	k = 0;
	intervalId = setInterval(() =>
			{
				if (k < countOfIterations)
				{
					for (let numOfAnt = 0; numOfAnt < countOfAnts; numOfAnt++)
					{
						wayLength = 0;
						way = [];
						way.push(0);
	
						openList = [];
						for (let j = 0; j < points.length; j++) 
						{
							if (j !== 0) 
							{
								openList.push(j);
							}
						}
						
						currentPoint = 0;
	
						while (openList.length !== 0) // Проход муравья
						{
							antPassage();
						}
						way.push(0);
						wayLength += matrix[currentPoint][0][0];
						for (let i = 1; i < way.length; i++) 
						{
							pheromonesIncreases[way[i-1]][way[i]] += q / Math.pow(wayLength, c);
							pheromonesIncreases[way[i]][way[i-1]] += q / Math.pow(wayLength, c);
						}
					}
					k++;

					maxPheromon = -1;
					for (let i = 0; i < points.length; i++) // Пересчёт феромонов
					{
						for (let j = 0; j < points.length; j++) 
						{
							if (i !== j) 
							{
								matrix[i][j][1] *= p;
								if (!isNaN(pheromonesIncreases[i][j]))
								{
									matrix[i][j][1] += pheromonesIncreases[i][j];
								}

								if (matrix[i][j][1] > maxPheromon)
								{
									maxPheromon = matrix[i][j][1];
								}
							}
						}
					}
	
					pheromonesIncreases = []; // обнуление матрицы увеличений феромонов
					for (let i = 0; i < points.length; i++)
					{
						pheromonesIncreases[i] = [];
						for (let j = 0; j < points.length; j++)
						{
							pheromonesIncreases[i][j] = 0;
						}
					}
					draw();
				}
				else
				{
					clearInterval(intervalId);
					drawResultWay(matrix);
					isAlgWorksNow = false;
				}
			}, 1);
}
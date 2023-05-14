let x, y;
const widthOfPoint = 10;
const heightOfPoint = widthOfPoint;
let points = [];
let population = [];
let temp = [];

let newIndivid;
let closedList;
let randIndex1;
let randIndex2;
let splitIndex;
let numOfIteration;

const mutationChance = 0.4;
const countOfIterations = 10000;
let sizeOfPopulation;
let countOfSwaps; 

let min = [], max = [];
let minLen, maxLen, len;
let deltaX, deltaY;

let isAlgWorksNow = false;
let opportunityToDrawPoints = true;

let intervalId;

const launch_button = document.getElementById("launch_button");
const clear_btn = document.getElementById("clear_btn");
const canvas = document.getElementById("canvas");
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

function createStartPopulation()
{
    sizeOfPopulation = points.length * (points.length - 1);
    countOfSwaps = sizeOfPopulation;
    population = [];
    population[0] = [];

    for (let i = 1; i < points.length; i++) // Создаём первую особь
    {
        population[0][i-1] = i;
    }
    
    while (population.length < sizeOfPopulation)
    {
        temp = [];
        for (let i = 0; i < points.length - 1; i++)
        {
            temp[i] = population[0][i];
        }

        for (let numOfSwap = 0; numOfSwap < countOfSwaps; numOfSwap++)
        {
            randIndex1 = Math.floor(Math.random() * (points.length - 1));
            randIndex2 = Math.floor(Math.random() * (points.length - 1));
            [temp[randIndex1], temp[randIndex2]] = [temp[randIndex2], temp[randIndex1]];
        }

        if (population.indexOf(temp) === -1)
        {
            population.push(temp);
        }
    }
}

function crossing(parrent1, parrent2)
{
    splitIndex = Math.floor(Math.random() * (points.length - 1));
    newIndivid = [];
    closedList = [];

    for (let i = 0; i < splitIndex; i++)
    {
        if (closedList.indexOf(parrent1[i]) === -1)
        {
            newIndivid.push(parrent1[i]);
            closedList.push(parrent1[i]);
        }
        
    }

    for (let i = splitIndex; i < points.length - 1; i++)
    {
        if (closedList.indexOf(parrent2[i]) === -1)
        {
            newIndivid.push(parrent2[i]);
            closedList.push(parrent2[i]);
        }
    }

    for (let i = splitIndex; newIndivid.length < points.length - 1; i++)
    {
        if (closedList.indexOf(parrent1[i]) === -1)
        {
            newIndivid.push(parrent1[i]);
            closedList.push(parrent1[i]);
        }
        
    }
    
    return newIndivid;
}

function mutation(individ)
{
    randIndex1 = Math.floor(Math.random() * (points.length - 1));
    randIndex2 = Math.floor(Math.random() * (points.length - 1));

    [individ[randIndex1], individ[randIndex2]] = [individ[randIndex2], individ[randIndex1]];

    return individ;
}

function getWayLength(individ)
{
    len = 0;

    for (let i = 1; i < individ.length; i++)
    {
        deltaX = points[individ[i]][0] - points[individ[i-1]][0];
        deltaY = points[individ[i]][1] - points[individ[i-1]][1];
        len += Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
    }

    deltaX = points[0][0] - points[individ[0]][0];
    deltaY = points[0][1] - points[individ[0]][1];
    len += Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    deltaX = points[0][0] - points[individ[individ.length-1]][0];
    deltaY = points[0][1] - points[individ[individ.length-1]][1];
    len += Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    return len;
}

function drawWay(way)
{
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < points.length; i++)
    {
        ctx.fillStyle = "black";
		ctx.fillRect(points[i][0]-5, points[i][1]-5, widthOfPoint, heightOfPoint);
    }

    ctx.beginPath();
    ctx.moveTo(points[0][0],points[0][1]);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;

    for (let i = 0; i < way.length; i++) 
    {
        ctx.lineTo(points[way[i]][0],points[way[i]][1]);
        ctx.stroke();
    }

    ctx.lineTo(points[0][0],points[0][1]);
    ctx.stroke();
}

function algorithm()
{
    createStartPopulation();

    randIndex1 = Math.floor(Math.random() * population.length);
    min = [];
    for (let i = 0; i < points.length - 1; i++)
    {
        min[i] = population[randIndex1][i];
    }

    minLen = Infinity;
    maxLen = -Infinity;

    max = [];

    numOfIteration = 0;
    intervalId = setInterval(() =>
    {
        console.log("№",numOfIteration);
        if (numOfIteration < countOfIterations)
        {
            newIndivid = [];

            do
            {
                randIndex2 = Math.floor(Math.random() * population.length);

                newIndivid = crossing(min, population[randIndex2]);
                
                if (Math.random() > mutationChance)
                {
                    newIndivid = mutation(newIndivid);
                }
            } while(population.indexOf(newIndivid) !== -1)

            population.push(newIndivid);

            
            for (let i = 0; i < population.length; i++)
            {
                len = getWayLength(population[i]);
        
                if (len < minLen)
                {
                    minLen = len;
                    for (let j = 0; j < points.length - 1; j++)
                    {
                        min[j] = population[i][j];
                    }
                }
        
                if (len > maxLen)
                {
                    maxLen = len;
                    for (let j = 0; j < points.length - 1; j++)
                    {
                        max[j] = population[i][j];
                    }
                }
            }
        
            population = population.filter(function(f){if (population.indexOf(f) != population.indexOf(max)) return f});

            drawWay(min);
        }
        else
        {
            clearInterval(intervalId);
            isAlgWorksNow = false;
        }
        numOfIteration++;
    }, 1);
}

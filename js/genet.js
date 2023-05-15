let x, y;
const widthOfPoint = 10;
const heightOfPoint = widthOfPoint;
let points = [];
let population = [];
let temp = [];
let lengths = [];

let index1;
let index2;
let newIndivid1;
let newIndivid2;
let closedList;
let randIndex1;
let randIndex2;
let splitIndex;
let numOfIteration;
let countOfMutations = 1;

let mutationChance = 0.4;
const countOfIterations = 20000;
let sizeOfPopulation;
let countOfSwaps; 

let min = [];
let len;
let deltaX, deltaY;

let change = false;
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
    sizeOfPopulation = (points.length - 1) * (points.length - 2) - 2;
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

        change = true;
        for (let i = 0; i < population.length; i++)
        {
            if (JSON.stringify(temp) === JSON.stringify(population[i]))
            {
                    change = false;
                    break;
            }
        }

        if (change)
        {
            population.push(temp);
        }
    }
}

function crossing(parrent1, parrent2)
{
    splitIndex = Math.floor(Math.random() * (points.length - 1));
    let newIndivid = [];
    closedList = [];

    for (let i = 0; i < splitIndex; i++)
    {
        change = true;
        for (let j = 0; j < closedList.length; j++)
        {
            if (JSON.stringify(parrent1[i]) === JSON.stringify(closedList[j]))
            {
                change = false;
                break;
            }
        }
        if (change)
        {
            newIndivid.push(parrent1[i]);
            closedList.push(parrent1[i]);
        }
        
    }

    for (let i = splitIndex; i < points.length - 1; i++)
    {
        change = true;
        for (let j = 0; j < closedList.length; j++)
        {
            if (JSON.stringify(parrent2[i]) === JSON.stringify(closedList[j]))
            {
                change = false;
                break;
            }
        }
        if (change)
        {
            newIndivid.push(parrent2[i]);
            closedList.push(parrent2[i]);
        }
    }

    for (let i = splitIndex; newIndivid.length < points.length - 1; i++)
    {
        change = true;
        for (let j = 0; j < closedList.length; j++)
        {
            if (JSON.stringify(parrent1[i]) === JSON.stringify(closedList[j]))
            {
                change = false;
                break;
            }
        }
        if (change)
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

    numOfIteration = 0;
    intervalId = setInterval(() =>
    {
        if (numOfIteration < countOfIterations)
        {
            newIndivid1 = [];
            newIndivid2 = [];

            change = false;
            do
            {
                index1 = 0;
                index2 = Math.floor(Math.random() * (population.length - 1))

                if (numOfIteration == 3500)
                {
                    mutationChance = 0.66;
                    countOfMutations = 3;
                }

                newIndivid1 = crossing(population[index1], population[index2]);
                newIndivid2 = crossing(population[index2], population[index1]);
                
                for (let i = 0; i < countOfMutations; i++) 
                {
                    if (Math.random() > mutationChance)
                    {
                        newIndivid1 = mutation(newIndivid1);
                        newIndivid2 = mutation(newIndivid2);
                    }
                }

                change = true;
                for (let i = 0; i < population.length; i++)
                {
                    if (JSON.stringify(newIndivid1) === JSON.stringify(population[i]))
                    {
                        change = false;
                        break;
                    }
                }
                if (change)
                {
                    for (let i = 0; i < population.length; i++)
                    {
                        if (JSON.stringify(newIndivid2) === JSON.stringify(population[i]))
                        {
                            change = false;
                            break;
                        }
                    }
                }
                
            } while(!change)

            population.push(newIndivid1);
            population.push(newIndivid2);

            population.sort(function(a, b)
            {
                return getWayLength(a) - getWayLength(b);
            });
            
            index1 = 0;
            index2 = Math.floor(Math.random() * population.length);
            population.pop();
            population.pop();

            drawWay(population[index1]);
        }
        else
        {
            clearInterval(intervalId);
            isAlgWorksNow = false;
        }
        numOfIteration++;

        console.log("№",numOfIteration);
    }, 1);
}
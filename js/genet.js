let x, y;
const widthOfPoint = 10;
const heightOfPoint = widthOfPoint;
let points = [];
let population = [];

let newIndivid;
let closedList;
let randIndex1;
let randIndex2;
let splitIndex;

const mutationChance = 0.5;
const countOfIterations = 500;
let sizeOfPopulation;
let countOfSwaps; 

let min, max;
let minLen, maxLen;

const minGreen = 75;
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
        
    for (let numOfIndivid = 1; numOfIndivid < sizeOfPopulation; numOfIndivid++)
    {
        population[numOfIndivid] = [];
        for (let i = 0; i < points.length - 1; i++)
        {
            population[numOfIndivid][i] = population[0][i];
        }
        
        for (let numOfSwap = 0; numOfSwap < countOfSwaps; numOfSwap++)
        {
            randIndex1 = Math.floor(Math.random() * (points.length - 1));
            randIndex2 = Math.floor(Math.random() * (points.length - 1));
            [population[numOfIndivid][randIndex1], population[numOfIndivid][randIndex2]] = [population[numOfIndivid][randIndex2], population[numOfIndivid][randIndex1]];
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

function algorithm()
{
    createStartPopulation();

    randIndex1 = Math.floor(Math.random() * sizeOfPopulation);
    randIndex2 = Math.floor(Math.random() * sizeOfPopulation);

    newIndivid = crossing(population[randIndex1], population[randIndex2]);

    if (Math.random() > mutationChance)
    {
        newIndivid = mutation(newIndivid);
    }

    population.push(newIndivid);

    // for (let i = 0; i < sizeOfPopulation; i++)
    // {

    // }

}
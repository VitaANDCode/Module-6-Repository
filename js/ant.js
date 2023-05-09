var x, y;
var widthOfPoint = 10;
var heightOfPoint = widthOfPoint;
var points = [];
var countOfAnts = 1500;
var countOfIterations = 150;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.onmousemove = function() // записываем координаты курсора мыши
{
    x = event.offsetX;
    y = event.offsetY;
}

canvas.onmousedown = function() // рисуем квадратики при клике 
{
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, widthOfPoint, heightOfPoint);
    points.push([x+5,y+5]);
}

document.addEventListener ("click", function(elem){
	if (elem.target.id == 'launch_button') {
		document.getElementById("launch_button").setAttribute("disabled", "");
		algorithm();
	} else if (elem.target.id == "clear_btn")
	{
			points = [];

			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			document.getElementById("launch_button").removeAttribute("disabled", "");
	}
});

function algorithm() {
	let matrix = [];
	
	for (let i = 0; i < points.length; i++) {
		matrix[i] = [];
		for (let j = 0; j < points.length; j++) {
			matrix[i][j] = [];
			if (i != j) {
				let r = Math.sqrt(Math.pow(points[i][0]-points[j][0], 2) + Math.pow(points[i][1]-points[j][1], 2));
				matrix[i][j][0] = r;
				matrix[i][j][1] = 1;
			}
		}
	}
	
	for (let k = 0; k < countOfIterations; k++) // Кол-во итераций
	{
		let pheromonesIncreases = [];
		for (let i = 0; i < points.length; i++) {
			pheromonesIncreases[i] = [];
			for (let j = 0; j < points.length; j++) {
				pheromonesIncreases[i][j] = 0;
			}
		}

		for (let numOfAnt = 0; numOfAnt < countOfAnts; numOfAnt++) // Номер муравья
		{
			let wayLength = 0;
			let way = [];
			way.push(0);

			let openList = [];
			for (let j = 0; j < points.length; j++) 
			{
				if (j != 0) 
				{
					openList.push(j);
				}
			}
			
			currentPoint = 0;

			while (openList.length != 0) // Проход муравья
			{
				let sum = 0;
				for (let j = 0; j < openList.length; j++) 
				{
					sum += matrix[currentPoint][openList[j]][1] / matrix[currentPoint][openList[j]][0];
				}

				let chances = [];
				let temp = 0;
				let rand = Math.random();
				let maxChance = -1;
				let pointWithMaxChance;

				for (let j = 0; j < openList.length; j++) 
				{

					chances[j] = [];
					chances[j][0] = temp;
					chances[j][1] = ((matrix[currentPoint][openList[j]][1] / matrix[currentPoint][openList[j]][0]) / sum) + temp;
					temp = chances[j][1];

					if (chances[j][0] <= rand && rand <= chances[j][1] && !(k == countOfIterations - 1 && numOfAnt == countOfAnts - 1)) 
					{
						wayLength += matrix[currentPoint][openList[j]][0];
						currentPoint = openList[j];
						openList = openList.filter(function(f){if (JSON.stringify(f) != JSON.stringify(currentPoint)) return f});
						way.push(currentPoint);
						break;
					} else {
						if (((matrix[currentPoint][openList[j]][1] / matrix[currentPoint][openList[j]][0]) / sum) > maxChance) 
						{
							maxChance = (matrix[currentPoint][openList[j]][1] / matrix[currentPoint][openList[j]][0]) / sum;
							pointWithMaxChance = openList[j];
						}
					}
				}

				if (k == countOfIterations - 1 && numOfAnt == countOfAnts - 1) 
				{
					wayLength += matrix[currentPoint][pointWithMaxChance][0];
					currentPoint = pointWithMaxChance;
					openList = openList.filter(function(f){if (JSON.stringify(f) != JSON.stringify(currentPoint)) return f});
					way.push(currentPoint);
				}
			}
			way.push(0);
			for (let i = 1; i < way.length; i++) 
			{
				pheromonesIncreases[way[i-1]][way[i]] += 10 / wayLength;
				pheromonesIncreases[way[i]][way[i-1]] += 10 / wayLength;
			}

			if (k == countOfIterations - 1 && numOfAnt == countOfAnts - 1) {
				ctx.beginPath();
				ctx.moveTo(points[0][0],points[0][1])
				ctx.strokeStyle = "purple";
				ctx.lineWidth = 3;
				for (let i = 1; i < way.length; i++) 
				{
					ctx.lineTo(points[way[i]][0],points[way[i]][1]);
					ctx.stroke();
				}
			}
		}

		for (let i = 0; i < points.length; i++) // Пересчёт феромонов
		{
			for (let j = 0; j < points.length; j++) 
			{
				if (i != j) 
				{
					matrix[i][j][1] *= 0.75;
					matrix[i][j][1] += pheromonesIncreases[i][j];
				}
			}
		}
	}
}
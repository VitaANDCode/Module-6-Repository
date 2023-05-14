var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

var x, y;
var widthOfPoint = 10;
var heightOfPoint = widthOfPoint;
var points = [];
var clusters = [];
var centroids = [];

var change = true;

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

function algorithm()
{
    document.getElementById("launch").setAttribute("disabled", "");

    let countOfClusters = document.getElementById("countOfClusters_btn").value;

    for (let numOfCluster = 0; numOfCluster < countOfClusters; numOfCluster++) // создаём список рандомных центроидов
    {
        centroids.push([Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)]);
    }

    change = true;
    while (change) // пока есть изменения в координатах хотя бы одного центроида
    {
        change = false;

        for (let numOfCluster = 0; numOfCluster < countOfClusters; numOfCluster++)
        {
            clusters[numOfCluster] = [];
        }

        for (let numOfPoint = 0; numOfPoint < points.length; numOfPoint++) // заносим каждую точку в тот кластер, к центроиду которого она ближе всего
        {
            let closestCentroid;
            let min = Infinity;
            for (let numOfCluster = 0; numOfCluster < countOfClusters; numOfCluster++)
            {
                // считаем расстояние между точкой и центроидом
                let r = Math.sqrt(Math.pow(points[numOfPoint][0]-centroids[numOfCluster][0], 2) + Math.pow(points[numOfPoint][1]-centroids[numOfCluster][1], 2));
                if (r < min)
                {
                    min = r;
                    closestCentroid = numOfCluster;
                }
            }
            clusters[closestCentroid].push(points[numOfPoint]);
        }

        for (let numOfCluster = 0; numOfCluster < countOfClusters; numOfCluster++)
        {
            if (clusters[numOfCluster].length != 0)
            {
                let sumX = 0; // считаем новые координаты центроида
                let sumY = 0;
                for (let numOfPoint = 0; numOfPoint < clusters[numOfCluster].length; numOfPoint++)
                {
                    sumX += clusters[numOfCluster][numOfPoint][0];
                    sumY += clusters[numOfCluster][numOfPoint][1];
                }
                let newCentroid = [];
                newCentroid[0] = sumX / clusters[numOfCluster].length;
                newCentroid[1] = sumY / clusters[numOfCluster].length;
                if (JSON.stringify(centroids[numOfCluster]) != JSON.stringify(newCentroid)) // сравниваем координаты старого и нового центроидов
                {
                    centroids[numOfCluster] = newCentroid;
                    change = true;
                }
            }
            else
            {
                centroids[numOfCluster] = [Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)];
								change = true;
            }
        }
    }
    
    // отрисовка центроидов 
    ctx.fillStyle = "red";
    for (let i = 0; i < centroids.length; i++)
    {
        ctx.fillRect(centroids[i][0], centroids[i][1], widthOfPoint, heightOfPoint);
    }

    for (let numOfCluster = 0; numOfCluster < countOfClusters; numOfCluster++) // отрисовка кластеров
    {
        temp1 = Math.floor(Math.random() * 255);
        temp2 = Math.floor(Math.random() * 255);
        temp3 = Math.floor(Math.random() * 255);
        ctx.fillStyle = "rgb(" + temp1 + "," + temp2 + "," + temp3 + ")";
        for (let numOfPoint = 0; numOfPoint < clusters[numOfCluster].length; numOfPoint++)
        {
            ctx.fillRect(clusters[numOfCluster][numOfPoint][0]-5, clusters[numOfCluster][numOfPoint][1]-5, widthOfPoint, heightOfPoint);
        }
    }
}

document.addEventListener("click", function(el){
    if (el.target.id == "launch")
    {
        let countOfClusters = document.getElementById("countOfClusters_btn").value;
        if (isNaN(countOfClusters) || (!countOfClusters) || !(countOfClusters > 0))
        {
            alert("Некорректный ввод!");
        }
        else if (points.length == 0)
        {
            alert("Поставьте точки!");
        }
        else
        {
            algorithm();
        }
    }
    else if (el.target.id == "clear_btn")
    {
        points = [];
        centroids = [];

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        document.getElementById("launch").removeAttribute("disabled", "");
    }
});
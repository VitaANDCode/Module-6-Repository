var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

var x, y;
var realCountOfClusters;
var widthOfPoint = 10;
var heightOfPoint = widthOfPoint;
var points = [];
var clusters = [];
var centroids = [];

var change = true;

canvas.onmousemove = function()
{
    x = event.offsetX;
    y = event.offsetY;
}

canvas.onmousedown = function()
{
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, widthOfPoint, heightOfPoint);
    points.push([x+5,y+5]);
}

function algorithm()
{
    realCountOfClusters = 3;
    for (let countOfClusters = realCountOfClusters; countOfClusters < 4; countOfClusters++)
    {
        for (let numOfCluster = 0; numOfCluster < countOfClusters; numOfCluster++)
        {
            centroids.push([0,numOfCluster+100]);
        }

        while (change)
        {
            for (let numOfCluster = 0; numOfCluster < countOfClusters; numOfCluster++)
            {
                clusters[numOfCluster] = [];
            }

            change = false;
            for (let numOfPoint = 0; numOfPoint < points.length; numOfPoint++)
            {
                let closestCentroid;
                let min = Infinity;
                for (let numOfCluster = 0; numOfCluster < countOfClusters; numOfCluster++)
                {
                    //считаем расстояние между точкой и центроидом
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
                    let sumX = 0;
                    let sumY = 0;
                    for (let numOfPoint = 0; numOfPoint < clusters[numOfCluster].length; numOfPoint++)
                    {
                        sumX += clusters[numOfCluster][numOfPoint][0];
                        sumY += clusters[numOfCluster][numOfPoint][1];
                    }
                    let newCentroid = [];
                    newCentroid[0] = sumX / clusters[numOfCluster].length;
                    newCentroid[1] = sumY / clusters[numOfCluster].length;
                    if (JSON.stringify(centroids[numOfCluster]) != JSON.stringify(newCentroid))
                    {
                        centroids[numOfCluster] = newCentroid;
                        change = true;
                    }
                }
            }
        }
    }
    
    console.log(clusters);
    console.log(centroids);
    ctx.fillStyle = "red";
    for (let i = 0; i < centroids.length; i++)
    {
        ctx.fillRect(centroids[i][0], centroids[i][1], widthOfPoint, heightOfPoint);
    }
    for (let numOfCluster = 0; numOfCluster < realCountOfClusters; numOfCluster++)
    {
        temp1 = 50+numOfCluster*25;
        temp2 = 200;//80+numOfCluster*40;
        temp3 = 100+numOfCluster*50;
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
        algorithm();
    }
});
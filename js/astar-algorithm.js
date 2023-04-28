// Обработчик кликов
var size;				// размер таблицы
var table_matrix = [];	//матричный вид таблицы
var openList = [];		//открытый список
var closedList = [];	//закрытый список
var route_matrix = [];	//матрица стрелок
var current_td = [];	//текущая клетка

var xn, yn, xf, yf, x, y; // координаты начала, конца, курентовые координаты
var start_id, finish_id;  // номер старта и конца

document.addEventListener('click', function(elem) 
{
	if (elem.target.id == 'crt_btn')
	{
		var parrent = document.querySelector('.table-map');
		size = document.getElementById("size_table").value;

		for (let i = 0; i < size; i++)
		{
			table_matrix[i] = [];
			for (let j = 0; j < size; j++)
			{
				table_matrix[i][j] = 'P';	// пустота
			}
		}

		var table = document.createElement('table');
		table.setAttribute('id', 'astar_table');
		for (let i = 0; i < size; i++)
		{
			var tr = document.createElement('tr');
			for (let j = 0; j < size; j++) {
				var td = document.createElement('td');
				td.setAttribute("id", i*size+j);
				td.className = 'table-item';
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		parrent.appendChild(table);
	}
	if (elem.target.className == 'table-item')
	{
		if (td_color == 3) 
		{
			elem.target.setAttribute('style', 'background-color: purple');
			table_matrix[Math.floor(elem.target.id/size)][elem.target.id % size] = "S";	// стена
		}

		else if (td_color == 1)
		{
			elem.target.setAttribute('style', 'background-color: blue');
			table_matrix[Math.floor(elem.target.id/size)][elem.target.id % size] = "N";	// начало
			start_id = elem.target.id;
		}

		else if (td_color == 2)
		{
			elem.target.setAttribute('style', 'background-color: red');
			table_matrix[Math.floor(elem.target.id/size)][elem.target.id % size] = "K";	// конец
			finish_id = elem.target.id;
		}
	}
	

	if (elem.target.id == 'crt_route')	// если нажали "построить маршрут"
	{
		for (let i = 0; i < size; i++)	// создание матрицы стрелок
			route_matrix[i] = [];

		openList = [];					// создание открытого и закрытого списков
		closedList = [];

		xn = Math.floor(start_id/size);	// вычисление координат начала и конца
		yn = start_id % size;
		xf = Math.floor(finish_id/size);
		yf = finish_id % size;

		openList.push([xn, yn, Math.abs(xn - xf)+Math.abs(yn - yf)]);	// заносим в открытый список стартовую точку
		current_td = [xn, yn, Math.abs(xn - xf)+Math.abs(yn - yf)];		// рассматриваемая ячейка
		while (!(openList.length == 0 || (current_td[0] == xf && current_td[1] == yf)))		// пока список не пуст или мы не пришли к финишу
		{
			x = current_td[0];	// координаты рассматриваемой точки
			y = current_td[1];
			// далее смотрим соседей и занесём в открытый список если там не стена или он не в другом списке
			if ((size > x - 1 && x-1 >= 0) && table_matrix[x - 1][y] != "S" && closedList.indexOf((x-1)*size+y) == -1)
			{
				let sum = current_td[2] + 10 + Math.abs(x - 1 - xf)+Math.abs(y - yf);
				openList.push([x - 1, y, sum]);
				closedList.push((x-1)*size+y)
				route_matrix[x-1][y] = [x, y];
			}
			if ((size > x + 1 && x + 1 >= 0) && table_matrix[x + 1][y] != "S" && closedList.indexOf((x+1)*size+y) == -1)
			{
				let sum = current_td[2] + 10 + Math.abs(x + 1 - xf)+Math.abs(y - yf);
				openList.push([x + 1, y, sum]);
				closedList.push((x+1)*size+y)
				route_matrix[x+1][y] = [x, y];
			}
			if ((size > y - 1 && y - 1 >= 0) && table_matrix[x][y - 1] != "S" && closedList.indexOf(x*size+y-1) == -1)
			{
				let sum = current_td[2] + 10 + Math.abs(x - xf)+Math.abs(y - 1 - yf);
				openList.push([x, y - 1, sum]);
				closedList.push(x*size+y-1)
				route_matrix[x][y-1] = [x, y];
			}
			if ((size > y + 1 && y + 1 >= 0) && table_matrix[x][y + 1] != "S" && closedList.indexOf(x*size+y+1) == -1)
			{
				let sum = current_td[2] + 10 + Math.abs(x - xf)+Math.abs(y + 1 - yf);
				openList.push([x, y + 1, sum]);
				closedList.push(x*size+y+1)
				route_matrix[x][y+1] = [x, y];
			}

			if ((size > x - 1 && x - 1 >= 0) && (size > y - 1 && y - 1 >= 0) && table_matrix[x - 1][y - 1] != "S" && closedList.indexOf((x-1)*size+y-1) == -1)
			{
				let sum = current_td[2] + 14 + Math.abs(x - 1 - xf)+Math.abs(y - 1 - yf);
				openList.push([x - 1, y - 1, sum]);
				closedList.push((x-1)*size+y-1)
				route_matrix[x-1][y-1] = [x, y];
			}
			if ((size > x - 1 && x - 1 >= 0) && (size > y + 1 && y + 1 >= 0) && table_matrix[x - 1][y + 1] != "S" && closedList.indexOf((x-1)*size+y+1) == -1)
			{
				let sum = current_td[2] + 14 + Math.abs(x - 1 - xf)+Math.abs(y + 1 - yf);
				openList.push([x - 1, y + 1, sum]);
				closedList.push((x-1)*size+y+1)
				route_matrix[x-1][y+1] = [x, y];
			}
			if ((size > x + 1 && x + 1>= 0) && (size > y - 1 && y - 1 >= 0) && table_matrix[x + 1][y - 1] != "S" && closedList.indexOf((x+1)*size+y-1) == -1)
			{
				let sum = current_td[2] + 14 + Math.abs(x + 1 - xf)+Math.abs(y - 1 - yf);
				openList.push([x + 1, y - 1, sum]);
				closedList.push((x+1)*size+y-1)
				route_matrix[x+1][y-1] = [x, y];
			}
			if ((size > x + 1 && x + 1 >= 0) && (size > y + 1 && y + 1 >= 0) && table_matrix[x + 1][y + 1] != "S" && closedList.indexOf((x+1)*size+y+1) == -1)
			{
				let sum = current_td[2] + 14 + Math.abs(x + 1 - xf)+Math.abs(y + 1 - yf);
				openList.push([x + 1, y + 1, sum]);
				closedList.push((x+1)*size+y+1)
				route_matrix[x+1][y+1] = [x, y];
			}
			// переносим рассматриваемую точку в закрытый список, чтобы больше не рассматривать
			closedList.push(current_td[0]*size+current_td[1]);
			openList = openList.filter(function(f){if (JSON.stringify(f) != JSON.stringify(current_td)) return f});
			// ищем минимального соседа в открытом списке
			let min = Infinity;
			for (let i = 0; i < openList.length; i++)
			{
				if (openList[i][2] < min)
				{
					current_td = openList[i];
					min = current_td[2];
				}
			}
		}

		let i = xf;
		let j = yf;
		// цикл для отображения итогового маршрута
		while (!(i == xn && j == yn))
		{
			let temp_i = i, temp_j = j;
			i = route_matrix[temp_i][temp_j][0];
			j = route_matrix[temp_i][temp_j][1];
			document.getElementById(i*size+j).setAttribute('style','background-color: green');
		}
		document.getElementById(i*size+j).setAttribute('style','background-color: blue');
	}

	if (elem.target.id == 'reset_btn')
	{
		astar_table.remove();
		buttonPaint = false, buttonStart = false, buttonStop = false;
	}
});

var td_color = 0;
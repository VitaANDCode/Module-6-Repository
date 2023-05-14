var size;
var table_matrix = [];
var gray_list = [];
var green_list = [];

var nx, ny, fx, fy, x, y;
var start_id, finish_id;

var code_of_button;
var isThereStart = false;
var isThereFinish = false;

document.addEventListener('click', function(elem) 
{
	if (elem.target.id == 'crt_btn')
	{
		size = document.getElementById("size_table").value;
		if (isNaN(size) || !size || !(size > 2 && size < 36))
		{
			alert('Некорректный ввод!');
			return;
		}

		var parrent = document.querySelector('.table-map');

		for (let i = 0; i < size; i++)
		{
			table_matrix[i] = [];
			for (let j = 0; j < size; j++)
			{
				table_matrix[i][j] = 'void';
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
				td.setAttribute('style', 'background-color: white');
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		parrent.appendChild(table);
		elem.target.setAttribute('disabled', '');
	}
	if (elem.target.className == 'table-item')
	{
		let td_id = elem.target.id;
		let td_x = Math.floor(td_id/size);
		let td_y = td_id % size;
		if (code_of_button == 'wall') 
		{
			elem.target.setAttribute('style', 'background-color: purple');
			
			if (table_matrix[td_x][td_y] == 'finish') {
				isThereFinish = false;
			}
	
			else if (table_matrix[td_x][td_y] == 'start') {
				isThereStart = false;
			}

			table_matrix[td_x][td_y] = 'wall';	// стена
		}

		else if (code_of_button == 'start' && isThereStart == false)
		{
			elem.target.setAttribute('style', 'background-color: blue');

			start_id = elem.target.id;
			isThereStart = true;

			if (table_matrix[td_x][td_y] == 'finish') {
				isThereFinish = false;
			}

			table_matrix[td_x][td_y] = 'start';	// начало
		}

		else if (code_of_button == 'finish' && isThereFinish == false)
		{
			elem.target.setAttribute('style', 'background-color: red');

			finish_id = elem.target.id;
			isThereFinish = true;

			if (table_matrix[td_x][td_y] == 'start') {
				isThereStart = false;
			}

			table_matrix[td_x][td_y] = 'finish';	// конец
		}

		else if (code_of_button == 'void')
		{
			if (table_matrix[td_x][td_y] == 'finish') {
				isThereFinish = false;
			}
	
			else if (table_matrix[td_x][td_y] == 'start') {
				isThereStart = false;
			}
	
			elem.target.setAttribute('style', 'background-color: white');
			table_matrix[td_x][td_y] = 'void';
		}
	}	

	if (elem.target.id == 'crt_route' && isThereStart == true && isThereFinish == true)	// если нажали "построить маршрут"
	{
		
		let openList = [];		  //открытый список
		let closedList = [];	  //закрытый список
		let route_matrix = [];	//матрица стрелок
		let current_td = [];	  //текущая клетка

		document.querySelector('#set_start_btn').setAttribute('disabled', '');
		document.querySelector('#set_finish_btn').setAttribute('disabled', '');
		document.querySelector('#set_wall_btn').setAttribute('disabled', '');
		document.querySelector('#crt_route').setAttribute('disabled', '');
		document.querySelector('#reset_td').setAttribute('disabled', '');
		document.querySelector('#reset_table').setAttribute('disabled', '');

		for (let i = 0; i < size; i++)
		{
			for (let j = 0; j < size; j++)
			{
				if (table_matrix[i][j] == 'gray' || table_matrix[i][j] == 'green')
					document.getElementById(i*size+j).setAttribute('style','background-color: white');
			}
		}

		for (let i = 0; i < size; i++)	// создание матрицы стрелок
			route_matrix[i] = [];

		openList = [];	// создание открытого и закрытого списков
		closedList = [];

		nx = Math.floor(start_id/size);	// вычисление координат начала и конца
		ny = start_id % size;
		fx = Math.floor(finish_id/size);
		fy = finish_id % size;

		current_td = [nx, ny, Math.abs(nx - fx)+Math.abs(ny - fy)];	// рассматриваемая ячейка
		openList.push(current_td);	// заносим в открытый список стартовую точку
		
		// пока список не пуст или мы не пришли к финишу
		const intervalId = setInterval(() => {
			if (!(openList.length == 0 || (current_td[0] == fx && current_td[1] == fy)))
			{
				x = current_td[0];	// координаты рассматриваемой точки
				y = current_td[1];

				for (let i = -1; i < 2; i++)
				{
					for (let j = -1; j < 2; j++)
					{
						if ((size > x + i && x + i >= 0) && (size > y + j && y + j >= 0) && table_matrix[x + i][y + j] != "wall" && closedList.indexOf((x+i)*size+y + j) == -1 && !(i == 0 && j == 0))
						{
							let cost;
							if (i == 0 || j == 0)
								cost = 10;
							else
								cost = 14;
							
							let sum = current_td[2] + cost + Math.abs(x + i - fx)+Math.abs(y + j - fy);
							openList.push([x + i, y + j, sum]);
							closedList.push((x + i)*size+y + j);
							route_matrix[x + i][y + j] = [x, y];
							//document.getElementById((x + i)*size+y + j).innerHTML = sum;
						}
					}
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
				
				if (current_td[0]*size+current_td[1] != finish_id && current_td[0]*size+current_td[1] != start_id)
				{
					document.getElementById(current_td[0]*size+current_td[1]).setAttribute('style','background-color: gray');
					table_matrix[current_td[0]][current_td[1]] = 'gray';
				}
			}
			else {
				if (current_td[0] == fx && current_td[1] == fy)
				{
					let i = fx;
					let j = fy;
					
					// цикл для отображения итогового маршрута
					while (!(i == nx && j == ny))
					{
						let temp_i = i, temp_j = j;
						i = route_matrix[temp_i][temp_j][0];
						j = route_matrix[temp_i][temp_j][1];
						if (i*size+j != start_id)
						{
							document.getElementById(i*size+j).setAttribute('style','background-color: green');
							table_matrix[i][j] = 'green';
						}
					}
					table_matrix[nx][ny] = 'start';
					table_matrix[fx][fy] = 'finish';
				} else {
					alert("Путь не найден!");
				}

				document.querySelector('#set_start_btn').removeAttribute('disabled');
				document.querySelector('#set_finish_btn').removeAttribute('disabled');
				document.querySelector('#set_wall_btn').removeAttribute('disabled');
				document.querySelector('#crt_route').removeAttribute('disabled');
				document.querySelector('#reset_td').removeAttribute('disabled');
				document.querySelector('#reset_table').removeAttribute('disabled');
				clearInterval(intervalId);
			}
		}, 150);
	}

	if (elem.target.id == 'reset_table')
	{
		isThereStart = false;
		isThereFinish = false;
		astar_table.remove();
		document.querySelector('#crt_btn').removeAttribute('disabled');
	}

});
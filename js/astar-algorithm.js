// Обработчик кликов
document.addEventListener('click', function(elem) 
{
	if (elem.target.id == 'crt_btn') {
		var parrent = document.querySelector('.table-map');
		var size = document.querySelector('#size_table').value;

		var table = document.createElement('table');
		table.setAttribute('id', 'astar_table');
		for (var i = 0; i < size; i++) {
			var tr = document.createElement('tr');
			for (var j = 0; j < size; j++) {
				var td = document.createElement('td');
				td.className = 'table-item';
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		parrent.appendChild(table);
	}

	if (elem.target.className == 'table-item' && buttonPaint == true) 
	{
		elem.target.setAttribute('style', 'background-color: purple');
	}

	if (elem.target.className == 'table-item' && buttonStart == true) {
		elem.target.setAttribute('style', 'background-color: blue');
	}

	if (elem.target.className == 'table-item' && buttonStop == true) {
		elem.target.setAttribute('style', 'background-color: red');
	}

	if (elem.target.id == 'reset_btn') {
		astar_table.remove();
		buttonPaint = false, buttonStart = false, buttonStop = false;
	}
});

var buttonPaint = false;
var buttonStart = false;
var buttonStop = false;
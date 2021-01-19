
var returnObjIdentado_Global = true;

function resolvDiagrama(options) { 
	/*
		notas: [ 				-- Notas que formam o acorde
			corda: num  		-- Qual corda será tocada
			casa: num 			-- Qual casa será tocada
			nulo: (0|1) 		-- Indicar para não tocar a corda, default: false
		]
		capotraste: 0 			-- Caso diferente de 0 irá considerar a casa que tem capotraste
		acordeNome: 'C' 		-- Nome do acorde
		OR acordeNome: { 		-- Opção de objeto
			text: 'C'			-- Nome do acorde
			color: 'orange' 	-- Cor do texto
		}
		width: 400 				-- Largura do diagrama	valor em px
		height: 600 			-- Altura do diagrama	valor em px
		descForm: '' 			-- Param identificador
		casas: 5 				-- Numero de casas que vai mostrar no diagrama
		cordas: 6 				-- Numero de cordas que possui o intrumento
		afinacao: 'EADGBE' 		-- Afinação das cordas
		margin: 5 				-- Percentual que vai dar de margin
	*/

	options = $.extend({
			width 		: 300
		, 	height 		: 450
		, 	casas 		: 5
		, 	cordas 		: 6
		, 	margin 		: 5
		, 	afinacao 	: 'EADGBE'
		, 	titleSize	: 40
	}, options);

	var mimCasa = -1, maxCasa = -1;
	(options.notas || []).forEach(function(nota) { 
		if ((nota.casa || '') != '') { 
			if (maxCasa == -1 || maxCasa < nota.casa) maxCasa = nota.casa;
			if (mimCasa == -1 || mimCasa > nota.casa) mimCasa = nota.casa;
		}
	});

	if (typeof options.acordeNome == 'string') options.acordeNome = { text: options.acordeNome };

	var casas = [];
	for (var i = 1; i <= options.casas; i++) casas.push(i);

	var cordas = [];
	for (var i = options.cordas; i > 0; i--) cordas.push(i);

	var margin = options.margin;
	var titleSize = options.titleSize;
	var eixo1_X = (titleSize/2) + options.width * margin / 100;
	var eixo2_X = options.width - (options.width * margin / 100);
	var eixo1_Y = (options.height * margin / 100) + (titleSize) + (titleSize/1.5)
	var eixo2_Y = options.height - (options.height * margin / 100);

	var html = ''
		+t(0)+ 	`<canvas height="${options.height}" width="${options.width}" id="${options.descForm}"></canvas>`
		+t(0)+ 	`<script>`
		+t(1)+ 		`var canva${options.descForm} = document.getElementById("${options.descForm}");`
		+t(1)+ 		`var ctx${options.descForm} = canva${options.descForm}.getContext("2d");`

		// Configuração do Capotraste / Pestana
		+t(1)+ 		`ctx${options.descForm}.font = "${titleSize/2}px Arial";`
		+t(1)+ 		`ctx${options.descForm}.fillStyle = "${'black'}";`
		+t(1)+ 		`ctx${options.descForm}.textAlign = "center";`
		+t(1)+ 		`ctx${options.descForm}.fillText("${(options.capotraste || '1')}", ${eixo1_X-(titleSize/2)}, ${eixo1_Y+titleSize});`
		+t(1)+ 		`ctx${options.descForm}.moveTo(${eixo1_X-1}, ${eixo1_Y+3});`
		+t(1)+ 		`ctx${options.descForm}.lineTo(${eixo2_X+1}, ${eixo1_Y+3});`
		+t(1)+ 		`ctx${options.descForm}.closePath();`
		// +t(1)+ 		`ctx${options.descForm}.strokeStyle = "${(options.capotraste || '') == '' ? '#000' : "#F5B041"}";`
		+t(1)+ 		`ctx${options.descForm}.lineWidth = ${(titleSize/2.5)};`
		+t(1)+ 		`ctx${options.descForm}.stroke();`
		+t(1)+ 		`ctx${options.descForm}.lineWidth = 1;`

		+t(1)+ 		`ctx${options.descForm}.moveTo(${eixo1_X}, ${eixo1_Y});`
		+t(1)+ 		`ctx${options.descForm}.lineTo(${eixo1_X}, ${eixo2_Y});`
		+t(1)+ 		`ctx${options.descForm}.lineTo(${eixo2_X}, ${eixo2_Y});`
		+t(1)+ 		`ctx${options.descForm}.lineTo(${eixo2_X}, ${eixo1_Y});`
		+t(1)+ 		`ctx${options.descForm}.lineTo(${eixo2_X}, ${eixo2_Y});`
		+t(1)+ 		`ctx${options.descForm}.lineTo(${eixo1_X}, ${eixo2_Y});`
		// +t(1)+ 		`ctx${options.descForm}.lineTo(${eixo1_X}, ${eixo1_Y});`
		+t(1)+ 		`ctx${options.descForm}.closePath();`
		+t(1)+ 		`ctx${options.descForm}.strokeStyle = "#000";`
		+t(1)+ 		`ctx${options.descForm}.lineWidth = 1;`
		+t(1)+ 		`ctx${options.descForm}.stroke();`



		+t(1)+ 		`ctx${options.descForm}.font = "${titleSize}px Arial";`
		+t(1)+ 		`ctx${options.descForm}.fillStyle = "${(options.acordeNome || {}).color || 'orange'}";`
		+t(1)+ 		`ctx${options.descForm}.textAlign = "center";`
		+t(1)+ 		`ctx${options.descForm}.fillText("${(options.acordeNome || {}).text || ''}", ${options.width/2}, 
						${((options.height * margin / 100) + (titleSize/3) )});`

		+ casas.map(function(casa,i) { 
			var eixoY = eixo1_Y + ((eixo2_Y-eixo1_Y) / casas.length) * (casa-1);
			return ''
				+ (i == 0 || i == (cordas.length-1) ? '' : ''
					+t(1)+ `ctx${options.descForm}.moveTo(${eixo1_X}, ${eixoY});`
					+t(1)+ `ctx${options.descForm}.lineTo(${eixo2_X}, ${eixoY});`
					+t(1)+ `ctx${options.descForm}.lineWidth = 1;`
					+t(1)+ `ctx${options.descForm}.closePath();`
					+t(1)+ `ctx${options.descForm}.stroke();`
				)
		}).join('')
		+ cordas.map(function(corda, i) { 
			var setCorda 	= options.notas.find(function(nota) { return nota.corda == corda }) || {}
			, 	width 		= eixo1_X + (eixo2_X-eixo1_X) / (cordas.length-1) * (i)
			, 	casa 		= (setCorda.casa || 0)
			, 	raio 		= (((eixo2_X-eixo1_X) / cordas.length) / 4) +2
			, 	heightCasa 	= ((eixo2_Y-eixo1_Y) / casas.length) 
			, 	circuloX 	= width
			, 	circuloY 	= eixo1_Y + (heightCasa * casa) - heightCasa + (heightCasa / 2)

			return ''
				+ (i == 0 || i == (cordas.length-1) ? '' : ''
					+t(1)+ `ctx${options.descForm}.moveTo(${width}, ${eixo1_Y});`
					+t(1)+ `ctx${options.descForm}.lineTo(${width}, ${eixo2_Y});`
					+t(1)+ `ctx${options.descForm}.lineWidth = 1;`
					+t(1)+ `ctx${options.descForm}.closePath();`
					+t(1)+ `ctx${options.descForm}.stroke();`
				)
				+ ((setCorda.nulo || false) || casa == 0 ? '' : ''
					+t(1)+ `ctx${options.descForm}.beginPath();`
					+t(1)+ `ctx${options.descForm}.arc(${circuloX}, ${circuloY}, ${raio}, 0, 2 * Math.PI);`
					+t(1)+ `ctx${options.descForm}.fillStyle = "#000";`
					+t(1)+ `ctx${options.descForm}.fill();`

					+ ((setCorda.dedo || '') == '' ? '' : ''
						+t(1)+ `ctx${options.descForm}.font = "${titleSize/2}px Arial";`
						+t(1)+ `ctx${options.descForm}.fillStyle = "${'white'}";`
						+t(1)+ `ctx${options.descForm}.textAlign = "center";`
						+t(1)+ `ctx${options.descForm}.fillText("${setCorda.dedo}", ${circuloX}, ${circuloY+7});`
					)
				)
				+ (!(setCorda.nulo || false) ? '' : ''
					+t(1)+ `ctx${options.descForm}.font = "${titleSize/2.5}px Arial";`
					+t(1)+ `ctx${options.descForm}.fillStyle = "${'black'}";`
					+t(1)+ `ctx${options.descForm}.textAlign = "center";`
					+t(1)+ `ctx${options.descForm}.fillText("X", ${circuloX}, ${eixo1_Y-(titleSize/2)});`
				)
				+ ((setCorda.nulo || false) || casa != 0 ? '' : ''
					+t(1)+ `ctx${options.descForm}.beginPath();`
					+t(1)+ `ctx${options.descForm}.arc(${circuloX}, ${eixo1_Y-(titleSize/1.5)}, ${raio-(raio/3)}, 0, 2 * Math.PI);`
					+t(1)+ `ctx${options.descForm}.fillStyle = "#FFF";`
					+t(1)+ `ctx${options.descForm}.fill();`
					+t(1)+ `ctx${options.descForm}.lineWidth = 1;`
					+t(1)+ `ctx${options.descForm}.closePath();`
					+t(1)+ `ctx${options.descForm}.stroke();`
				)
		}).join('')


		

		+t(0)+ 	`</`+`script>`

	return html;
}

function t() { 
	var num = (arguments[0] || 0);
	var tab = '\n';
	for (var i = 0; i < num; i++) tab += '\t'
	return returnObjIdentado_Global ? tab : '';
}

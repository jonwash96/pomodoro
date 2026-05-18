const element = document.createElement('div');
	element.textContent = "(MmlYyj=)";
	const style = {
		fontFamily: 'monospace',
		fontSize: '100pt',
		position: 'absolute',
		top:550,
		left:550,
		color: 'white',
		zIndex: 200,
	}
	for (const key in style) {element.style[key] = style[key]}
	element.id = 'letters';

document.body.appendChild(element);
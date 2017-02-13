const countries = [];


const search = document.querySelector('.search');
const radio = Array.from(document.querySelectorAll('.radio'));
const sortType = document.querySelector('.sort');

const text = text => document.createTextNode(text);
const remove = id => id.parentElement.removeChild(id);

function create (tag, ...props) {
  tag = tag || 'div'; // default to div
  const el = document.createElement(tag); //build element
  props.forEach(prop => { // build element props / nested elements
    if (typeof prop === 'object') {
      if (prop instanceof Node) { // if node element then nest
        el.appendChild(prop);
      } else {
        Object.keys(prop).forEach(key => { // build properties
          let property = key.split('.'); // if dot notation in props
          if (property[0] === 'style') { // check if dot notation was 'style'
            property[1] in el.style ? // if style exists
              el.style[property[1]] = prop[key] : // apply style
              console.warn(property[1] + ' is not a style'); // or poss error
            return;
          }
          el[key] = prop[key]; // apply non-style property
        });
      }
    } else {
      prop.slice(0,1) === '#' ? el.id = prop.slice(1) : // add id
      prop.slice(0,1) === '.' ? el.className += el.className ? // add class
        ' ' + prop.slice(1) :
        prop.slice(1) :
      el.appendChild(text(prop));
    }
  });
  return el;
}
const div = (...props) => create('div', ...props);
const h1 = (...props) => create('h1', ...props);
const h2 = (...props) => create('h2', ...props);
const p = (...props) => create('p', ...props);
const a = (link, ...props) => create('a', { href:link }, ...props);
const span = (...props) => create('span', ...props);

const get = (id) => {
	let type = id.slice(0,1);
	return type === '#' ? document.getElementById(id.slice(1)) :
				 type === '.' ? document.getElementsByClassName(id.slice(1)) :
				 document.getElementsByTagName(id);
};

function filterer(word, list) {
	const reg = new RegExp(word, 'gi');
	const common = { uk: 'united kingdom', us: 'united states', usa: 'united states' };
	let cSearch = common[word.toLowerCase()];
	let check = '';

	if (cSearch) cSearch = new RegExp(cSearch, 'gi'); // add common search
	radio.forEach((e) => { if (e.checked) check = e; }); // check for radio btn

	return list.filter((e) => {
		if (check.value === 'fullProhibition') {
			return e.punishment === '3' && e.name.match(reg) && e.link;
		}
		if (check.value === 'noProhibition') {
			return e.punishment === '0' && e.name.match(reg) && e.link;
		}
		if (cSearch) {
			return (e.name.match(cSearch) || e.name.match(reg)) && e.link;
		}
		return e.name.match(reg) && e.link;
	});
}

function sorterer(toSort) {
	if (sortType.value === 'alph') return toSort;
	return toSort.sort((a, b) => {
		if (!b.childpop) return -1;
		if (!a.childpop) return 1;
		return parseInt(b.childpop.replace(/,/g, ''), 10) > parseInt(a.childpop.replace(/,/g, ''), 10) ? 1 : -1;
	});
}

fetch('http://cors-proxy.htmldriven.com/?url=http://endcorporalpunishment.org/assets/interactiveMap/corPun.json')
	.then(function(response) { return response.json(); })
	.then(function(j) {	return JSON.parse(j.body); })
	.then(function(data) {
	  for (let item in data) {
	    countries.push(data[item]);
	    countries[countries.length - 1].id = item;
	  }
	  build(countries);
	});

function build(list) {
	const results = get('#results');
	results.innerHTML = '';

	list.forEach(e => {
		let cl = e.punishment === '3' ? 'result ban' :
						 e.punishment === '0' ? 'result noban' :
						 	'result';
		let el = div('.result', {classList:cl},
			h1(e.name)
		);
		if (['tz2', 'tr2', 'es2', '-99', 'pt3', 'pt2'].indexOf(e.id.toLowerCase()) < 0) {
			el.style.backgroundImage = `url('4x3/${e.id.toLowerCase()}.svg')`;
		}
		if (e.status) {
      el.appendChild(
			div(
				h2('Still to be prohibited:'),
				p(e.status)
				)
		  );
    }
	 if (e.date) {
     el.appendChild(
		     h2(`Corporal punishment banned in ${e.date}`)
	   );
   }
	 if (e.childpop) {
     el.appendChild(
  		 div(
  			 h2('Child population:'),
  			 p(e.childpop)
  			 )
  		 );
     }
		results.appendChild(
			a(`http://www.endcorporalpunishment.org/progress/country-reports/${e.link}.html`, el)
		);
	});

}


radio.forEach(e => e.addEventListener('change', () => {
	build(sorterer(filterer(search.value, countries)));
}));
sortType.addEventListener('change', () => {
	build(sorterer(filterer(search.value, countries)));
});
search.addEventListener('keyup', () => {
	build(sorterer(filterer(search.value, countries)));
});

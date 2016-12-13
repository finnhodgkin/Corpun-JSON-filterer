const endpoint = 'https://gist.githubusercontent.com/finnhodgkin/4b12d304c3109fa337f09ec6d57200c3/raw/8d814225574cc9bddf8caec9baad9659b5cd39ab/cor-pun.json';

const cities = [];

const search = document.querySelector('.search');
const radio = document.querySelectorAll('.radio');

let fullChecked = false;
let noneChecked = false;

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => {
    cities.push(...data);
    draw(filterer("", cities));
  });


function draw (c) {
  const list = document.querySelector('#results');
  const items = c.map(e => {
    const pop = e.childpop ? `<h2>Child population: </h2><p>${e.childpop}` : "";
    const status = e.status ? `<h2>Prohibition still to be achieved:</h2>${e.status}` : "";
    const banned = e.punishment === "3" ? `<h2>Corporal punishment banned in ${e.date}.</h2>` : "";
    const noban = e.punishment === "0" ? " noban" : "";
    const ban = banned ? " ban" : "";
    return `<a href="http://www.endcorporalpunishment.org/progress/country-reports/${e.link}.html"><div class="result${ban}${noban}"><h1>${e.name}</h1>${banned}${status}${pop}</div></a>`
  });
  if (c[0]) list.innerHTML = items.join("");
  else list.innerHTML = "";
}

function filterer (word, list) {
  const reg = new RegExp(word, 'gi');
  let check = "";
  radio.forEach(e => {
    if(e.checked)
      check = e;
  });
  return cities.filter( e => {
    if (check.value === "fullProhibition") return e.punishment === "3" && e.name.match(reg) && e.link;
    if (check.value === "noProhibition") return e.punishment === "0" && e.name.match(reg) && e.link;
    return e.name.match(reg) && e.link;
  })
}

radio.forEach(e => e.addEventListener('change', (e) => {
  draw(filterer(search.value, cities));
}))
search.addEventListener('keyup', (e) => {
  draw(filterer(search.value, cities));
})

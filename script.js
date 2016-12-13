function build () {
  const endpoint = 'https://gist.githubusercontent.com/finnhodgkin/4b12d304c3109fa337f09ec6d57200c3/raw/087a6ce15fb619085f7410759684df2ab170577a/cor-pun.json';

  const countries = [];

  const search = document.querySelector('.search');
  const radio = document.querySelectorAll('.radio');
  const sortType = document.querySelector('.sort');

  fetch(endpoint)
    .then(blob => blob.json())
    .then(data => {
      countries.push(...data);
      draw(sorterer(filterer("", countries)));
    });


  function draw(c) {
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

  function filterer(word, list) {
    const reg = new RegExp(word, 'gi');
    let check = "";
    radio.forEach(e => {if (e.checked) check = e});
    return countries.filter( e => {
      if (check.value === 'fullProhibition') return e.punishment === '3' && e.name.match(reg) && e.link;
      if (check.value === 'noProhibition') return e.punishment === '0' && e.name.match(reg) && e.link;
      return e.name.match(reg) && e.link;
    })
  }

  function sorterer(toSort) {
    if (sortType.value === "alph") return toSort
    else return toSort.sort((a, b) => {
      if (!b.childpop) return -1
      if (!a.childpop) return 1
      return parseInt(b.childpop.replace(/,/g, '')) > parseInt(a.childpop.replace(/,/g, '')) ? 1 : -1
    })
  }

  radio.forEach(e => e.addEventListener('change', () => {
    draw(sorterer(filterer(search.value, countries)));
  }))
  sortType.addEventListener('change', () => {
    draw(sorterer(filterer(search.value, countries)));
  })
  search.addEventListener('keyup', () => {
    draw(sorterer(filterer(search.value, countries)));
  })
}
build();

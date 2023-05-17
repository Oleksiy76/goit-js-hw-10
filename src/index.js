import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  evt.preventDefault();
  const name = evt.target.value.trim();

  if (name === '') {
    clearCountries();
    return;
  }

  fetchCountries(name)
    .then(data => {
      
      console.log(data);

      clearCountries();

      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (data.length === 1) {
        return (countryInfo.innerHTML = createMarkupInfo(data));
      }
      countryList.innerHTML = createMarkupList(data);
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupList(data) {
  return data.reduce((markup, { name, flags }) => {
    return (
      markup +
      `<li class="country-item">
  <img src="${flags.svg}" width="32"
  <h2>  ${name.common}</h2>
  </li>`
    );
  }, '');
}

function createMarkupInfo(data) {
  return data.reduce(
    (markup, { name, capital, population, flags, languages }) => {
      return (
        markup +
        `<img src="${flags.svg}" width="22" alt="${flags.alt}"
  <h2>  ${name.common}</h2>
  <p>Capital: ${capital}</p>
  <p>Population: ${population}</p>
  <p>Languages: ${Object.values(languages)}</p>`
      );
    },
    ''
  );
}

function clearCountries() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

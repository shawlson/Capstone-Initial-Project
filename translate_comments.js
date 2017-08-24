async function getSourceLanguage(text) {
  const url = 'https://gateway.watsonplatform.net/language-translator/api/v2/identify';
  const username = '55d77b95-111c-4abb-9226-ff1ba10e66d9';
  const password = 'qBh8qevbajWp';
  const headers = new Headers();
  headers.append('Authorization', 'Basic ' + btoa(username+':'+password));
  headers.append('Content-Type', 'text/plain');
  headers.append('Accept', 'application/json');
  const data = 'text=' + text;
  const initOptions = {
    method: 'post',
    headers: headers,
    body: data
  };
  return await fetch(url, initOptions)
  .then(res => res.json())
  .then(body => body.languages[0].language);
}

async function translate(text) {
  const url = 'https://gateway.watsonplatform.net/language-translator/api/v2/translate';
  const username = '55d77b95-111c-4abb-9226-ff1ba10e66d9';
  const password = 'qBh8qevbajWp';
  const headers = new Headers();
  headers.append('Authorization', 'Basic ' + btoa(username+':'+password));
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  return await getSourceLanguage(text)
  .then(source => {return {text: text, source: source, target: 'en'}})
  .then(data => {return {method: 'post', headers: headers, body: JSON.stringify(data)}})
  .then(initOptions => fetch(url, initOptions))
  .then(res => {console.log(res); return res.json();})
  .then(body => {console.log(body); return body.translations[0].translation;})
  .catch(error => {console.log(error); return 'Error';});
};

function appendTranslation() {
  const commentDiv = this.parentNode.parentNode.parentNode;
  const commentText = commentDiv.querySelector('div.md').innerText;
  const foo = document.createElement('strong');
  foo.innerHTML = 'TRANSLATION'
  commentDiv.querySelector('div.md').appendChild(foo);
  translate(commentText)
  .then(translationText => {
    const translation = document.createElement('p');
    translation.innerHTML = translationText;
    return translation;
  })
  .then(translationElement => {
    commentDiv.querySelector('div.md').appendChild(translationElement);
  });
};

const comments = document.querySelectorAll('.comment');

for (var i = 0; i < comments.length; i++) {
  // Create the Translate button
  const listItem = document.createElement('li');
  const anchor = document.createElement('a');
  anchor.innerText = 'translate';
  anchor.setAttribute('href', 'javascript:void(0)');
  anchor.addEventListener('click', appendTranslation, false);
  listItem.appendChild(anchor);
  // Append button to other comment buttons
  const buttons = comments.item(i).querySelector('.flat-list.buttons');
  buttons.appendChild(listItem);
}

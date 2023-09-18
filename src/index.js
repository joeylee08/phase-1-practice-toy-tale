let addToy = false;

function createCard(obj) {
  const card = document.createElement('div');
  card.classList.add('card');

  const toyName = document.createElement('h2')
  toyName.textContent = obj.name;

  const image = document.createElement('img');
  image.src = obj.image;
  image.alt = `Photo of ${obj.name}`;
  image.classList.add('toy-avatar');

  const likes = document.createElement('p');
  likes.textContent = `${obj.likes} Likes`

  const btn = document.createElement('button');
  btn.classList.add('like-btn');
  btn.textContent = 'Like ♥'
  btn.id = obj.id;

  btn.addEventListener('click', (e) => {
    const likesCounter = e.target.parentElement.querySelector('p');
    fetch(`http://localhost:3000/toys/${btn.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        likes: ++obj.likes
      })
    })
    .then(res => res.json())
    .then(json => {
      likesCounter.textContent = `${json.likes} Likes`
    })
  })

  card.append(
    toyName,
    image,
    likes,
    btn
  );

  document.querySelector('div#toy-collection').append(card);
}

document.addEventListener("DOMContentLoaded", () => {
  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(json => {
      json.forEach(item => createCard(item));
    })

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const newToyName = document.querySelector('.container [name="name"]');
  const newToyUrl = document.querySelector('.container [name="image"]');
  const addToyForm = document.querySelector('.container .add-toy-form');

  addToyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    fetch(`http://localhost:3000/toys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: newToyName.value,
        image: newToyUrl.value,
        likes: 0
      })
    })
    .then(res => res.json())
    .then(json => {
      createCard(json)
      newToyName.value = ""
      newToyUrl.value = ""
    })
  })
});

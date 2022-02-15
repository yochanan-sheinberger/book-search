const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const searchResult = document.querySelector(".search-result");
const termDOM = document.querySelector(".term");
const total = document.querySelector(".total");
const totalNumber = document.querySelector(".total-number");
const pagination = document.querySelector(".pagination");
const pageDOM = document.querySelector(".page-num");
const bookFace = document.querySelector(".book-face");
const bookShelf = document.querySelector(".book-shelf");
const spider = document.querySelector(".spider");
const eyes = document.querySelectorAll(".eye");
const cobweb = document.querySelector(".cobweb");

const cough = document.createElement("audio");
const shhh = document.createElement("audio");
cough.src = "../assets/cough1.mp3";
shhh.src = "../assets/shhhh.mp3";
shhh.volume = 0.1;

let term = "";
let page = 0;
let totalResults = 0;

searchBtn.addEventListener("click", search);
searchInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    search();
  }
});
bookShelf.addEventListener("click", spiderAnimation);

function search() {
  if (this instanceof HTMLElement) {
    page = 0;
    pageDOM.innerHTML = page + 1;
  }
  term = searchInput.value;
  maxResults = getMaxResults();
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${term}&startIndex=${page}&maxResults=${maxResults}`
  )
    .then((response) => response.json())
    .then((res) => {
      total.style.display = "flex";
      pagination.style.display = "flex";
      totalNumber.innerHTML = res.totalItems;
      termDOM.innerHTML = `"${term}"`;
      if (res.totalItems) {
        totalResults = res.totalItems;
        bookFace.src = "../assets/happy-book.png";
        createBookListElement(res.items);
      } else {
        searchResult.innerHTML = "";
        pagination.style.display = "none";
        bookFace.src = "../assets/sad-book.png";
      }
    });
}

function getMaxResults() {
  const remainder = totalResults - page * 10;
  return totalResults && remainder < 10 ? remainder : 10;
}

function createBookListElement(books) {
  searchResult.innerHTML = "";
  const listElement = document.createElement("ul");

  books.forEach((book) => {
    const listItem = createListItem(book);
    listElement.appendChild(listItem);
  });
  searchResult.appendChild(listElement);
  if (document.body.animate) {
    const lis = document.querySelectorAll("li");
    lis.forEach((li) => li.addEventListener("click", pop));
  }
}

function createListItem(book) {
  const listItem = document.createElement("li");
  const heading = createHeading(book.volumeInfo.title);
  const img = createImg(book.volumeInfo.imageLinks?.thumbnail);
  const p = createParagraph(book.volumeInfo.description);
  const cardBody = document.createElement("div");
  cardBody.classList = "card-body";
  cardBody.append(heading, p);
  listItem.append(img, cardBody);
  return listItem;
}

function createHeading(title) {
  const heading = document.createElement("h3");
  heading.innerHTML = title;
  return heading;
}

function createParagraph(content) {
  const p = document.createElement("p");
  p.innerHTML = content ? content : "";
  return p;
}

function createImg(src) {
  const figure = document.createElement("figure");
  figure.classList = "book-img";
  figure.style.backgroundImage = `url('${src}')`;
  figure.style.backgroundRepeat = "no-repeat";
  figure.style.backgroundSize = "cover";
  figure.style.backgroundPositionX = "center";
  return figure;
}

function nextPage() {
  const numPages = totalResults > 10 ? Math.ceil(totalResults / 10) : 0;
  if (page < numPages) {
    page++;
    search();
    pageDOM.innerHTML = page + 1;
    searchInput.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function prevPage() {
  if (page > 0) {
    page--;
    search();
    pageDOM.innerHTML = page + 1;
    searchInput.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function spiderAnimation() {
  spider.classList.add("spider-anim");
  cobweb.classList.add("cobweb-anim");
  eyes.forEach((eye) => eye.classList.add("eye-anim"));
  setTimeout(() => {
    spider.classList.remove("spider-anim");
    cobweb.classList.remove("cobweb-anim");
    eyes.forEach((eye) => eye.classList.remove("eye-anim"));
  }, 8700);
}

// source of animation https://codepen.io/Mamboleoo/pen/zYGqvQd

if (document.body.animate) {
  const lis = document.querySelectorAll("li");
  lis.forEach((li) => li.addEventListener("click", pop));
}

function pop(e) {
  // Quick check if user clicked the button using a keyboard
  if (e.clientX === 0 && e.clientY === 0) {
    const bbox = document.querySelector("#button").getBoundingClientRect();
    const x = bbox.left + bbox.width / 2;
    const y = bbox.top + bbox.height / 2;
    for (let i = 0; i < 600; i++) {
      // We call the function createParticle 30 times
      // We pass the coordinates of the button for x & y values
      createParticle(x, y);
    }
  } else {
    for (let i = 0; i < 600; i++) {
      // We call the function createParticle 30 times
      // As we need the coordinates of the mouse, we pass them as arguments
      createParticle(e.clientX, e.clientY);
      setTimeout(() => cough.play(), 300);
      setTimeout(() => shhh.play(), 1400);
    }
  }
}

function createParticle(x, y) {
  const particle = document.createElement("particle");
  document.body.appendChild(particle);

  // Calculate a random size from 5px to 25px
  const size = 1;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  // Generate a random color in a blue/purple palette
  particle.style.background = `black`;

  // Generate a random x & y destination within a distance of 75px from the mouse
  const destinationX = x + (Math.random() - 0.5) * 2 * 180;
  const destinationY = y + (Math.random() - 0.5) * 2 * 150;

  // Store the animation in a variable as we will need it later
  const animation = particle.animate(
    [
      {
        // Set the origin position of the particle
        // We offset the particle with half its size to center it around the mouse
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        opacity: 1,
      },
      {
        // We define the final coordinates as the second keyframe
        transform: `translate(${destinationX}px, ${destinationY}px)`,
        opacity: 0,
      },
    ],
    {
      // Set a random duration from 500 to 1500ms
      duration: Math.random() * 1000 + 1000,
      easing: "cubic-bezier(0, .9, .57, 1)",
      // Delay every particle with a random value of 200ms
      delay: Math.random() * 200,
    }
  );

  // When the animation is complete, remove the element from the DOM
  animation.onfinish = () => {
    particle.remove();
  };
}

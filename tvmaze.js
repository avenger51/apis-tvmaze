"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const apiUrl = `https://api.tvmaze.com/search/shows?q=${term}`;  //maybe add a global...
  const response = await axios.get(apiUrl);

  const shows = response.data.map(result => ({
    id: result.show.id,
    name: result.show.name,
    summary: result.show.summary,
    image: result.show.image ? result.show.image.medium : "http://static.tvmaze.com/images/no-img/no-img-portrait-text.png"
  }));
//
return shows;
}
//  return [
//    {
//      id: 1767,
//      name: "The Bletchley Circle",
//      summary:
//        `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
//           women with extraordinary skills that helped to end World War II.</p>
//         <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
//           normal lives, modestly setting aside the part they played in
//           producing crucial intelligence, which helped the Allies to victory
//           and shortened the war. When Susan discovers a hidden code behind an
//           unsolved murder she is met by skepticism from the police. She
//           quickly realises she can only begin to crack the murders and bring
//           the culprit to justice with her former friends.</p>`,
//      image:
//        "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
//    }
//  ];
//}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(  
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
      <div class="card">
        <img class="card-img-top" src="${show.image}" alt="${show.name}">
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">${show.summary}</p>
          <button class="btn btn-outline-light btn-sm Show-getEpisodes">
            Episodes
          </button>
        </div>
      </div>
    </div>
      `);

    $showsList.append($show);
  }
}
function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    const $episode = $(`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`);
    $episodesList.append($episode);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();  //from input
  const shows = await getShowsByTerm(term); //use shows later..

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$showsList.on("click", ".Show-getEpisodes", async function () {
  const $show = $(this).closest(".Show");
  const showId = $show.data("show-id");
  const episodes = await getEpisodesOfShow(showId);

  populateEpisodes(episodes);
  $episodesArea.show();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
    const apiUrl = `https://api.tvmaze.com/shows/${id}/episodes`;
    const response = await axios.get(apiUrl);

    const episodes = response.data.map(episode => ({
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    }));

    return episodes;
  }

 
/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }

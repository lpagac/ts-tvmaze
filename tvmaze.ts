import axios, { AxiosPromise, AxiosResponse } from "axios"
import * as $ from 'jquery';

const BASE_TV_API_URL = "http://api.tvmaze.com";

const DEFAULT_IMAGE_URL = "http://joelburton.com/joel-burton.jpg";

const $showsList:JQuery<HTMLElement> = $("#showsList");
const $episodesArea:JQuery<HTMLElement> = $("#episodesArea");
const $searchForm:JQuery<HTMLElement> = $("#searchForm");

type Show = {
  id: number,
  name: string,
  summary: string,
  image?: string
}
//breakdown the API request and provide more information
interface APIResponse<T=any> {
  data: T
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string): Promise<Show[]> {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  let showsResult: APIResponse = await axios.get(`${BASE_TV_API_URL}/search/shows?q=${term}`);
  return showsResult.data.map(s => {
    return {
      id: s.show.id,
      name: s.show.name,
      summary: s.show.summary,
      image: s.show.image && s.show.image.medium,
    }
  }); 
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: Show[]):void {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image || DEFAULT_IMAGE_URL}"
              alt="Bletchly Circle San Francisco"
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay(): Promise<void> {

  const term = $("#searchForm-term").val() as string;
  const shows:Show[] = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt: Event){
  evt.preventDefault();
  await searchForShowAndDisplay();
});



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }


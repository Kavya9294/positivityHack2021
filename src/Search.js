import React from 'react';

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const Search = () => (
  <InstantSearch
    indexName="bestbuy"
    searchClient={searchClient}
  >
    <SearchBox />
    {/* <Hits /> */}
  </InstantSearch>
);

export default Search;



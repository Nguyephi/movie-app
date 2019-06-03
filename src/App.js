import React from 'react';
import { Button, Card, DropdownButton, Dropdown, ListGroup, Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import './App.css';
import moment from 'moment';
import { css } from '@emotion/core';
import { BeatLoader } from 'react-spinners';
import InputRange from 'react-input-range'

const defaultImg = require('./NoPoster.jpg')
const navbarLogo = require('./navbarLogo.png')
const API_KEY = 'e1de7d4285d6f1a62ca2b7495036b28d'
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;


class App extends React.Component {
  constructor(props) {
    super(props) 
    this.state = {
      movies: [],
      genre: [],
      pageNumber: 1,
      selectedView: "popular",
      search: '',
      isSearched: false,
      // hasSortingType: false,
      isLoading: true,

    }
  }

  componentDidMount(){
    this.getMovieData()
  }

  onSearch = async (query) => {
    const { isSearched, movies, pageNumber, search } = this.state
    const api = `https://api.themoviedb.org/3/search/movie?api_key=e1de7d4285d6f1a62ca2b7495036b28d&query=${query}&page=${pageNumber - 1}`
    const data = await fetch(api)
    const response = await data.json()
    const filterSearchResults = isSearched ? movies.concat(response.results) : response.results
    this.setState({
      isSearched: true,
      pageNumber: pageNumber + 1,
      movies: filterSearchResults,
      isLoading: false,
    })
    console.log('search', this.moresearches)
  }
  
  getMovieData = async () => {
    const { movies, pageNumber, selectedView } = this.state
    const api = `https://api.themoviedb.org/3/movie/${selectedView}?api_key=${API_KEY}&page=${pageNumber}`
    let data = await fetch(api)
    let response = await data.json()
    this.setState({
      pageNumber: pageNumber + 1,
      movies: movies.concat(response.results),
      isLoading: false,
      // year: response.results.release_date
    }) // How could we get this setState to automatically sort if a user has selected a sorting type?
    // }, this.sortMoviesPopularAsc)
    console.log('movies', this.state)
  }

  getMovies = userChoice => {
    this.setState({ movies: [], page: 1, selectedView: userChoice }, this.getMovieData)
  }

  sortLeastPopularMovie() {
    this.setState({movies: this.state.movies.sort((a, b) => a.popularity-b.popularity)})
  }

  sortMostPopularMovie() {
    this.setState({movies: this.state.movies.sort((a, b) => b.popularity-a.popularity)})
  }

  sortLowestRatedMovie() {
    this.setState({movies: this.state.movies.sort((a, b) => a.vote_average-b.vote_average)})
  }

  sortHighestRatedMovie() {
    this.setState({movies: this.state.movies.sort((a, b) => b.vote_average-a.vote_average)})
  }

  getMoviePosterUrl(path) {
    return path !== null ? `https://image.tmdb.org/t/p/w500/${path}` : defaultImg
  }

  renderMovies() {
    return this.state.movies.map(({popularity, backdrop_path, overview, release_date, title, vote_average}) => {
      return (
          <Card style={{ width: '21rem', paddingBottom: '1em', margin: '1em' }}>
            <Card.Img variant="top" src={this.getMoviePosterUrl(backdrop_path)} />
            <Card.Body>
              <Card.Title style={{ fontSize: '1.5em', fontWeight: 'bold', minHeight: '2.5em' }}>{title}</Card.Title>
              <Card.Text style={{ height: '15em', overflowY: 'scroll' }}>{overview}</Card.Text>
                <ListGroup style={{ display: 'grid' }}>
                  <ListGroup.Item style={{ paddingBottom: '.5em', fontWeight: '600' }}>Released: {moment(release_date).fromNow()}</ListGroup.Item>
                  <ListGroup.Item style={{ paddingBottom: '.5em', fontWeight: '600' }}>Rated: {vote_average}/10</ListGroup.Item>
                  <ListGroup.Item style={{ paddingBottom: '.5em', fontWeight: '600' }}>Popularity: {popularity}</ListGroup.Item>
                  <Button variant="info">More Info</Button>
                </ListGroup>
            </Card.Body>
          </Card>
      )
    })
  }
  
  searchInput = (e) => {
    this.setState({search: e.target.value})
  }
  
  navbar() {
    return <Navbar style={{ position: 'fixed', zIndex: "1", width: '100%', padding: '.5rem 2rem' }} bg="dark" expand="md">
            <Navbar.Brand href="#home"><img style={{ height: '1.8em' }} src={navbarLogo} /></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
            <DropdownButton variant="outline-info" id="dropdown-item-button" title="Movies">
              <Dropdown.Item onClick={() => this.getMovies('now_playing')}>Now Playing</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getMovies('upcoming')}>Upcoming</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getMovies('popular')}>Popular</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getMovies('top_rated')}>Top Rated</Dropdown.Item>
            </DropdownButton>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Search Movies" value={this.state.search} className="mr-sm-2" onChange={this.searchInput} />
              <Button variant="outline-info" onClick={this.onSearch}>Search</Button>
            </Form>
            </Navbar.Collapse>
          </Navbar>
  }

  secondNavbar() {
    return <Nav defaultActiveKey="/home" as="ul" className="toggleBreakLine">
                <Nav.Item as="li">
                  <Nav.Link onClick={() => this.sortLeastPopularMovie()}>Least Popular</Nav.Link>
                </Nav.Item>
                <Nav.Item style={{ paddingTop: '.42em' }} as="li">|</Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link onClick={() => this.sortMostPopularMovie()}>Most Popular</Nav.Link>
                </Nav.Item>
                <Nav.Item className='toggleVisible' style={{ paddingTop: '.42em' }} as="li">|</Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link onClick={() => this.sortLowestRatedMovie()}>Lowest Rated</Nav.Link>
                </Nav.Item>
                <Nav.Item style={{ paddingTop: '.42em' }} as="li">|</Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link onClick={() => this.sortHighestRatedMovie()}>High Rated</Nav.Link>
                </Nav.Item>
          </Nav>
  }

  moreMoviesButton() {
   return <Button variant="info" onClick={!this.state.isSearched ? this.getMovieData : () => this.onSearch(this.state.search)}>More Movies</Button>
  }

  getSearchByYear = () => {
    const results = this.state.movies.filter(movie => {
      if (parseInt(movie.release_date) >= this.state.year.min && parseInt(movie.release_date) <= this.state.year.max + 1)
        return movie
    })
    this.setState({ movies: results })
    console.log('moviesyear', this.movie.release_date)
  }

  render() {
    if(this.state.isLoading) {
    return (
      <div style={{ margin: '10em', display: 'flex' }} className='sweet-loading'>
        <BeatLoader
          css={override}
          sizeUnit={"px"}
          size={20}
          color={'black'}
          loading={this.state.loading}
        />
      </div> 
    )
  }
    return (
      <div>
          {this.navbar()}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60, flexDirection: 'column',
    alignItems: 'center' }}>
        <p className='noMargin' style={{ paddingTop: '.42em'}}>Filter Movies Below:</p>
        {this.secondNavbar()}
        </div>
        <div>
          <InputRange
            maxValue={2019}
            minValue={1990}
            value={this.state.year}
            onChange={year => this.setState({ year }, (this.getSearchByYear))} />
        </div>
      <div className="App">
        {this.renderMovies()}
      </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5em 0' }}>
          {this.moreMoviesButton(() => {console.log(this.state)})}
        </div>
      </div>
  );
}
}

export default App;

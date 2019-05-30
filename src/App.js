import React from 'react';
import { Button, Card, ListGroup, Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import './App.css';
import moment from 'moment';
const defaultImg = require('./NoPoster.jpg')
const navbarLogo = require('./navbarLogo.png')

class App extends React.Component {
  constructor(props) {
    super(props) 
    this.state = {
      movies: [],
      genre: [],
      pageNumber: 1,
      search: ''
    }
  }

  componentDidMount(){
    this.getMovieData()
  }

  getMovieData = async () => {
    const { movies, pageNumber } = this.state
    const API_KEY = 'e1de7d4285d6f1a62ca2b7495036b28d'
    const api = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNumber}`
    let data = await fetch(api)
    let response = await data.json()
    this.setState({
      pageNumber: pageNumber + 1,
      movies: movies.concat(response.results)
    })
  }
  
  getMoviePosterUrl(path) {
    return path !== null ? `https://image.tmdb.org/t/p/w500/${path}` : defaultImg
  }

  renderMovies() {
    return this.state.movies.map(({backdrop_path, overview, release_date, title, vote_average}) => {
      return (
          <Card style={{ width: '21rem', paddingBottom: '1em', margin: '1em' }}>
            <Card.Img variant="top" src={this.getMoviePosterUrl(backdrop_path)} />
            <Card.Body>
              <Card.Title style={{ fontSize: '2em', fontWeight: 'bold', minHeight: '3em' }}>{title}</Card.Title>
              <Card.Text style={{ height: '15em', overflowY: 'scroll' }}>{overview}</Card.Text>
                <ListGroup style={{ display: 'grid' }}>
                  <ListGroup.Item style={{ paddingBottom: '.5em', fontWeight: '600' }}>Released: {moment(release_date).fromNow()}</ListGroup.Item>
                  <ListGroup.Item style={{ paddingBottom: '.5em', fontWeight: '600' }}>Rated: {vote_average}/10</ListGroup.Item>
                  <Button variant="primary">Go somewhere</Button>
                </ListGroup>
            </Card.Body>
          </Card>
      )
    })
  }
  
  onSearch = async () => {
    const api = `https://api.themoviedb.org/3/search/movie?api_key=e1de7d4285d6f1a62ca2b7495036b28d&query=${this.state.search}&page=1`
    const data = await fetch(api)
    const response = await data.json()
    this.setState({
      movies: response.results
    })
  }
  
  searchInput = (e) => {
    this.setState({search: e.target.value})
  }
  
  navbar() {
    return <Navbar bg="light" variant="light" expand="md">
            <Navbar.Brand href="#home"><img style={{ height: '1.8em' }} src={navbarLogo} /></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Search Movies" value={this.state.search} className="mr-sm-2" onChange={this.searchInput} />
              <Button variant="outline-primary" onClick={this.onSearch}>Search</Button>
            </Form>
            </Navbar.Collapse>
          </Navbar>
  }

  render() {
    return (
      <div>
        {this.navbar()}
      <div className="App">
        {this.renderMovies()}
      </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5em 0' }}>
          <Button onClick={this.getMovieData}>See More Movies</Button>
        </div>
      </div>
  );
 }
}

export default App;

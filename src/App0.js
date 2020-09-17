import React, {Component} from 'react';
import Header from './components/Header';
import MapContainer from './Map/MapContainer';
import Navigation from './components/Navigation';
import EventBox from './components/EventBox';
import axios from 'axios';
import { stringify } from 'query-string';
import { Events, animateScroll as scroll} from 'react-scroll'

window.onscroll = function() {
  scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    document.getElementById("back-to-top").style.display = "block";
  } else {
    document.getElementById("back-to-top").style.display = "none";
  }
}

class App extends Component {

  constructor (props){
    super(props)
    this.state = {
     data: null,
     pins: null,
     limit: 50,
     start: 0,
     tags_filter: null,
     filter_lang: "fi",
     selectedEvent: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.getPins = this.getPins.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  getEvents() {
    let searchParams = stringify(this.state);
    console.log(searchParams)
    axios.get(`/api/?${searchParams}`)
    .then(res => {
      console.log("RESULT:", res)
      this.setState(state => {
        state.data = res.data.data
        return state;
      });
      console.log(this.state.data)
    });
  }

  getPins() {
    axios.get(`/api/pins/?${this.state.filter_type}&${this.state.filter_lang}`)
    .then(result => {
      this.setState(state => {
        state.pins = result.data;
        return state;
      });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getEvents();
    this.getPins();
    document.documentElement.scrollTop = 0;
  }

  handleChange(event) {
    let newFilter = {};
    newFilter[event.target.name] = event.target.value;
    console.log(newFilter)
    this.setState({
      ...this.state,
      ...newFilter,
      ...{start: 0}
    });
  }

  handleScroll() {
    // console.log(`document.documentElement.offsetHeight: ${document.documentElement.offsetHeight}`);
    // console.log(`window.innerHeight + document.documentElement.scrollTop: ${window.innerHeight + document.documentElement.scrollTop}`);
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      console.log('load data')
      axios.get(`/api/?limit=${this.state.limit}&start=${this.state.start}&${this.state.filter_type}&${this.state.filter_lang}`)
        .then(result => {
          let temp = [ ...this.state.data, ...result.data].filter( (value, index) => {
            return [ ...this.state.data, ...result.data].indexOf(value.name.fi) === index
          });
          this.setState(state => {
            state.data = temp;
            state.start = this.state.data.length + 1;
            return state;
          });
        });
        console.log(this.state);
    }
  }

  componentDidMount() {
    this.getEvents();
    this.getPins();
    window.addEventListener('scroll', this.handleScroll);
    Events.scrollEvent.register('begin', function () {});
    Events.scrollEvent.register('end', function () {});
  }

  scrollToTop() {
    scroll.scrollToTop();
  }

  render() {

    if (!this.state.data || !this.state.pins){
      return null;
    }

    return (
      <div className='App'>
        <Header />
        <Navigation
          onChange={this.handleChange}
          onClick={this.handleSubmit}
        />
        <div className='map-events-holder'>
          <article>
            {this.state.data.map((el, index) => {
              return el.dates ?
              <div className="complex-box" key={index}>
                <EventBox
                  id={el.id}
                  name={el.name.fi}
                  address={el.location.address.street_address}
                  postcode={el.location.address.postal_code}
                  city={el.location.address.locality}
                  intro={el.description.intro}
                  imageURL={el.description.images[0].url}
                  startDate={el.event_dates.starting_day}
                  url={el.url}
                  onClick={this.handleEventClick}
                />
              </div>
              :
              <div className="complex-box" key={index}>
                <EventBox
                  key={index}
                  id={el.id}
                  name={el.name.fi}
                  address={el.location.address.street_address}
                  postcode={el.location.address.postal_code}
                  city={el.location.address.locality}
                  intro={el.description.intro}
                  imageURL={el.description.images[0].url}
                  url={el.info_url}
                  onClick={this.handleEventClick}
                  startDate={el.event_dates.starting_day}
                />
              </div>
            })}
          </article>
          {/*<div id='map-holder'>
            <aside className='sticky'>

            </aside>
          </div>*/}
        </div>
        <footer>
          <div id='back-to-top_placeholder'>
            <i id="back-to-top" className="fas fa-arrow-alt-circle-up" onClick={this.scrollToTop}></i>
          </div>
          <ul className='footer-menu'>
            <li className = 'footer-menu-element'>
              About
            </li>
            <li className = 'footer-menu-element'>
              Contact Us
            </li>
            <li className = 'footer-menu-element last'>
              Disclaimer
            </li>
          </ul>
        </footer>
      </div>
    );
  }
}
export default App;

import React, {useEffect, useState} from 'react';

import axios from 'axios';
import debounce from "lodash.debounce";
// import { stringify } from 'query-string';
import { Events, animateScroll as scroll} from 'react-scroll'

/*Import components*/
import EventBox from './components/EventBox';
import Header from './components/Header';
import MapContainer from './Map/MapContainer';
import Navigation from './components/Navigation';


function scrollFunction() {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    document.getElementById("back-to-top").style.display = "block";
  } else {
    document.getElementById("back-to-top").style.display = "none";
  }
}

const EventsList = () => {
  const [data, setData] = useState([])
  console.log(data.length);
  let limit = 2;
  let start = data.length;
  const [filter, setFilter] = useState({
    filter_lang: "",
    tags_filter: "",
  })
  const [pins, setPins] = useState([])
  const [selectedEvent, setSelectedEvent] = useState([])

  const [scroll, setScroll] = useState({
    error: false,
    hasMore: true,
    isLoading: false,
  });

  const [event, setEvent] = ("");

  // const getPins = () => {
  //   axios.get(`/api/pins/?${this.state.filter_type}&${this.state.filter_lang}`)
  //   .then(result => {
  //     setPins(state => {
  //       state.pins = result.data;
  //       return state;
  //     });
  //   });
  // }

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // getEvents();
  //   // getPins();
  //   document.documentElement.scrollTop = 0;
  // }

  // const handleChange = (event) => {
  //   let newFilter = {};
  //   newFilter[event.target.name] = event.target.value;
  //   console.log(newFilter)
  //   setData({
  //     ...this.state,
  //     ...newFilter,
  //     ...{start: 0}
  //   });
  // }

  const load = async () => {
    return (await axios.get(`https://api-inhelsinki.herokuapp.com/api/?limit=${limit}&start=${start}`)).data.data
    // return (await axios.get(`https://cors-anywhere.herokuapp.com/http://open-api.myhelsinki.fi/v1/events/?limit=${limit}&start=${start}`)).data.data
  }

  load().then(res => console.log(res))

  const updateState = () => {
    load(limit, start)
    .then(res => {
      setScroll({
        ...scroll,
        isLoading: true,
      });
      setData([...data, ...res])
      setScroll({
        ...scroll,
        hasMore: res.length !== 0,
        isLoading: false,
      });
    })
    .catch(err => console.log(err));
  }

  window.onscroll = debounce(() => {
    scrollFunction();
    const { error, isLoading, hasMore } = scroll;
    if (error || isLoading || !hasMore) {
      console.log(error, isLoading, hasMore);
      return "Hi!"
    };
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      console.log(error, isLoading, hasMore);
      console.log("window.innerHeight: ", window.innerHeight)
      console.log("document.documentElement.scrollTop: ", document.documentElement.scrollTop)
      console.log("document.documentElement.offsetHeight: ", document.documentElement.offsetHeight)
      updateState();
    } else {
      return;
    }
  }, 100);

  useEffect(() => {
    // getEvents();
    // getPins();
    // window.addEventListener('scroll', handleScroll);
    Events.scrollEvent.register('begin', function () {});
    Events.scrollEvent.register('end', function () {});
    updateState();
  }, [])

  const scrollToTop = () => {
    scroll.scrollToTop();
  }

  return (
    <div className='App'>
      <Header />
      <Navigation
        onChange={{/*handleChange*/}}
        // onClick={handleSubmit}
      />
      <div className='map-events-holder'>
        <article>
          {data.map((el, index) => {
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
                imageURL={el.description.images.length !== 0 ? el.description.images[0].url : "#"}
                url={el.info_url}
                // onClick={handleEventClick}
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
          <i
            id="back-to-top"
            className="fas fa-arrow-alt-circle-up"
            onClick={scrollToTop}
          />
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
export default EventsList;

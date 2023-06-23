import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

// function JokeList({ numJokesToGet = 10 }) {
//   const [jokes, setJokes] = useState([]);

//   /* get jokes if there are no jokes */

//   useEffect(function() {
//     async function getJokes() {
//       let j = [...jokes];
//       let seenJokes = new Set();
//       try {
//         while (j.length < numJokesToGet) {
//           let res = await axios.get("https://icanhazdadjoke.com", {
//             headers: { Accept: "application/json" }
//           });
//           let { status, ...jokeObj } = res.data;

//           if (!seenJokes.has(jokeObj.id)) {
//             seenJokes.add(jokeObj.id);
//             j.push({ ...jokeObj, votes: 0 });
//           } else {
//             console.error("duplicate found!");
//           }
//         }
//         setJokes(j);
//       } catch (e) {
//         console.log(e);
//       }
//     }

//     if (jokes.length === 0) getJokes();
//   }, [jokes, numJokesToGet]);

//   /* empty joke list and then call getJokes */

//   function generateNewJokes() {
//     setJokes([]);
//   }

//   /* change vote for this id by delta (+1 or -1) */

//   function vote(id, delta) {
//     setJokes(allJokes =>
//       allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
//     );
//   }

//   /* render: either loading spinner or list of sorted jokes. */

//   if (jokes.length) {
//     let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

//     return (
//       <div className="JokeList">
//         <button className="JokeList-getmore" onClick={generateNewJokes}>
//           Get New Jokes
//         </button>

//         {sortedJokes.map(j => (
//           <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
//         ))}
//       </div>
//     );
//   }

//   return null;

// }


class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
      loading: false
    };

    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.resetVotes = this.resetVotes.bind(this);
    this.vote = this.vote.bind(this);
  }

  componentDidMount() {
    this.getJokes();
  }

  async getJokes() {
    try {
      this.setState({ loading: true });

      const { numJokesToGet } = this.props;
      const { jokes } = this.state;
      let seenJokes = new Set(jokes.map(j => j.id));

      while (jokes.length < numJokesToGet) {
        const res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        const { status, ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokes.push({ ...joke, votes: 0 });
        } else {
          console.log("Duplicate joke found!");
        }
      }

      this.setState({ jokes, loading: false });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  }

  generateNewJokes() {
    this.setState({ jokes: [] }, this.getJokes);
  }

  resetVotes() {
    this.setState(prevState => ({
      jokes: prevState.jokes.map(j => ({ ...j, votes: 0 }))
    }));
  }

  vote(id, delta) {
    this.setState(prevState => ({
      jokes: prevState.jokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    }));
  }

  render() {
    const { jokes, loading } = this.state;

    const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
    const allLocked = sortedJokes.every(j => j.locked);

    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={this.generateNewJokes}
          disabled={allLocked || loading}
        >
          {allLocked ? "All Locked" : loading ? "Loading..." : "Get New Jokes"}
        </button>
        <button className="JokeList-getmore" onClick={this.resetVotes}>
          Reset Vote Counts
        </button>

        {sortedJokes.map(joke => (
          <Joke
            key={joke.id}
            id={joke.id}
            text={joke.text}
            votes={joke.votes}
            vote={this.vote}
          />
        ))}

        {loading && (
          <div className="loading">
            <i className="fas fa-4x fa-spinner fa-spin" />
          </div>
        )}
      </div>
    );
  }
}

export default JokeList;

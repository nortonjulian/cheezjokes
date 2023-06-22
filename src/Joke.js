import React from "react";
import "./Joke.css";

// function Joke({ vote, votes, text, id }) {
//   const upVote = () => vote(id, +1);
//   const downVote = () => vote(id, -1);

//   return (
//     <div className="Joke">
//       <div className="Joke-votearea">
//         <button onClick={upVote}>
//           <i className="fas fa-thumbs-up" />
//         </button>

//         <button onClick={downVote}>
//           <i className="fas fa-thumbs-down" />
//         </button>

//         {votes}
//       </div>

//       <div className="Joke-text">{text}</div>
//     </div>
//   );
// }

class Joke extends React.Component {
  constructor(props) {
    super(props)
    this.state = { votes: 0 };
    this.downVote = this.downVote.bind(this);
    this.upVote = this.upVote.bind(this);
  }

  downVote() {
    this.setState((prevState) => ({ votes: prevState.votes - 1 }));
  }

  upVote() {
    this.setState((prevState) => ({ votes: prevState.votes + 1 }));
  }

  render () {
    const { text } = this.props;
    const { votes } = this.state;

    return (
      <div className="Joke">
        <div>Current votes: {this.state.votes}</div>
        <div>
          <button onClick={this.downVote}>-</button>
          <button onClick={this.upVote}>+</button>
          {votes}
        </div>
        <div className="Joke-text">{text}</div>
      </div>
    )
  }
}

export default Joke;

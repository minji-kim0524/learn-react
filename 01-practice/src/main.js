import ReplyComment from "./components/replycomment.js";
import Aavatar from "./components/avatar.js";

const container = document.getElementById("container");

const reactDOMRoot = ReactDOM.createRoot(container);

function render() {
  reactDOMRoot.render(renderList(4));
}

function renderList(length) {
  return Array.from({ length }).map(() =>
    React.createElement(ReplyComment, {}, React.createElement(Aavatar, {}))
  );
}

render();

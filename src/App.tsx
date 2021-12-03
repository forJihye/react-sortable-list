import Basic from "./example/basic";
import PreviewSort from "./example/previewSort";
import Transform from "./example/transform";

const App = () => {
  return <div id="app">
    <h2>React DnD sortable list</h2>
    <article style={{margin: '20px 0'}}>
      <h3>1. Basic</h3>
      <Basic />
    </article>
    <article style={{margin: '20px 0'}}>
      <h3>2. Transform</h3>
      <Transform />
    </article>
    <article style={{margin: '20px 0'}}>
      <h3>3. Preview Sort</h3>
      <PreviewSort />
    </article>
  </div>
}

export default App;
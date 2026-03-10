// Import CSS
import "./assets/index.css"
import "./assets/home/header.css"
import "./assets/home/main.css"
import "./assets/home/footer.css"

import Header from "./components/Home/header"
import Main from "./components/Home/main"
import Footer from "./components/Home/footer"

function App() {
  return (
    <main className="home-page">
      <Header />
      <Main />
      <Footer />
    </main>
  )
}

export default App

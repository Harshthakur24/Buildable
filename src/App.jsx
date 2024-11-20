import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import HeroSection2 from "./components/HeroSection2"
import List from "./components/List"
import Navbar from "./components/Navbar"
import OverlapCard from "./components/OverlapCard"
import SignUp from "./components/SignUp"
import Video from "./components/Video"



function App() {


  return (
    <>
      <main>
        <Navbar />
        <HeroSection />
        <HeroSection2 />
        <OverlapCard />
        <Video/>
        <List/>
        <SignUp />
        <Footer />
      </main>
    </>
  )
}

export default App

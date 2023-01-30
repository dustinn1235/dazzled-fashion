import Header from "./components/Header";
import Products from "./components/Products";

function App() {
  return (
    <div className="w-screen px-4 pt-10 md:px-6 flex flex-col items-center font-montserrat">
      <Header />
      <Products />
    </div>
  );
}

export default App;

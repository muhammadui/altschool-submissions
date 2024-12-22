import Navbar from "@/components/Navbar";

const NotFound = () => {
  return (
    <div className="flex flex-col container mx-auto overflow-hidden ">
      <Navbar />
      <div className="container flex items-center mt-60 justify-center overflow-hidden flex-col h-75 ">
        <div className="container font-medium text-lg not__found__wrapper mx-auto flex justify-center items-center flex-col">
          <h1>404</h1>
          <h2>Sorry, This page is not available</h2>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

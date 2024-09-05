import TypingAnim from "../components/typer/TypingAnim";
import Footer from "../components/footer/Footer";

const Home = () => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-full items-center mx-auto mt-3">
        <div>
          <TypingAnim />
        </div>
        <div className="flex flex-col md:flex-row gap-5 my-10 w-full">
          <img
            src="robot.png"
            alt="robot"
            className="w-52 mx-auto"
          />
          <img
            className="w-52 mx-auto transform rotate"
            src="openai.png"
            alt="openai"
          />
        </div>
        <div className="flex mx-auto">
          <img
            src="chat.png"
            alt="chatbot"
            className="flex mx-auto w-[80%] md:w-[60%] rounded-2xl shadow-[0_-5px_105px_#64f3d5] my-5 p-2"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

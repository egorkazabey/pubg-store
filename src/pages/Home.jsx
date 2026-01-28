import background from "../assets/background1.jpg";
import AccountList from "../components/AccountList";
const Home = ({accounts, setAccounts}) => {
  return (
    <div className="container mx-auto">
      <img className="w-full" src={background} alt="" />
      <div className="bg-white h-full my-5 p-1 px-5 rounded-xl">
        <div>
          <img src="" alt="" />
          <p>Последние новости</p>
        </div>
      </div>
      <AccountList accounts={accounts} setAccounts={setAccounts}/>
    </div>


  );
};

export default Home;

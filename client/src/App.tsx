import { Header, TransactionForm, TransactionHistory } from "components";

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#2D242F] text-white select-none`,
};
const App: React.FC = (): JSX.Element => {
  return (
    <div className={style.wrapper}>
      <Header />
      <TransactionForm />
      <TransactionHistory />
    </div>
  );
};

export default App;

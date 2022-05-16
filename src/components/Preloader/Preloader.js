import { observer } from "mobx-react-lite";

const Preloader = observer(({ store }) => {
  return (
    <div className={"preloader " + (!store.ready ? "preloader_active" : "")}>
      Loading...
    </div>
  );
});

export default Preloader;

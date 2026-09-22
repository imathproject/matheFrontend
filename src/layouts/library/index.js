import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Title from "./components/Title";
import Main from "./components/Main";
import { MaterialProvider } from "./Provider";

function MatheLibrary() {
  return (
    <MaterialProvider>
      <DashboardLayout>
        <Title />
        <Main />
        {/* <Footer /> */}
      </DashboardLayout>
    </MaterialProvider>
  );
}

export default MatheLibrary;

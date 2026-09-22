import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Title  from "./components/Title";
import Main from "./main";
;

function AllQuestionsRestricted() {
  return (
     <DashboardLayout>
            <Title/>
            <Main/>
      </DashboardLayout>
  );
}

export default AllQuestionsRestricted;

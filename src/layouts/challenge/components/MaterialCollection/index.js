// Soft UI Dashboard React components
import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";

import Material from "../Material";
import { useMaterialContext } from "layouts/library/Provider";



function MaterialCollection() {  
  const { materialResults } = useMaterialContext();
  
return(
  <SoftBox pt={1} pb={2} px={2}>
  <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
        {
          materialResults.map((key, index) => {
            var subtopic = null;
            if (key.platform__subtopic != null) subtopic = key.platform__subtopic.name;
            return (
              <Material
              key={index}
              description={key.description}
              materialID= {key.id}
              topic="Fundamental Mathematics / Expressions and Equations"
              title={key.title}
              author= {key.author}
              fileExtension={key.file_ext}
              fileName={key.file_name}
              name={key.file_name}
            />
            );
          })
        }
      </SoftBox>
    </SoftBox>
 
)
}

export default MaterialCollection;

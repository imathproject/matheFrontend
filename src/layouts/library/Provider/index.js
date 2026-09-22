// Context.js

import PropTypes from "prop-types";
import React, { createContext, useContext, useState } from 'react';

const MaterialContext = createContext();

export const MaterialProvider = ({ children }) => {
  const [videoResults, setVideoResults] = useState(null);
  const [materialResults, setMaterialResults] = useState(null);

  return (
    <MaterialContext.Provider value={{ videoResults, setVideoResults, materialResults, setMaterialResults }}>
      {children}
    </MaterialContext.Provider>
  );
};


MaterialProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useMaterialContext = () => {
  return useContext(MaterialContext);
};

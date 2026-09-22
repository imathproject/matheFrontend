import React, { useRef, useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import { InfoBox } from './InfoBox';
import './index.css';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import { useApi } from 'api';
import countries from './custom.geo.50.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

import { useTranslation } from "react-i18next";

// Fix for the default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const dataScopes = [
  {
    name: "Population",
    key: "pop_est",
    description: "The population of the country",
    unit: "",
    scale: [0, 5000000, 10000000, 25000000, 50000000, 75000000, 100000000, 200000000, 1000000000, 8000000000]
  },
  {
    name: "GDP",
    key: "gdp_md_est",
    description: "The GDP of the country",
    unit: "USD",
    scale: [0, 10000, 50000, 100000, 500000, 1000000, 5000000, 1000000000]
  }
];

const colors = [
  "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#FFC3A0",
  "#FFABAB", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA", "#FFCCF9",
  "#FCC2FF", "#A6E4FF", "#D8A7CA", "#B28DFF", "#FFABAB", "#FFDAAB",
  "#D1E8E2", "#9AB7D3", "#FFCB8E", "#FCFF77", "#8BC34A", "#00BCD4",
  "#9C27B0", "#FFC107", "#FF5722", "#795548", "#607D8B", "#FF9AA2",
  "#FFB7B2", "#FFDAC1", "#FFDFBA", "#E2F0CB", "#B5EAD7", "#C7CEEA",
  "#FFCCF9", "#FCC2FF", "#A6E4FF", "#D8A7CA", "#B28DFF", "#FFABAB",
  "#FFDAAB", "#D1E8E2", "#9AB7D3", "#FFCB8E", "#FCFF77", "#8BC34A",
  "#00BCD4", "#9C27B0", "#FFC107", "#FF5722", "#795548", "#607D8B",
  "#FF9AA2", "#FFB7B2", "#FFDAC1", "#FFDFBA", "#E2F0CB", "#B5EAD7",
  "#C7CEEA", "#FFCCF9", "#FCC2FF", "#A6E4FF", "#D8A7CA", "#B28DFF",
  "#FFABAB", "#FFDAAB", "#D1E8E2", "#9AB7D3", "#FFCB8E", "#FCFF77",
  "#8BC34A", "#00BCD4", "#9C27B0", "#FFC107", "#FF5722", "#795548",
  "#607D8B", "#FF9AA2", "#FFB7B2", "#FFDAC1", "#FFDFBA", "#E2F0CB",
  "#B5EAD7", "#C7CEEA", "#FFCCF9", "#FCC2FF", "#A6E4FF", "#D8A7CA",
  "#B28DFF", "#FFABAB", "#FFDAAB", "#D1E8E2", "#9AB7D3", "#FFCB8E",
  "#FCFF77", "#8BC34A", "#00BCD4", "#9C27B0", "#FFC107", "#FF5722",
  "#795548", "#607D8B", "#FF9AA2", "#FFB7B2", "#FFDAC1", "#FFDFBA",
  "#E2F0CB", "#B5EAD7", "#C7CEEA", "#FFCCF9", "#FCC2FF", "#A6E4FF",
  "#D8A7CA", "#B28DFF", "#FFABAB", "#FFDAAB", "#D1E8E2", "#9AB7D3",
  "#FFCB8E", "#FCFF77", "#8BC34A", "#00BCD4", "#9C27B0", "#FFC107",
  "#FF5722", "#795548", "#607D8B", "#FF9AA2", "#FFB7B2", "#FFDAC1",
  "#FFDFBA", "#E2F0CB", "#B5EAD7", "#C7CEEA", "#FFCCF9", "#FCC2FF",
  "#A6E4FF", "#D8A7CA", "#B28DFF", "#FFABAB", "#FFDAAB", "#D1E8E2",
  "#9AB7D3", "#FFCB8E", "#FCFF77", "#8BC34A", "#00BCD4", "#9C27B0",
  "#FFC107", "#FF5722", "#795548", "#607D8B", "#FF9AA2", "#FFB7B2",
  "#FFDAC1", "#FFDFBA", "#E2F0CB", "#B5EAD7", "#C7CEEA", "#FFCCF9",
  "#FCC2FF", "#A6E4FF", "#D8A7CA", "#B28DFF", "#FFABAB", "#FFDAAB",
  "#D1E8E2", "#9AB7D3", "#FFCB8E", "#FCFF77", "#8BC34A", "#00BCD4",
  "#9C27B0", "#FFC107", "#FF5722", "#795548", "#607D8B"
];


export default function ChoroplethMap() {
  const { t } = useTranslation();
  const [dataScope, setDataScope] = useState(dataScopes[0]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [uniCountries, setUniCountries] = useState([]);
  const [uniCoordinates, setUniCoordinates] = useState([]);
  const [countriesInfo, setUniCountriesInfo] = useState([]);
  const [clickedCountry, setClickedCountry] = useState(null);

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  const api = useApi();

  useEffect(() => {
    fetchInformation()
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function fetchInformation() {
    try {
      const data = await api.get('info/getMapInfo');
      setUniCountries(data.data.countries);
      setUniCoordinates(data.data.uniMarkers);
      setUniCountriesInfo(data.data.countriesInfo);
    } catch (error) {
      //Handle Error
    }
  }

  const position = [51.505, -0.09];

  const mapRef = useRef(null);
  const [mapSize, setMapSize] = useState({ width: '100%' });

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      const { clientWidth } = map.getContainer();
      const aspectRatio = 1.5;
      const height = `${clientWidth / aspectRatio}px`;
      setMapSize({ width: '100%', height });
    }
  }, []);

  const maxBounds = [
    [-100, -180],
    [100, 180],
  ];

  const mapStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    background: "#ABD3DF",
  };

  const resetHighlight = (e) => {
    setHoveredCountry(null);
  }



  const zoomToCountry = (feature, layer) => {
    const bounds = layer.getBounds();
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  const onEachFeature = (feature, layer) => {
    let countryName = feature.properties.name;
    layer.on({
      mouseover: () => setSelectedCountry(feature.properties.name),
      mouseout: resetHighlight,
      click: () => {
        setSelectedCountry(feature.properties.name);
        zoomToCountry(feature, layer);
        showMarkers(feature);
      }
    });
  };

  const findCountryInfo = (countryName) => {
    return countriesInfo.find(info => info.country === countryName);
  };


  const getColor = (val, key) => {
    if (uniCountries.includes(val)) {
      return "#E89F51";
    }
    return "#000000";
  }

  const getOpacity = (val) => {
    if (uniCountries.includes(val)) return 0.8
    return 1;
  }

  const style = (feature) => {
    let mapStyle = {
      fillColor: getColor(feature.properties.name, feature.properties[dataScope.key]),
      weight: 1,
      opacity: 1,
      color: getColor(feature.properties.name),
      dashArray: '1',
      fillOpacity: getOpacity(feature.properties.name),
    };

    if (hoveredCountry && feature.properties.iso_a3 === hoveredCountry.iso_a3) {
      mapStyle.color = '#444';
      mapStyle.weight = 2;
    }

    return mapStyle;
  }

  const showMarkers = (feature) => {
    const clickedCountryName = feature.properties.name;
    setClickedCountry(clickedCountryName); // Set the clicked country
  };



  return (
    <div className='mapContainer'>
      <MapContainer center={[40, 0]} zoom={3} style={mapStyle} ref={mapRef} maxBounds={maxBounds} minZoom={2}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" noWrap={true} />
        <GeoJSON data={countries} style={style} onEachFeature={onEachFeature} />
        {/* Pass the selectedCountry to InfoBox */}
        <InfoBox data={findCountryInfo(selectedCountry)} scope={dataScope} />
        {uniCoordinates.map((uni, index) => {
          if (clickedCountry && clickedCountry === uni.country) {
            return (
              <Marker position={[uni.latitude, uni.longitude]} key={index}>
                <Popup>
                  <SoftBox>
                    <SoftTypography variant="h5">{uni.name}</SoftTypography>
                    <SoftTypography variant="h6" sx={{ color: "#000000" }}>
                      <FontAwesomeIcon icon={faCircle} color='#344767' size="xs" style={{ marginRight: 3, fontSize: '0.55em' }} />
                      {t('home_page.map_lecturers', 'Lecturers: ')} {uni.lecturer}
                    </SoftTypography>
                    <SoftTypography variant="h6" sx={{ color: "#000000" }}>
                      <FontAwesomeIcon icon={faCircle} color='#344767' size="xs" style={{ marginRight: 3, fontSize: '0.55em' }} />
                      {t('home_page.map_students', 'Students: ')} {uni.students}
                    </SoftTypography>
                  </SoftBox>
                </Popup>
              </Marker>
            );
          } else {
            return null;
          }
        })}
      </MapContainer>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text, View,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {API_KEY} from '@env'

const apikey = API_KEY;

const App = () => {

  const [locais, setLocais] = useState([]);
  const [latitude, setLatitude] = useState(-23.57409379289203);
  const [longitude, setLongitude] = useState(-46.623229000536874);

  const getMarkers = async (region) => {
    try {
      setLatitude(region.latitude);
      setLongitude(region.longitude);

      const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=200&key=${apikey}`)
      const data = await response.json();
      
      if (locais.length != 0) {
        let newLocais = data.results;
        newLocais.filter(item => !locais.includes(item));
        setLocais([...locais,...newLocais]);
      } else {
        setLocais(data.results)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMarkers();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0035,
          longitudeDelta: 0.0035,
        }}
        onRegionChangeComplete={(region) => getMarkers(region)}
      >
        {locais?.map(local =>
          <Marker
            key={Math.random()}
            title={local.name}
            description={local.vicinity}
            coordinate={{
              latitude: local.geometry.location.lat,
              longitude: local.geometry.location.lng,
            }}
          />
        )}
      </MapView>
    </View>
  );
};

export default App;

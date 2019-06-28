import React from "react";
import { Query, MutationFn, graphql } from "react-apollo";
import ReactDOM from "react-dom";
import { RouteComponentProps } from "react-router-dom";
import { getGeoCode } from "../../lib/mapHelpers";
import { USER_PROFILE } from "../../sharedQueries.queries";
import { userProfile, reportMovement, reportMovementVariables, getDrivers } from "../../types/api";
import HomePresenter from "./HomePresenter";
import { toast } from "react-toastify";
import {REPORT_LOCATION, GET_NEARBY_DRIVERS} from "./HomeQueries.queries";

interface IState {
  isMenuOpen: boolean;
  toAddress: string;
  toLat: number;
  toLng: number;
  lat: number;
  lng: number;
  distance: string;
  distanceValue: number;
  duration?: string;
  price: number;
}

interface IProps extends RouteComponentProps<any> {
  google: any;
  reportLocation: MutationFn;
}

class ProfileQuery extends Query<userProfile> {}

class NearbyQueries extends Query<getDrivers> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public userMarker: google.maps.Marker;
  public toMarker: google.maps.Marker;
  public directions: google.maps.DirectionsRenderer;
  public drivers: google.maps.Marker[];
  public state = {
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    toAddress: "",
    toLat: 0,
    toLng: 0,
    distance: "",
    distanceValue: 0,
    duration: undefined,
    price: 0

  };
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.drivers = [];
  }
  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSucces,
      this.handleGeoError
    );
  }
  public render() {
    const { isMenuOpen, toAddress, price } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data, loading:profileLoading }) => (
          <NearbyQueries
            query={GET_NEARBY_DRIVERS}
            pollInterval={1000}
            skip={
              (data &&
                data.GetMyProfile &&
                data.GetMyProfile.user &&
                data.GetMyProfile.user.isDriving) ||
              false
            }
            onCompleted={this.handleNearbyDrivers}
          >
            {() => (
              <HomePresenter
                loading={profileLoading}
                isMenuOpen={isMenuOpen}
                toggleMenu={this.toggleMenu}
                mapRef={this.mapRef}
                toAddress={toAddress}
                onInputChange={this.onAddressSubmit}
                onAddressSubmit={this.onAddressSubmit}
                price={price}
                data={data}
              />
            )}
          </NearbyQueries>
        )}
      </ProfileQuery>
    );
  }

  public toggleMenu = () => {
    this.setState(state => {
      return {
        isMenuOpen: !state.isMenuOpen
      };
    });
  };

  public handleGeoSucces = (positon: Position) => {
    const {
      coords: { latitude, longitude }
    } = positon;
    this.setState({
      lat: latitude,
      lng: longitude
    });
    this.loadMap(latitude, longitude);
  };

  public loadMap = (lat, lng) => {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    if (!mapNode) {
      this.loadMap(lat, lng);
      return;
    }
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat,
        lng
      },
      disableDefaultUI: true,
      zoom: 13
    };
    this.map = new maps.Map(mapNode, mapConfig);
    const userMarkerOptions: google.maps.MarkerOptions = {
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 7
      },
      position: {
        lat,
        lng
      }
    };
    this.userMarker = new maps.Marker(userMarkerOptions);
    this.userMarker.setMap(this.map);
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(
      this.handleGeoWatchSuccess,
      this.handleGeoWatchError,
      watchOptions
    );
  };
  public handleGeoWatchSuccess = (position: Position) => {
    const {reportLocation} = this.props;
    const {
      coords: { latitude, longitude }
    } = position;
    this.userMarker.setPosition({ lat: latitude, lng: longitude });
    this.map.panTo({ lat: latitude, lng: longitude });
    reportLocation({
      variables: {
        lat: parseFloat(latitude.toFixed(10)),
        lng: parseFloat(longitude.toFixed(10))
      }
    });
  };
  public handleGeoWatchError = () => {
    console.log("Error watching you");
  };
  public handleGeoError = () => {
    console.log("No location");
  };
  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };


  public onAddressSubmit = async () => {
    const { toAddress } = this.state;
    const { google } = this.props;
    const maps = google.maps;
    const result = await getGeoCode(toAddress);
    if (result !== false) {
      const { lat, lng, formatted_address: formatedAddress } = result;
      
      if (this.toMarker) {
        this.toMarker.setMap(null);
      }
      const toMarkerOptions: google.maps.MarkerOptions = {
        position: {
          lat,
          lng
        }
      };
      this.toMarker = new maps.Marker(toMarkerOptions);
      this.toMarker.setMap(this.map);

      const bounds = new maps.LatLngBounds();
      bounds.extend({lat,lng});
      bounds.extend({ lat: this.state.lat, lng: this.state.lng });
      this.map.fitBounds(bounds);
      this.setState(
        {
          toAddress: formatedAddress,
          toLat: lat,
          toLng: lng
        },()=>{
          this.setBounds();
          this.createPath();
        }
            
      );
    }
  };

  public createPath = () => {
    const {toLat, toLng, lat, lng} = this.state;
    const {google} = this.props;
    if (this.directions) {
      this.directions.setMap(null);
    }
    const renderOptions: google.maps.DirectionsRendererOptions = {
      polylineOptions: {
        strokeColor: "#000"
      },
      suppressMarkers: true
    };
    this.directions = new google.maps.DirectionsRenderer(renderOptions);
    const directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
    const to = new google.maps.LatLng(toLat, toLng);
    const from = new google.maps.LatLng(lat, lng);
    const directionsOptions: google.maps.DirectionsRequest = {
      destination: to,
      origin: from,
      travelMode: google.maps.TravelMode.DRIVING
    };
    
    directionsService.route(directionsOptions, this.handleRouteRequest); 
 
  };
  
  public handleRouteRequest = (
    result: google.maps.DirectionsResult, 
    status: google.maps.DirectionsStatus 
  ) => {
    const { google } = this.props;
    if (status === google.maps.DirectionsStatus.OK) {
      const { routes } = result;
      const {
        distance: { value: distanceValue, text: distance },
        duration: { text: duration }
      } = routes[0].legs[0];
      this.setState({
        distance,
        distanceValue,
        duration,
        price: this.setPrice(distanceValue)
      });
      this.directions!.setDirections(result);
      this.directions!.setMap(this.map);
    } else {
      toast.error("There is no route there.");
    }
  };

  public setPrice = (distanceValue: number) => {
    return distanceValue ? Number.parseFloat((distanceValue*0.003).toFixed(2)): 0
  };

  public setBounds = () => {
    const {lat, lng, toLat, toLng} = this.state;
    const{google: {maps}} = this.props;
    const bounds = new maps.LatLngBounds();
    bounds.extend({lat,lng});
    bounds.extend({lat:toLat, lng:toLng});
    this.map!.fitBounds(bounds);

  };

  public handleNearbyDrivers = (data: {} | getDrivers) => {
    if ("GetNearbyDrivers" in data) {
      const {
        GetNearbyDrivers: { drivers, ok }
      } = data;
      if (ok && drivers) {
        for (const driver of drivers) {
          const existingDriverMarker: google.maps.Marker | undefined = this.drivers.find((driverMarker: google.maps.Marker) => {
            const markerID = driverMarker.get("ID");
            return markerID === driver!.id;
          });
          if(existingDriverMarker) {
            this.updateDriverMarker(existingDriverMarker, driver);
          } else {
            this.createDriverMarker(driver);
          }
        }
      }
    }
  };

  public createDriverMarker = (driver) => {
    if(driver && driver.lastLat && driver.lastLng) {
      const { google } = this.props;
      const markerOptions: google.maps.MarkerOptions = {
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 5
        },
        position: {
          lat: driver.lastLat,
          lng: driver.lastLng
        }
      };
      const newMarker: google.maps.Marker = new google.maps.Marker(markerOptions);
      if(newMarker) {
        this.drivers.push(newMarker);
        newMarker.set("ID", driver!.id);
        newMarker.setMap(this.map);
      }
    }
    return;
  };

  public updateDriverMarker = (marker: google.maps.Marker, driver) => {
    if(driver && driver.lastLat && driver.lastLng) {
      marker.setPosition({
        lat: driver.lastLat,
        lng: driver.lastLng
      });
      marker.setMap(this.map);
    }
    return;
  };

}

export default graphql<any, reportMovement, reportMovementVariables>(
  REPORT_LOCATION,
  {
    name: "reportLocation"
  }
)(HomeContainer);
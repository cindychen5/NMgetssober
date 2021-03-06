import React, {useState} from "react"
import ReactMapGL, {Popup} from "react-map-gl";
import {Col, Container, Row} from "react-bootstrap";
import {Pin} from "./Pin";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllActivities} from "../store/activity";
import {ActivityAndTreatmentCenterPopup} from "./activity-and-treatment-center-popup";
import activityType, {fetchAllActivityType} from "../store/activityType";
import {SearchBarForm} from "./shared/components/searchBar/SearchBarForm";
import {fetchAllTreatmentCenters} from "../store/treatmentCenter";
import {fetchActivityFavoritesByProfileId, getActivityFavoritesByProfileId} from "../store/activityFavorite";
import {fetchAuth} from "../store/auth";
import {httpConfig} from "./shared/utils/httpConfig";
import {Results} from "./results";
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;




export const MapPage = () => {
    const activities = useSelector((state) => state.activity ? state.activity : [])
    const activityTypes = useSelector((state) => state.activityType ? state.activityType : [])
    const treatmentCenters = useSelector((state) => state.treatmentCenter ? state.treatmentCenter : [])
    const dispatch = useDispatch()
    const initialEffects = () => {
        dispatch(fetchAllActivities())
        dispatch(fetchAllActivityType())
        dispatch(fetchAllTreatmentCenters())
    }

    React.useEffect(initialEffects, [dispatch])

    const [viewport, setViewport] = React.useState({
        latitude: 35.15,
        longitude: -106.65,
        zoom: 9
    });
    const [popupInfo, setPopupInfo] = useState(null);


    return (
        <>
            <Container fluid>
                <Row className="my-4">
                    <Col md={6}>

                        <SearchBarForm activityTypes={activityTypes}  />

                        <ReactMapGL
                            {...viewport}
                            width="50vw"
                            height="50vh"
                            onViewportChange={(viewport) => setViewport(viewport)}
                            mapStyle="mapbox://styles/mapbox/dark-v9"
                            mapboxApiAccessToken={"pk.eyJ1IjoiY2ljaGVuNTgiLCJhIjoiY2ttM25wOWdsMTQxNzJxcXRlZDYxcm5saSJ9.wdnJVaMM3kOfsCuMeoB-vA"}
                        >

                            {activities.map((activity, index) =>
                                <Pin
                                    activity={activity}
                                    index={index} key={index}
                                    onClick={setPopupInfo}
                                />
                            )}

                            {treatmentCenters.map((treatmentCenter) =>
                            <Pin
                                treatmentCenter={treatmentCenter}
                                key={treatmentCenter.treatmentCenterId}
                                onClick={setPopupInfo}
                            />
                            )}

                            {popupInfo && (
                                <Popup
                                    tipSize={10}
                                    anchor="top"
                                    longitude={popupInfo.activityLong ?? popupInfo.treatmentCenterLong}
                                    latitude={popupInfo.activityLat ?? popupInfo.treatmentCenterLat}
                                    closeOnClick={false}
                                    onClose={setPopupInfo}
                                >
                                    <ActivityAndTreatmentCenterPopup popupInfo={popupInfo}
                                    />
                                </Popup>
                            )}
                        </ReactMapGL>
                    </Col>

                <Col md={5} className="mx-3">
                    <h1 className="mx-2">Results</h1>
                        {popupInfo && <Results popupInfo={popupInfo}/>}

                    </Col>
                </Row>
            </Container>
        </>
    )
}
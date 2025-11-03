<h3 align="center">Documentation Track Page</h3>
<h4 align="center">
    Press on ctrl + shift + v to open it in preview mode and open your page on the other side
</h4>

---

## Table of Contents

- [Map With No SSR](#map_with_no_ssr)
- [Widget Menu](#widget_menu)
- [Menu Bottom](#menu_bottom)
- [Driver Name Button](#driver_name)
- [Actions](#actions)
- [ConfigPopup Button](#config_popup_btn)
- [Configration Popup](#config_popup)
- [downLoad Data Vehicles](#downLoad_data_vehicles)

## Map With No SSR <a id = "map_with_no_ssr"></a>

**Props**


- **myMap** lefleat map
- 
- **height** height of map

**States**

- None

**Components:**

- LeafletgeoSearch -> this Component to handle search for a region in map when click on enable disable search btn( this btn in the bottom of screen with other btns )

## Widget Menu <a id = "widget_menu"></a>

**Props**

- Inherit it from the parent state see [track](#track).

**States**

- **loading** to handle loading when user select a large number of vehicle
- **filterStatus** store the value of upper filter in the tree (all or active or offline)

**Functions:**

- onResize -> this function to handle size on the tree on track page

**Custom Hooks**

- **useConfig** this hooks to handle all settings that user change it when click on the settings menu (open your tree click on settings icon on the top left side ) on tree

## Menu Bottom <a id = "menu_bottom"></a>

**Props**

- Inherit it from the parent state see [track](#track).

**States**

- **show** to handle show or hide all btns that present in the bottom left side of the page

- **locateToggle** to handle click on locate btn( when it clicked the user can move the mouse on the map and get the lat and lng on map and copy it )

- if you ask about clear search btn don\`t worry his function in Btns Component and it doesn`t need to any state her

- **CalculateDistanceToggle** this state to handle calc distance between two points (when it clicked the user can click on any point on map and choose if it is start point and click on other place and choose go to this location)

- **geofencesViewToggle** this state to handle show geofence when user click on veiw geofence btn

- **showViewWarningModal** this state to handle show WarningsInfo component

- **showAddWarningModal** this state to handle show AddModalWarnings component

- **Data_tableWarnings** this state store the warning that comes from warnings endpoint and display it in WarningsInfo component

- **showViewFencModal** this state to handle show GeofenceInfo component

- **showEditFencModal** this state to handle show EditModalGeofence component

- **ID** this state to store the Id that user clicked on it when edit Geofence

- **showAddFencModal** this state to handle show AddModalGeofence component

- **Data_tableFenc** this state store the Geofence that comes from Geofence endpoint and display it in ShowGeofence component

- **showViewMarkModal** this state to handle show LandMarksInfo component

- **showAddMarkModal** this state to handle show AddModalLandMarks component

- **Data_tableMarks** this state store the Landmark that comes from Landmark endpoint and display it in ShowLandMarks component

- **viewLandMarkstoggle** this state to handle show landmark btn

## Driver Name Button <a id = "driver_name"></a>

- [Click to go to the file](vscode://file/C:/Users/Almodather/Desktop/projects/saferoad_fms_web/components/maps/leafletchild.js#L1304)

## Actions <a id = "actions"></a>

**Props**

- Inherit it from the parent state see [track](#track).

- This actions Component is responsible for all actions when the user clicks on the actions button in popup and click on any button inside it like edit information

## ConfigPopup Button <a id = "config_popup_btn"></a>

- it is control the config popup dispaly when click on the upper left icon in the popup of Vehicle

- [Click to go to the file](vscode://file/C:/Users/Almodather/Desktop/projects/saferoad_fms_web/components/maps/leafletchild.js#L1304)

## Configration Popup <a id = "config_popup"></a>

- This Componet to controll the data that display on Vehicle popup

**Props**

- Inherit it from the parent state see [track](#track).

## downLoad Data Vehicles <a id = "downLoad_data_vehicles"></a>

- This Component is displayed when the user selects the number of cars and makes them a cluster you can find it in the upper left when hovering over an cluster on map

**Props**

- Inherit it from the parent state see [track](#track).

## track <a id = "track"></a>

**States:**

- **showConfigPopup** this state to handle click on action btn on Vehicle popup
- **clusterToggle** this state to make all cars that near to each other in one item or not
- **allTreeData** this state to store all vehicles of account
- **selectedVehicles** this state to store the cars that user selected from tree

**Functions:**

- handleDownLoadDataVehs -> This function handles the download of vehicle data when it pin on Map and cluster.
- handleDriverInfo -> this function to handle click on driver name on Vehicle popup to check if it has a data or not to redirect or not

**Custom Hooks**

- **useJoyride** this hooks to handle guide tour
- **useStreamDataState** this hooks to get and save settings(Vehicles) in localstorage

<h3 align="center">Documentation Widget Menu</h3>
<h4 align="center">
    Press on ctrl + shift + v to open it in preview mode and open your component on the other side
</h4>

## Table of Contents

-
- [Spinner](#spinner)
- [Marker Carrier](#marker_carrier)
- [Vehicle Provider](#vehicle_provider)
- [Main Filter](#main_filter)
- [Filter Tree](#filter_tree)
- [Inputs Filter](#inputs_filter)
- [Menu Tree](#menu_tree)
- [Config Menu Btn](#config_menu_btn)
- [Config Settings](#config_settings)

## Spinner <a id = "spinner"></a>

- This Component displayed if the user select more than 2000 Vehicle from the tree (the loading state is set to true from MenuTree component)

## Marker Carrier <a id = "marker_carrier"></a>

- This Component is displayed when the user select a Vehicle from the tree, to track it on the map

**Props**

- item => this Vehicle that the user selected
- oneVehicle => this to know if the user select more than one vehicle or not to control the zoom

## Vehicle Provider <a id = "vehicle_provider"></a>

- This Context to create a notification and update it

## Main Filter <a id = "main_filter"></a>

- This Component is the main numbers (all , active , offline)

**Props**

- setAllTreeData -> to filter the vehicles when the user select all or active or offline
- setSelectedVehicles -> to remove all selected vehicles when the user filter it
- setFilterStatus -> set filterStatus by the value that the user select it
- filterStatus -> this state store the status of the user select it

## Filter Tree <a id = "filter_tree"></a>

**Props**

- vehicleIcon -> this the path of cars img
- setSelectedVehicles -> see Props of [Main Filter](#main_filter)
- setAllTreeData -> see Props of [Main Filter](#main_filter)
- setFilterStatus -> see Props of [Main Filter](#main_filter)
- setclusterToggle -> to make cluster of vehicle or not
- filterStatus -> see Props of [Main Filter](#main_filter)
- selectedVehicles -> this store the vehicles that the user select it

## Inputs Filter <a id = "inputs_filter"></a>

**Props**

- setAllTreeData -> see Props of [Main Filter](#main_filter)
- filterStatus -> see Props of [Main Filter](#main_filter)
- setFilterStatus -> see Props of [Main Filter](#main_filter)
- selectedVehicles -> this store the vehicles that the user select it
- setSelectedVehicles -> see Props of [Main Filter](#main_filter)
- setclusterToggle -> to make cluster of vehicle or not

## Menu Tree <a id = "menu_tree"></a>

**Props**

- setSelectedVehicles -> see Props of [Main Filter](#main_filter)
- setclusterToggle -> to make cluster of vehicle or not
- setLoading -> this to set loading if the user select more than 2000 Vehicles
- selectedVehicles -> this store the vehicles that the user select it
- allTreeData -> see Props of [Main Filter](#main_filter)
- vehicleIcon -> this the path of cars img
- ToggleConfig -> this stores the toggled choices from ConfigSettings component

**Custom Hooks**

- useTree -> this hooks to create the tree structure with nested levels

**Functions**

- paginateVehicles -> this function is called in onCheck function if the user select more than 2000 vehicles and put the selected vehicles on map 1000 by 1000
- onCheck -> this function to controll the selected vehicles and put the selected vehicles on map
- loop -> this function to create the Ui of the tree

## Config Menu Btn <a id = "config_menu_btn"></a>

- This component is displayed on the upper left side if the user clicks on it the [Config Settings](#config_settings) component is displayed

## Config Settings <a id = "config_settings"></a>

this component is displayed if the user clicks on the [Config Menu Btn](#config_menu_btn)

import { useCallback, useState } from "react";
import DropDownSelector from "../molecules/DropDownSelector";
import { Option } from "../atoms/DropDownBox";
import { searchForLocation } from "../../helpers/open-meteo-helper";
import { OpenMeteoLocation } from "@/helpers/open-meteo-location";

const LocationLookup = ({ onSelect }: { onSelect: (selected: Option) => Promise<void> }) => {
    const [options, setOptions] = useState<Option[]>([])
    
    const onDropDownSelectorChange = useCallback(async (value: string) => {
        if (value.length < 3) {
            setOptions([])
            return
        }

        const locations = await searchForLocation(value)
        const filteredOptions = locations.map((location: OpenMeteoLocation) => ({
            id: location.id,
            display: `${location.name} (${location.country})`,
            value: location.name,
            meta: {
                lat: location.latitude,
                long: location.longitude
            }
        }))
        setOptions(filteredOptions)
    }, [])
    
    return (
        <DropDownSelector 
            placeholder="Enter the location you would like to visit..."
            onChange={onDropDownSelectorChange}
            options={options}
            onSelect={onSelect}
        />
    )
}
export default LocationLookup
'use client'

import LocationLookup from "@/components/organisms/LocationLookup"
import MainTemplate from "@/components/templates/MainTemplate"
import { useCallback, useEffect, useState } from "react"
import { Option } from "../components/atoms/DropDownBox";
import PageHeader from "@/components/atoms/PageHeader";
import LocationLookupResults from "@/components/organisms/LocationLookupResults";

export default () => {
    const [selectedLocation, setSelectedLocation] = useState<Option | null>(null)

    const onSelectedLocation = useCallback(async (selectedLocation: Option) => {
      setSelectedLocation(selectedLocation)
    }, [])

    // useEffect(() => {
    //   if (!selectedLocation) {
    //     return
    //   }

    // }, [selectedLocation])

    return (
      <MainTemplate>        
          <div>
              <PageHeader headerText="Welcome to the Weather Matcher app!" />
              {selectedLocation
                ? <LocationLookupResults selectedLocation={selectedLocation} />
                : <LocationLookup onSelect={onSelectedLocation} />
              }
          </div>
      </MainTemplate>
    )
}

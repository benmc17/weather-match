import { useEffect, useState } from "react";
import { Option } from "../atoms/DropDownBox";
import { getActivityRanking } from "@/server-actions/get-activity-ranking";

export default ({ selectedLocation }: { selectedLocation: Option}) => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const formData = new FormData();
            formData.append("lat", String(selectedLocation.meta.lat));
            formData.append("long", String(selectedLocation.meta.long));
            await getActivityRanking(formData);
            setLoading(false)
        };
        fetchData();
    }, [selectedLocation])

    return (
        //TODO: show results here
        <div>{selectedLocation.display}</div>
    )
}
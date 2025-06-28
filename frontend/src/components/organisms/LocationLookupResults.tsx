import { useEffect, useState } from "react";
import { Option } from "../atoms/DropDownBox";
import { ActivityRankingResponse } from "../../helpers/get-activity-ranking-response";
import { getActivityRanking } from "../../helpers/activity-ranking-helper";
import Paragraph from "../atoms/Paragraph";
import { config } from '../../config'
import ResultsBox from "../molecules/ResultsList";

const weatherToDisplayString: { [weatherCondition: string]: string } = {
    "RAINING": 'rainy',
    "SNOWING": 'snowy',
    "COLD": 'cold',
    "SUNNY": 'sunny',
    "HOT": 'hot',
    "WINDY": 'windy',
    "COMFORTABLE": 'comfortable',
}

const mapWeatherConditionsToDisplayValue = (weatherConditions: string[]) => {
    let displayString = ""

    for (let i = 0; i < weatherConditions.length; i++) {
        const weatherCondition = weatherToDisplayString[weatherConditions[i]]
        
        if (i === 0) {
            displayString += weatherCondition
        } else if (i == weatherConditions.length-1) {
            displayString += ` and ${weatherCondition}`
        } else {
            displayString += `, ${weatherCondition}`
        }
    }

    return displayString
}

const LocationLookupResults = ({ selectedLocation }: { selectedLocation: Option}) => {
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState<ActivityRankingResponse | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const results = await getActivityRanking(
                selectedLocation.meta.lat,
                selectedLocation.meta.long
            )

            if (results) {
                setResults(results)
                setLoading(false)
            }
        };
        fetchData();
    }, [])

    return (
        <div>
            {!loading && results != null 
                ? <>
                    <Paragraph>
                      You have selected {selectedLocation.value}, the weather over the next {config.timeframeDays} days is looking {mapWeatherConditionsToDisplayValue(results?.location.weatherConditions)}.
                    </Paragraph>
                    <Paragraph>
                        Here are some activities you might want to try:
                    </Paragraph>
                    <ResultsBox results={results.activities.map(activity => ({
                        displayValue: activity.name, 
                        rank: activity.rank, 
                        score: activity.suitabilityScore
                    }))} />
                  </>
                : <Paragraph>Thinking....</Paragraph>}
        </div>
    )
}
export default LocationLookupResults
import type { FoodDay } from 'interfaces'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { DayPicker } from "react-day-picker";
import { bg } from "react-day-picker/locale";
import { enUS } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next-config';

const FoodLog = () => {

    const navigate = useNavigate();
    const {t} = useTranslation();

    const [foodDays, setFoodDays] = useState<FoodDay[]>([])
    const [selectedFoodDay, setselectedFoodDayFoodDay] = useState<Date>();

    // used to prevent page from automatically navigating before date is selected
    const [initialSelection, setInitialSelection] = useState(true)

    useEffect(() => {

        const foodDaysLS = localStorage.getItem('food_days');
        if (foodDaysLS) {
            setFoodDays(JSON.parse(foodDaysLS));
        }

    }, [])

    useEffect(() => {
        if (initialSelection) {
            setInitialSelection(false)
            return
        }
    
        if (selectedFoodDay) {
            const formattedDate = new Date(selectedFoodDay.getTime() - selectedFoodDay.getTimezoneOffset() * 60000)
                .toISOString()
                .split('T')[0];
            navigate(`/food-log/${formattedDate}`)
        }
    }, [selectedFoodDay])

    return (
        <div className="w-full h-full font-rubik p-5"> 
            
            <p className="text-3xl text-black mt-5 font-semibold">
                {t('food-log')}
            </p>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2'></div>
            
            <DayPicker
                mode="single"
                selected={selectedFoodDay}
                onSelect={setselectedFoodDayFoodDay}
                captionLayout='dropdown'
                modifiers={{
                    highlighted: foodDays.map(foodDay => new Date(foodDay.created))
                }}
                modifiersClassNames={{
                    highlighted: 'bg-blue-500 text-white'
                }}
                locale={i18n.language == "en" ? enUS : bg}
            />

        </div>
    )
}

export default FoodLog
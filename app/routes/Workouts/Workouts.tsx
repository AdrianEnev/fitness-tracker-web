import { serverTimestamp } from 'firebase/firestore'
import type { Workout } from 'interfaces'
import React, { useEffect, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import { Outlet, useNavigate } from 'react-router'
import { timestampToDate } from '~/use/useTimestampToDate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

interface WorkoutElementProps {
    workout: Workout
    navigate: any
}

const Workouts = () => {

    const {t} = useTranslation();

    const WorkoutElement = ({workout, navigate}: WorkoutElementProps) => {

        const workoutDate = timestampToDate(workout.created).split(' ')[0].slice(0, -1)
    
        return (
            <button
                className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
                flex flex-row items-center
                hover:opacity-50 hover:bg-gray-100`}
                onClick={() => {

                    if (workout.title == "Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($") {
                        return
                    }

                    navigate(`workout/${workout.id}`)
                }}
            >
                <p className='text-base w-1/3'>
                    {
                        workout.title !== "Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($" ? 
                            workout.title : "Rest Day"
                    }
                </p>
    
                <p className='text-base w-1/3'>
                    {workoutDate}
                </p>
    
                <p className='text-base w-1/3'>
                    {workout.numberOfExercises}
                </p>
            </button>
        )
    }
    
    const FolderElement = (folder: any) => {
    
        const workoutCount = folder.workouts.length;
    
        return (
            <button
                className='w-full h-10 text-gray-600 border-y border-gray-100 px-3 
                flex items-center
                hover:opacity-50'
                onClick={() => {
                    setSelectedFolderWorkouts(folder.workouts)
                }}
            >
                <p className='text-base w-1/3'>
                    {folder.title}
                </p>
    
                <p className='text-base w-1/3'>
                    -
                </p>
    
                <p className='text-base w-1/3'>
                    {workoutCount}
                </p>
            </button>
        )
    }

    const [selectedFolderWorkouts, setSelectedFolderWorkouts] = useState<any[]>([])

    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [folders, setFolders] = useState<Workout[]>([])

    const navigate = useNavigate();

    useEffect(() => {
        const workoutsLS = localStorage.getItem('workouts');
        //console.log(workoutsLS)

        const folderMap: { [key: string]: Workout[] } = {}
        const workouts: Workout[] = []

        if (workoutsLS) {
            const workoutsData = JSON.parse(workoutsLS) as Workout[]
            workoutsData.forEach(workout => {
                if (workout.folderId) {
                    if (!folderMap[workout.folderId]) {
                        folderMap[workout.folderId] = []
                    }
                    folderMap[workout.folderId].push(workout)
                } else {
                    workouts.push(workout)
                }
            })
        }

        const folders: any[] = Object.keys(folderMap).map(folderId => {
            const middleDigit = folderId.replace('folder_', '')[Math.floor((folderId.replace('folder_', '').length - 1) / 2)];
            return {
                id: folderId,
                title: `Folder ${middleDigit}`,
                folderId: folderId,
                workouts: folderMap[folderId],
                exercises: [],
                colour: '',
                numberOfExercises: 0,
                created: serverTimestamp()
            }
        })

        setWorkouts(workouts)
        setFolders(folders)

    }, [])

    const workoutItems = [...workouts]
    const folderItems = [...folders]
    const selectedFolderWorkoutItems = [...selectedFolderWorkouts]

    const WorkoutsRenderer = ({ index, style }: { index: number, style: React.CSSProperties }) => {

        const sortedWorkoutItems = workoutItems.sort((a, b): any => {

            if (a.created && b.created) {
                const dateA = new Date(a.created.seconds * 1000)
                const dateB = new Date(b.created.seconds * 1000)
                return dateB.getTime() - dateA.getTime()
            }
        })

        const item = sortedWorkoutItems[index] || workoutItems[index]

        return (
            <div style={style}>
                <WorkoutElement key={item.id} {...item} workout={item} navigate={navigate} />
            </div>
        )
    }

    const FoldersRenderer = ({ index, style }: { index: number, style: React.CSSProperties }) => {

        const item = folderItems[index]

        return (
            <div style={style}>
                <FolderElement key={item.id} {...item} />
            </div>
        )
    }

    const SelectedFolderWorkoutsRenderer = ({ index, style }: { index: number, style: React.CSSProperties }) => {

        const sortedWorkoutItems = selectedFolderWorkoutItems.sort((a, b): any => {

            if (a.created && b.created) {
                const dateA = new Date(a.created.seconds * 1000)
                const dateB = new Date(b.created.seconds * 1000)
                return dateB.getTime() - dateA.getTime()
            }
        })

        const item = sortedWorkoutItems[index] || selectedFolderWorkoutItems[index]

        return (
            <div style={style}>
                <WorkoutElement key={item.id} {...item} workout={item} navigate={navigate} />
            </div>
        )
    }

    const [screenHeight, setScreenHeight] = useState(window.innerHeight)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(getScreenHeight());
            setScreenWidth(getScreenWidth());
        };
        console.log(screenHeight, screenWidth)

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])
    
    const getScreenHeight = () => {
        return window.innerHeight;
    }

    const getScreenWidth = () => {
        return window.innerWidth;
    }

    // if selectedFolderWorkouts empty => show all folders in the list element
    // else show all selected workouts for that folder in the same list element
    return (
        <div className="w-full h-full font-rubik p-5 overflow-y-auto"> 
                
            <p className="text-3xl text-black mt-5 font-semibold">
                {t('workout-splits')}
            </p>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2'></div>

            <div className='flex flex-row justify-between mt-2 mb-1 px-2'>

                <div className='flex flex-row'>
                    {selectedFolderWorkouts.length !== 0 && (
                        <button className='pt-2 px-2'
                        onClick={() => {
                            setSelectedFolderWorkouts([])
                        }}>
                        <FontAwesomeIcon icon={faArrowLeft} className='w-5 h-5 font-medium text-gray-700'/>
                        </button>
                    )}
                    <p className='text-xl font-medium text-yellow-400 w-[49%] mt-[6px]'>{t('folders')}</p>
                </div>
                
                <p className={`text-xl font-medium text-red-400 w-[49%] mt-[6px] ${screenWidth > 1050 ? "" : "hidden"}`}>{t('workouts')}</p>
            </div>

            <div className={`flex ${screenWidth > 1050 ? "flex-row" : "flex-col"} w-full h-[60%] gap-x-2`}>
                <div className={`
                    w-[49%] h-full border border-gray-200 rounded-md
                `}>
                    <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                        <p className='w-1/3 text-center text-lg mr-[-24px]'>{t('title')}</p>
                        <p className='w-1/3 text-center text-lg'>{t('created-on')}</p>
                        <p className='w-1/3 text-center text-lg ml-[-24px]'>{t('workouts')}</p>
                    </div>

                    <List
                        height={410}
                        width={'100%'}
                        itemCount={selectedFolderWorkouts.length === 0 ? folderItems.length : selectedFolderWorkoutItems.length}
                        itemSize={40}
                        layout="vertical"
                        
                    >
                        {selectedFolderWorkouts.length === 0 ? FoldersRenderer : SelectedFolderWorkoutsRenderer}
                    </List>

                </div>

                <p className={`text-xl font-medium text-red-400 w-[49%] mt-[6px] 
                    ${screenWidth > 1050 ? "hidden" : ""}`}>{t('workouts')}</p>

                <div className='w-[49%] h-full border border-gray-200 rounded-md'>

                    <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                        <p className='w-1/3 text-center text-lg mr-[-24px]'>{t('title')}</p>
                        <p className='w-1/3 text-center text-lg'>{t('created-on')}</p>
                        <p className='w-1/3 text-center text-lg ml-[-24px]'>{t('exercises')}</p>
                    </div>

                    <List
                        height={410}
                        width={'100%'}
                        itemCount={workoutItems.length}
                        itemSize={40}
                        layout="vertical"
                        
                    >
                        {WorkoutsRenderer}
                    </List>
                </div>
            </div>
        </div>
    )
}

export default Workouts
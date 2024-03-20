// ExerciseSearch.jsx
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

const ExerciseSearch = ({
  exercises,
  setSelectedExerciseId,
  setExerciseSearch,
}) => {
  const [filteredExercises, setFilteredExercises] = useState([])
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false)

  useEffect(() => {
    setFilteredExercises(exercises)
  }, [exercises])

  const handleSearchExercise = (query) => {
    const filteredExercises = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredExercises(filteredExercises)
  }

  return (
    <div className="relative">
      <Input
        type="text"
        onChange={(e) => {
          setExerciseSearch(e.target.value)
          handleSearchExercise(e.target.value)
        }}
        placeholder="Search exercises..."
        onClick={() => setShowExerciseDropdown(!showExerciseDropdown)}
      />
      {showExerciseDropdown && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800">
          {filteredExercises.length > 0 ? (
            <ul className="py-1">
              {filteredExercises.map((exercise) => (
                <li
                  key={exercise.id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => {
                    setSelectedExerciseId(exercise.id)
                    setExerciseSearch(exercise.name)
                    setShowExerciseDropdown(false)
                  }}
                >
                  {exercise.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-gray-600 dark:text-gray-400">
              No exercises found.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ExerciseSearch

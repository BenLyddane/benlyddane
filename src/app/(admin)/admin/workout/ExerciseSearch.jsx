import React, { useState, useEffect } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

const ExerciseSearch = ({
  exercises,
  selectedExercise,
  setSelectedExercise,
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

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise)
    setExerciseSearch(exercise.name)
    setShowExerciseDropdown(false)
  }

  return (
    <Select
      value={selectedExercise?.id}
      onValueChange={(value) =>
        handleExerciseSelect(exercises.find((ex) => ex.id === value))
      }
      placeholder="Search exercises..."
      onOpenChange={setShowExerciseDropdown}
    >
      <SelectTrigger>
        <SelectValue>
          {selectedExercise ? selectedExercise.name : 'Search exercises...'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="py-1">
          {showExerciseDropdown && (
            <>
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise) => (
                  <SelectItem
                    key={exercise.id}
                    value={exercise.id}
                    onClick={() => handleExerciseSelect(exercise)}
                  >
                    {exercise.name}
                  </SelectItem>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  No exercises found.
                </div>
              )}
            </>
          )}
        </div>
      </SelectContent>
    </Select>
  )
}

export default ExerciseSearch

'use client'
import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@/utils'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverContent = React.forwardRef(
  ({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 max-w-md rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  ),
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

const AddExercise = ({
  currentWorkout,
  workoutExercises,
  setWorkoutExercises,
}) => {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [exercises, setExercises] = useState([])
  const [sets, setSets] = useState('')
  const [minReps, setMinReps] = useState('')
  const [maxReps, setMaxReps] = useState('')
  const [weight, setWeight] = useState('')
  const [restTimerDuration, setRestTimerDuration] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const fetchExercises = async () => {
      const { data, error } = await supabase.from('exercises').select('*')
      if (!error && data) {
        setExercises(data)
      } else {
        console.error('Error fetching exercises:', error)
      }
    }
    fetchExercises()
  }, [])

  const handleAddExercise = async () => {
    if (
      selectedExercise &&
      sets &&
      minReps &&
      maxReps &&
      weight &&
      currentWorkout
    ) {
      const maxOrder = workoutExercises.reduce(
        (max, curr) => (curr.order > max ? curr.order : max),
        0,
      )
      const newOrder = maxOrder + 1

      const exercise = {
        workout_id: currentWorkout.id,
        exercise_id: selectedExercise.id,
        sets: parseInt(sets),
        min_reps: parseInt(minReps),
        max_reps: parseInt(maxReps),
        weight: parseFloat(weight),
        rest_timer_duration: restTimerDuration
          ? parseInt(restTimerDuration)
          : null,
        order: newOrder,
      }

      setSelectedExercise(null)
      setSets('')
      setMinReps('')
      setMaxReps('')
      setWeight('')
      setRestTimerDuration('')

      const { data, error } = await supabase
        .from('workout_exercises')
        .insert([exercise])
        .select('*, exercise:exercises(*)')
        .single()

      if (!error && data) {
        setWorkoutExercises([...workoutExercises, data])
        toast({
          title: 'Success',
          description: 'Exercise added to workout successfully.',
          variant: 'success',
        })
      } else {
        console.error('Error adding exercise:', error)
        toast({
          title: 'Error',
          description: 'Failed to add exercise to workout.',
          variant: 'destructive',
        })
      }
    } else {
      console.warn('Invalid input for adding exercise')
    }
  }

  const isFormComplete =
    selectedExercise && sets && minReps && maxReps && weight && currentWorkout

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">Exercise</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {selectedExercise ? (
                    <>{selectedExercise.name}</>
                  ) : (
                    <>+ Select exercise</>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <ExerciseList
                  exercises={exercises}
                  setOpen={setOpen}
                  setSelectedExercise={setSelectedExercise}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <Input
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              placeholder="Sets"
              className="md:w-30 w-full"
            />
            <Input
              type="number"
              value={minReps}
              onChange={(e) => setMinReps(e.target.value)}
              placeholder="Min Reps"
              className="md:w-30 w-full"
            />
            <Input
              type="number"
              value={maxReps}
              onChange={(e) => setMaxReps(e.target.value)}
              placeholder="Max Reps"
              className="md:w30 w-full"
            />
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight (lbs)"
              className="md:w-30 w-full"
            />
            <Input
              type="number"
              value={restTimerDuration}
              onChange={(e) => setRestTimerDuration(e.target.value)}
              placeholder="Timer (sec)"
              className="md:w-30 w-full"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleAddExercise} disabled={!isFormComplete}>
            Add Exercise
          </Button>
        </div>
        {!currentWorkout && (
          <div className="mt-2 text-sm text-red-500">
            Please select a workout before adding exercises.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ExerciseList({ exercises, setOpen, setSelectedExercise }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredExercises, setFilteredExercises] = useState(exercises)

  useEffect(() => {
    const filtered = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredExercises(filtered)
  }, [exercises, searchTerm])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="overflow-hidden rounded-md border bg-popover p-4 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
      <div className="flex items-center border-b px-3">
        <input
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Search exercise..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
        {filteredExercises.length === 0 ? (
          <div className="py-6 text-center text-sm">No results found.</div>
        ) : (
          filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                setSelectedExercise(exercise)
                setOpen(false)
              }}
            >
              <div>
                <p className="font-medium">{exercise.name}</p>
                <p className="text-xs text-muted-foreground">
                  {exercise.body_part}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AddExercise

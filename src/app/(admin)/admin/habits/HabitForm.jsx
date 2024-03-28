// HabitForm.js
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import TimePicker from '@/components/ui/time-picker'
import { Toggle } from '@/components/ui/toggle'
import { format } from 'date-fns'

const HabitForm = ({ onSubmit }) => {
  const [newHabit, setNewHabit] = useState('')
  const [dueFrequency, setDueFrequency] = useState('daily')
  const [dueTimes, setDueTimes] = useState([new Date(0, 0, 0, 8, 0)])
  const [dueWeekdays, setDueWeekdays] = useState([])
  const [reward, setReward] = useState('')

  const handleSubmit = () => {
    onSubmit({
      name: newHabit,
      due_frequency: dueFrequency,
      due_times: dueTimes.map((time) => format(time, 'HH:mm')),
      due_weekdays: dueWeekdays,
      reward,
    })
    setNewHabit('')
    setDueFrequency('daily')
    setDueTimes([new Date(0, 0, 0, 8, 0)])
    setDueWeekdays([])
    setReward('')
  }

  return (
    <div>
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Enter a new habit"
          className="flex"
        />
        <Select
          onValueChange={setDueFrequency}
          defaultValue="daily"
          className="w-40"
        >
          <SelectTrigger>
            <SelectValue placeholder="Frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setDueTimes([...dueTimes, new Date(0, 0, 0, 8, 0)])}
        >
          Add Time
        </Button>
        <Button onClick={handleSubmit}>Add Habit</Button>
      </div>
      {dueTimes.map((time, index) => (
        <div key={index} className="mt-4 flex items-center space-x-4">
          <TimePicker
            value={time}
            onChange={(newTime) => {
              const newTimes = [...dueTimes]
              newTimes[index] = newTime
              setDueTimes(newTimes)
            }}
          />
          <Toggle
            pressed={time.getHours() < 12}
            onPressedChange={(isAM) => {
              const newTimes = [...dueTimes]
              const hours = isAM ? time.getHours() : time.getHours() + 12
              newTimes[index] = new Date(time.setHours(hours))
              setDueTimes(newTimes)
            }}
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
          >
            {time.getHours() < 12 ? 'AM' : 'PM'}
          </Toggle>
          <Button
            variant="ghost"
            onClick={() => {
              const newTimes = [...dueTimes]
              newTimes.splice(index, 1)
              setDueTimes(newTimes)
            }}
          >
            Remove
          </Button>
        </div>
      ))}
      {dueFrequency === 'weekly' && (
        <div className="mt-4">
          <Label>Select Weekdays</Label>
          <div className="mt-2 flex space-x-4">
            {[
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ].map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  checked={dueWeekdays.includes(day.toLowerCase())}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setDueWeekdays([...dueWeekdays, day.toLowerCase()])
                    } else {
                      setDueWeekdays(
                        dueWeekdays.filter((d) => d !== day.toLowerCase()),
                      )
                    }
                  }}
                />
                <Label className="text-sm">{day}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4">
        <Label>Reward</Label>
        <Input
          type="text"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          placeholder="Enter a reward for completing the habit"
          className="mt-2"
        />
      </div>
    </div>
  )
}

export default HabitForm

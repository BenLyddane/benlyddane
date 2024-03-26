'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client' // Assuming this is your setup path
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

// Initialize the Supabase client
const supabase = createClient()

const Measurements = () => {
  const [formData, setFormData] = useState({})
  const { toast } = useToast()
  const basicInputs = [
    { name: 'weight', unit: 'lbs', placeholder: 'Weight', type: 'number' },
    { name: 'height', unit: 'inches', placeholder: 'Height', type: 'number' },
  ]

  const bodyMeasurementsInputs = [
    {
      name: 'waistMeasurement',
      unit: 'inches',
      placeholder: 'Waist Measurement',
      type: 'number',
    },
    {
      name: 'hipMeasurement',
      unit: 'inches',
      placeholder: 'Hip Measurement',
      type: 'number',
    },
    {
      name: 'neckMeasurement',
      unit: 'inches',
      placeholder: 'Neck Measurement',
      type: 'number',
    },
    {
      name: 'armMeasurement',
      unit: 'inches',
      placeholder: 'Arm Measurement',
      type: 'number',
    },
    {
      name: 'thighMeasurement',
      unit: 'inches',
      placeholder: 'Thigh Measurement',
      type: 'number',
    },
    {
      name: 'calfMeasurement',
      unit: 'inches',
      placeholder: 'Calf Measurement',
      type: 'number',
    },
  ]

  // Function to fetch existing measurements
  const fetchMeasurements = async () => {
    const user_id = supabase.auth.user()?.id // Make sure the user is authenticated
    if (!user_id) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      })
      return
    }

    let { data, error, status } = await supabase
      .from('user_logs')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (error && status !== 406) {
      toast({
        title: 'Error fetching measurements',
        description: error.message,
        variant: 'destructive',
      })
    } else if (data) {
      setFormData(data)
    }
  }

  useEffect(() => {
    fetchMeasurements()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user_id = supabase.auth.user()?.id
    if (!user_id) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      })
      return
    }

    // Add or update logic here based on your application's needs
    const { error } = await supabase
      .from('user_logs')
      .upsert({ ...formData, user_id }, { onConflict: 'user_id' })

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Measurements updated successfully',
        variant: 'success',
      })
    }
  }

 

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          {inputs.map(({ name, label, type }) => (
            <div key={name} className="mb-4">
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              <Input
                id={name}
                name={name}
                type={type}
                value={formData[name] || ''}
                onChange={handleChange}
                className="mt-1 block w-full"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            Submit Measurements
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default Measurements

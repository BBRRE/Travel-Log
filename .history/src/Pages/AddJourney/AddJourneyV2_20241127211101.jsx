import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { SideBar } from '../../Components/SideBar'
import Gallery from '../../Components/Gallery'

const AddJourneyV2 = () => {
  const [overviewImage, setOverviewImage] = useState(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      journeyName: '',
      description: '',
      startingLocation: '',
      continent: 'Europe',
      overviewImage: null,
      activities: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "activities"
  })

  const handleOverviewImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setOverviewImage(URL.createObjectURL(file))
    }
  }

  const handleActivityImageUpload = (event, index) => {
    const files = Array.from(event.target.files)
    const imageUrls = files.map(file => URL.createObjectURL(file))

    // Note: In react-hook-form, you'd typically handle this differently
    // This is a simplified approach
    const updatedActivities = [...fields]
    updatedActivities[index] = {
      ...updatedActivities[index],
      images: imageUrls
    }
  }

  const onSubmit = (data) => {
    // Process form data
    console.log(data)
    // Add your submission logic here
  }

  return (
    <div className="2xl:flex">
      <SideBar currentPage="add" />
      <form onSubmit={handleSubmit(onSubmit)} className='w-full h-auto mx-auto'>
        <div className="flex flex-col mb-[100px] mt-12 mx-auto max-w-[500px] justify-center items-center gap-24">
          {/* Overview Image Upload */}
          <div className='relative w-full max-w-[500px] h-[200px] z-10 cursor-pointer mx-auto'>
            <svg width="0" height="0" viewBox="0 0 100 100" className="">
              <defs>
                <clipPath id="curvedMask" clipPathUnits="objectBoundingBox">
                  <path d="M 0,0 L 1.002,0 L 1,0.833 C 0.745,0.972 0.195,0.689 0,0.833 L 0,0 Z"></path>
                </clipPath>
              </defs>
            </svg>
            <input
              style={{
                clipPath: 'url(#curvedMask)',
                WebkitClipPath: 'url(#curvedMask)',
                WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 40%)'
              }}
              type="file"
              className="z-10 absolute top-0 left-0 w-full h-full p-4"
              accept="image/*"
              {...register('overviewImage')}
              onChange={handleOverviewImageUpload}
            />
            {overviewImage && (
              <img
                src={overviewImage}
                className="w-full h-full object-cover rounded-t-2xl bg-gray-600"
                style={{
                  clipPath: 'url(#curvedMask)',
                  WebkitClipPath: 'url(#curvedMask)',
                  WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 40%)'
                }}
                alt="Overview"
              />
            )}
          </div>

          {/* Journey Details */}
          <div className='flex flex-col gap-4 w-full max-w-[500px]'>
            <input
              {...register('journeyName', {
                required: 'Journey name is required',
                maxLength: {
                  value: 30,
                  message: 'Journey name must be 30 characters or less'
                }
              })}
              placeholder="Nickname for the journey"
              className="rounded-md h-[2rem] pl-[5px]"
            />
            {errors.journeyName && <span className="text-red-500">{errors.journeyName.message}</span>}

            <textarea
              {...register('description', {
                required: 'Description is required',
                maxLength: {
                  value: 215,
                  message: 'Description must be 215 characters or less'
                }
              })}
              placeholder="What was good about this..."
              className="rounded-md h-[4rem] pl-[5px] resize-none"
            />
            {errors.description && <span className="text-red-500">{errors.description.message}</span>}

            <div className='flex gap-4'>
              <input
                {...register('startingLocation', {
                  required: 'Starting location is required',
                  maxLength: {
                    value: 100,
                    message: 'Location must be 100 characters or less'
                  }
                })}
                placeholder="Starting Location: Country, City"
                className="rounded-md h-[2rem] pl-[5px] w-full"
              />

              <select
                {...register('continent')}
                className="h-[34px] px-3 rounded-md text-center"
              >
                <option value="Africa">Africa</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="NAmerica">N.America</option>
                <option value="SAmerica">S.America</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>
          </div>

          {/* Activities */}
          <div className='flex flex-col gap-20 w-full max-w-[500px]'>
            {fields.map((field, index) => (
              <div key={field.id} className='flex flex-col gap-2 w-full'>
                {index > 0 && (
                  <div className='flex flex-col'>
                    <div className="flex gap-[10px] flex-col sm:flex-row mb-[10px]">
                      <select
                        {...register(`activities.${index}.transportType`)}
                        className="rounded-md h-[2rem] pl-[5px] w-full"
                      >
                        <option value="">Select Transport</option>
                        <option value="car">Car</option>
                        <option value="bus">Bus</option>
                        <option value="train">Train</option>
                        <option value="plane">Plane</option>
                        <option value="boat">Boat</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="number"
                        {...register(`activities.${index}.transportCost`, {
                          valueAsNumber: true
                        })}
                        placeholder="Cost of transport"
                        className="rounded-md h-[2rem] pl-[5px] w-full"
                        step={0.01}
                      />
                    </div>
                  </div>
                )}

                <div className='w-full h-auto flex flex-col gap-2'>
                  <div className="relative w-full h-auto border-black border-dashed border-4">
                    <input
                      type="file"
                      className="z-10 absolute top-0 left-0 w-full h-full p-4"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleActivityImageUpload(e, index)}
                    />
                    <Gallery images={field.images || []} />
                  </div>

                  <input
                    {...register(`activities.${index}.locationName`, {
                      required: 'Location name is required',
                      maxLength: {
                        value: 30,
                        message: 'Location name must be 30 characters or less'
                      }
                    })}
                    placeholder="Hotel, Restaurant, Resort Name..."
                    className="rounded-md h-[2rem] pl-[5px]"
                  />

                  <textarea
                    {...register(`activities.${index}.description`, {
                      required: 'Description is required',
                      maxLength: {
                        value: 250,
                        message: 'Description must be 250 characters or less'
                      }
                    })}
                    placeholder="How long was your stay, important info..."
                    className="rounded-md h-[4rem] pl-[5px] resize-none"
                  />

                  <div className='flex gap-2'>
                    <input
                      {...register(`activities.${index}.location`, {
                        required: 'Activity location is required',
                        maxLength: {
                          value: 100,
                          message: 'Location must be 100 characters or less'
                        }
                      })}
                      placeholder="Starting Location: Country, City"
                      className="rounded-md h-[2rem] pl-[5px] w-full"
                    />
                    <input
                      type="number"
                      {...register(`activities.${index}.price`, {
                        required: 'Price is required',
                        valueAsNumber: true
                      })}
                      placeholder="Price of activity"
                      className="rounded-md h-[2rem] pl-[5px] w-full"
                      step={0.01}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className='flex w-full'>
            <button
              type="button"
              onClick={() => append({})}
              className='w-full border-4 border-black flex items-center justify-center'
            >
              Add Activity
            </button>
            <button
              type="button"
              onClick={() => fields.length > 0 && remove(fields.length - 1)}
              className='w-full border-4 border-black flex items-center justify-center'
            >
              Remove Activity
            </button>
            <button
              type="submit"
              className='w-full border-4 border-black flex items-center justify-center'
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddJourneyV2
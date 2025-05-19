import React from 'react'
import { Input } from '../ui/input'

interface FormTagInputProps {
    tags: string[]
    value?: string
    handleTags: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FormTagInput = ({tags, value = "", handleTags}: FormTagInputProps) => {
  return (
    <div className="flex flex-col gap-1">
    <ul className="flex gap-2">
      {tags.length === 0 ? (
        <li className="bg-gray-100 px-2 py-1 rounded-md text-sm text-gray-500 italic">
          No tags
        </li>
      ) : (
        tags.map((tag) => (
          <li className="bg-gray-100 px-2 py-1 rounded-md" key={tag}>
            {tag}
          </li>
        ))
      )}
    </ul>
    <Input
      placeholder="Tags"
      value={value}
      onChange={(e) => handleTags(e)}
      className="focus:ring-2 ring-indigo-400"
    />
  </div>
  )
}

export default FormTagInput
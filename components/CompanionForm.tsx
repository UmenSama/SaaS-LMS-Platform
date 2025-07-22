"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { subjects } from "@/constants"


const formSchema = z.object({
  name: z.string().min(1,{message: "Companion is required"}),
  subject: z.string().min(1,{message: "Subject is required"}),
  topic: z.string().min(1,{message: "Topic is required"}),
  voice: z.string().min(1,{message: "Voice is required"}),
  style: z.string().min(1,{message: "Style is required"}),
  duration: z.number().min(1,{message: "Duration is required"}),

})

const CompanionForm = () => {

    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      subject: '',
      topic: '',
      voice: '',
      style: '',
      duration: 15,
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      
      {/* First form field - Companion name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Companion name</FormLabel>
            <FormControl>
              <Input placeholder="Enter the companion name" {...field} className="input" />
            </FormControl>
            <FormDescription>
              This is your public display name.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Second form field - Subject */}
<FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <FormControl>
                <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                        {subjects.map((subject) => (
                            <SelectItem
                                value={subject}
                                key={subject}
                                className="capitalize"
                            >
                                {subject}
                            </SelectItem>
                         ))}
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


<FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What should the companion help with?</FormLabel>
            <FormControl>
              <Input placeholder="Ex. Derivatives & Integrals" {...field} className="input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

<FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice</FormLabel>
            <FormControl>
                <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select the voice" />
                    </SelectTrigger>
                    <SelectContent>
                            <SelectItem value ="male">
                                Male
                            </SelectItem>
                            <SelectItem value ="female">
                                Female
                            </SelectItem>
                        
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


<FormField
        control={form.control}
        name="style"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Style</FormLabel>
            <FormControl>
                <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select the style" />
                    </SelectTrigger>
                    <SelectContent>
                            <SelectItem value ="Formal">
                                Formal
                            </SelectItem>
                            <SelectItem value ="Casual">
                                Casual
                            </SelectItem>
                        
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


<FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated durantion in minutes</FormLabel>
            <FormControl>
              <Input type='number' placeholder="15" {...field} className="input" />
            </FormControl>
            
            <FormMessage />
          </FormItem>
        )}
      />


      <Button type="submit" className="w-full cursor-pointer">Build Your Companion</Button>
    </form>
  </Form>
  )
}

export default CompanionForm
